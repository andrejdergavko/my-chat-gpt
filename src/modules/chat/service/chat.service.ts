import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { conversationsService } from '@/modules/conversations/service/conversations.service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class ChatService {
  async processMessage(
    messages: ChatMessage[],
    conversationId?: string,
  ): Promise<{
    conversationId: string;
    stream: ReadableStream<Uint8Array>;
  }> {
    if (!messages?.length) {
      throw new Error('Messages are required');
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    let finalConversationId = conversationId;
    const userMessage = messages[messages.length - 1];

    if (!finalConversationId) {
      finalConversationId = await conversationsService.createConversation(
        user.id,
        userMessage.content,
        supabase,
      );
    }

    await this.saveMessage(
      finalConversationId,
      user.id,
      userMessage.content,
      'user',
      supabase,
    );

    const stream = await this.createChatStream(
      messages,
      finalConversationId,
      user.id,
      supabase,
    );

    return { conversationId: finalConversationId, stream };
  }

  async getConversationWithMessages(conversationId: string): Promise<{
    conversation: { id: string; title: string; user_id: string };
    messages: Array<{
      id: string;
      content: string;
      role: string;
      created_at: string;
    }>;
  }> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const conversation = await conversationsService.getConversation(
      conversationId,
      user.id,
      supabase,
    );
    const messages = await this.getMessages(conversationId, supabase);

    return { conversation, messages };
  }

  private async getMessages(
    conversationId: string,
    supabase: SupabaseClient,
  ): Promise<
    Array<{ id: string; content: string; role: string; created_at: string }>
  > {
    const { data, error } = await supabase
      .from('messages')
      .select('id, content, role, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data || [];
  }

  private async saveMessage(
    conversationId: string,
    userId: string,
    content: string,
    role: 'user' | 'assistant',
    supabase: SupabaseClient,
  ): Promise<void> {
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      user_id: userId,
      content,
      role,
    });

    if (error) {
      throw new Error(`Failed to save ${role} message: ${error.message}`);
    }
  }

  private async createChatStream(
    messages: ChatMessage[],
    conversationId: string,
    userId: string,
    supabase: SupabaseClient,
  ): Promise<ReadableStream<Uint8Array>> {
    const systemMessage = messages.find((m) => m.role === 'system');
    const input = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const stream = await openai.responses.create({
      model: 'gpt-4.1-mini',
      instructions: systemMessage?.content ?? undefined,
      input,
      stream: true,
    });

    const encoder = new TextEncoder();

    return new ReadableStream({
      start: async (controller) => {
        let fullAssistantContent = '';

        try {
          for await (const event of stream) {
            if (event.type === 'response.output_text.delta') {
              const text = event.delta;
              fullAssistantContent += text;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text, conversationId })}\n\n`,
                ),
              );
            }
          }

          await this.saveMessage(
            conversationId,
            userId,
            fullAssistantContent,
            'assistant',
            supabase,
          );

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Stream error';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`),
          );
          controller.close();
        }
      },
    });
  }
}

export const chatService = new ChatService();
