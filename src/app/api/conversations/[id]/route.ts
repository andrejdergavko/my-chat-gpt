import { chatService } from '@/modules/chat/service/chat.service';

export async function GET(
  _request: unknown,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: conversationId } = await params;
    const { conversation, messages } =
      await chatService.getConversationWithMessages(conversationId);

    return new Response(
      JSON.stringify({
        conversation,
        messages,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
