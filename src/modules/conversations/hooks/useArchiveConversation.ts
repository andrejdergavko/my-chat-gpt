import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useArchiveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(
        `/api/conversations/${conversationId}/archive`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to archive conversation');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

