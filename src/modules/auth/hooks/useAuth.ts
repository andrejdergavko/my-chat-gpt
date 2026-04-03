'use client';

import { useQuery } from '@tanstack/react-query';

interface AuthResponse {
  user: any;
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');

      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  return {
    isLoading,
    isAuthenticated: !!data?.user,
    user: data?.user || null,
    error,
  };
}

