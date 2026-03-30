'use client';

import { useEffect, useState } from 'react';
import { Conversation } from '@/modules/conversations/types';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data = await response.json();
        setConversations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Conversations</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && conversations.length === 0 && <p>No conversations found</p>}

      {!loading && conversations.length > 0 && (
        <ul>
          {conversations.map((conv) => (
            <li key={conv.id}>
              <strong>{conv.title}</strong>
              <p>Created: {new Date(conv.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
