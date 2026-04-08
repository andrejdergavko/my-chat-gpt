import { NextRequest } from 'next/server';
import { chatService } from '@/modules/chat/service/chat.service';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId } = (await request.json()) as {
      messages: ChatMessage[];
      conversationId?: string;
    };

    const { stream } = await chatService.processMessage(
      messages,
      conversationId,
    );

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
