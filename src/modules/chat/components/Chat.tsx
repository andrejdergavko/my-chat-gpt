'use client';

import { useState } from 'react';
import { useConversationMessages } from '../hooks/useConversationMessages';
import { useSendMessage, type Message } from '../hooks/useSendMessage';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';

interface ChatProps {
  conversationId?: string;
}

export function Chat({ conversationId: initialConversationId }: ChatProps) {
  const { messages: loadedMessages, isLoading } = useConversationMessages(
    initialConversationId,
  );

  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId,
  );

  const allMessages = [...loadedMessages, ...newMessages];

  const { sendMessage, isStreaming } = useSendMessage({
    conversationId,
    onMessagesUpdate: setNewMessages,
    onConversationIdUpdate: setConversationId,
  });

  const handleSendMessage = async (content: string) => {
    await sendMessage(allMessages, content);
  };

  return (
    <div className="relative h-full w-full">
      <div className="mb-20 flex h-full w-full flex-col items-center overflow-auto [clip-path:polygon(0%_0%,100%_0%,100%_100%,90%_100%,90%_calc(100%-50px),0%_calc(100%-50px))]">
        <div className="mt-20 mb-[260px] w-[770px]">
          {isLoading ? (
            <div className="text-center text-muted-foreground">
              Загрузка чата...
            </div>
          ) : (
            <ChatMessages messages={allMessages} isStreaming={isStreaming} />
          )}
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-1/2 w-[770px] -translate-x-1/2 pt-4 pb-2">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isStreaming || isLoading}
        />
        <p className="text-muted-foreground mt-2 w-full text-center text-xs font-medium">
          ChatGPT может допускать ошибки. Проверяйте важную информацию. Смотрите
          настройки cookie-файлов.
        </p>
      </div>
    </div>
  );
}
