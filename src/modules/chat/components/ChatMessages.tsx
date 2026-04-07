import { cn } from '@/lib/utils';
import { CopyButton } from '@/shared/components/CopyButton';
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
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="w-full flex-1 overflow-y-auto">
      <div className="flex flex-col gap-10 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <p>Начни разговор</p>
          </div>
        ) : (
          messages.map((message) => (
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
                  <div className="markdown-content text-[16px]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-[16px] font-medium">{message.content}</p>
                )}
                {message.role === 'assistant' && (
                  <div className="mt-2 ml-[-6px] flex items-center gap-2">
                    <CopyButton content={message.content} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
