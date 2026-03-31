import { NextResponse } from 'next/server';
import { ConversationsService } from '@/modules/conversations/service/conversations.service';

export async function GET() {
  try {
    const service = new ConversationsService();
    const conversations = await service.getAllConversations();

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch conversations',
      },
      { status: 500 },
    );
  }
}
