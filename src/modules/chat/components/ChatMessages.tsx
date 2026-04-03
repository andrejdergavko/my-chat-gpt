import { cn } from '@/lib/utils';
import { CopyButton } from '@/shared/components/CopyButton';

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
    <div className="flex-1 w-full overflow-y-auto">
      <div className="flex flex-col gap-10 p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
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
                    ? 'max-w-[540px] bg-input rounded-3xl px-4 py-2 text-foreground'
                    : 'max-w-full bg-transparent text-foreground',
                )}
              >
                <p className="text-[16px] font-medium">{message.content}</p>
                {message.role === 'assistant' && (
                  <div className="mt-2 flex items-center gap-2 ml-[-6px]">
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
