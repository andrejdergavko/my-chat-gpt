import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth';
import { Conversation } from '../types/conversation';

export function useConversations() {
  const { isAuthenticated } = useAuth();

  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await fetch('/api/conversations');

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      return data.conversations;
    },
    enabled: isAuthenticated,
  });
}
