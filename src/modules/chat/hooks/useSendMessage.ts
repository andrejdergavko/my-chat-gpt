import { useRef, useState } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface UseSendMessageProps {
  conversationId?: string;
  onMessagesUpdate: (updater: (prev: Message[]) => Message[]) => void;
  onConversationIdUpdate?: (id: string) => void;
}

export function useSendMessage({
  conversationId,
  onMessagesUpdate,
  onConversationIdUpdate,
}: UseSendMessageProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (
    messages: Message[],
    content: string,
  ): Promise<boolean> => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    const apiMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    onMessagesUpdate((prev) => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);

    let receivedConversationId: string | undefined;

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          conversationId: conversationId || undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop()!;

        for (const part of parts) {
          const data = part.replace(/^data: /, '').trim();
          if (!data || data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data) as {
              text?: string;
              error?: string;
              conversationId?: string;
            };

            if (parsed.conversationId && !conversationId) {
              receivedConversationId = parsed.conversationId;
            }

            if (parsed.text) {
              onMessagesUpdate((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + parsed.text }
                    : msg,
                ),
              );
            }

            if (parsed.error) {
              onMessagesUpdate((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: `Ошибка: ${parsed.error}` }
                    : msg,
                ),
              );
            }
          } catch {
            // ignore malformed JSON chunks
          }
        }
      }

      if (receivedConversationId && !conversationId && onConversationIdUpdate) {
        onConversationIdUpdate(receivedConversationId);
      }

      return true;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError')
        return false;

      onMessagesUpdate((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: 'Произошла ошибка при получении ответа.' }
            : msg,
        ),
      );

      return false;
    } finally {
      setIsStreaming(false);
    }
  };

  const cancel = () => {
    abortControllerRef.current?.abort();
  };

  return { sendMessage, cancel, isStreaming };
}
