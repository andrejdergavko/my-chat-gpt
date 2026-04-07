import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/shared/components/CopyButton';
import { StreamingIndicator } from '@/shared/components/StreamingIndicator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isStreaming?: boolean;
}

export function ChatMessages({ messages, isStreaming }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantId =
    [...messages].reverse().find((m) => m.role === 'assistant')?.id ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="w-full flex-1 overflow-y-auto">
      <div className="flex flex-col gap-10 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <p>Начни разговор</p>
          </div>
        ) : (
          messages.map((message) => {
            const isActiveStream =
              isStreaming &&
              message.role === 'assistant' &&
              message.id === lastAssistantId;

            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'rounded-lg',
                    message.role === 'user'
                      ? 'bg-input text-foreground max-w-[540px] rounded-3xl px-4 py-2'
                      : 'text-foreground max-w-full bg-transparent',
                  )}
                >
                  {message.role === 'assistant' ? (
                    <>
                      {isActiveStream && !message.content ? (
                        <StreamingIndicator />
                      ) : (
                        <div className="markdown-content text-[16px]">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-[16px] font-medium">{message.content}</p>
                  )}
                  {message.role === 'assistant' &&
                    !isActiveStream &&
                    message.content && (
                      <div className="mt-2 ml-[-6px] flex items-center gap-2">
                        <CopyButton content={message.content} />
                      </div>
                    )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
