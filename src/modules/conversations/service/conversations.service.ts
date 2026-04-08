import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { Conversation } from '../types';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class ConversationsService {
  async getAllConversations(): Promise<Conversation[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    return data || [];
  }

  async getConversations(): Promise<
    Array<{
      id: string;
      title: string;
      description: string | null;
      created_at: string;
      updated_at: string;
      is_archived: boolean;
    }>
  > {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('conversations')
      .select('id, title, description, created_at, updated_at, is_archived')
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    return data || [];
  }

  async archiveConversation(conversationId: string): Promise<void> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('conversations')
      .update({ is_archived: true })
      .eq('id', conversationId)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to archive conversation: ${error.message}`);
    }
  }

  async getConversation(
    conversationId: string,
    userId: string,
    supabase: SupabaseClient,
  ): Promise<{ id: string; title: string; user_id: string }> {
    const { data, error } = await supabase
      .from('conversations')
      .select('id, title, user_id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new Error('Conversation not found');
    }

    return data;
  }

  async createConversation(
    userId: string,
    messages: ChatMessage[],
    supabase: SupabaseClient,
  ): Promise<string> {
    const userMessage = messages[messages.length - 1];
    const title = userMessage.content.substring(0, 50) || 'New Conversation';

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }

    return data.id;
  }
}

export const conversationsService = new ConversationsService();
