import { useAuth } from '@/modules/auth';
import { useQuery } from '@tanstack/react-query';
import { type Message } from './useSendMessage';

interface ConversationResponse {
  conversation: { id: string; title: string; user_id: string };
  messages: Array<{
    id: string;
    content: string;
    role: string;
    created_at: string;
  }>;
}

export async function fetchConversationMessages(
  conversationId: string,
): Promise<Message[]> {
  const response = await fetch(`/api/conversations/${conversationId}`);

  if (!response.ok) {
    throw new Error('Failed to load conversation');
  }

  const data: ConversationResponse = await response.json();

  return data.messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    role: msg.role as 'user' | 'assistant',
    timestamp: new Date(msg.created_at),
  }));
}

export function useConversationMessages(conversationId?: string) {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery<Message[]>({
    queryKey: ['conversation', conversationId],
    queryFn: () => fetchConversationMessages(conversationId!),
    enabled: !!conversationId && isAuthenticated,
  });

  return { messages: data ?? [], isLoading, error: error?.message || null };
}
