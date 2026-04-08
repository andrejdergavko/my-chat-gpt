import { conversationsService } from '@/modules/conversations/service/conversations.service';

export async function GET() {
  try {
    const conversations = await conversationsService.getConversations();

    return new Response(JSON.stringify({ conversations }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
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
