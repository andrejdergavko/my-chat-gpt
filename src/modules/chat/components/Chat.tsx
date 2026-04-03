import { useState, useEffect } from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

// Моковый запрос за начальными сообщениями
const fetchInitialMessages = async (): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          role: 'assistant',
          content: 'Привет! Я твой ассистент. Чем я могу тебе помочь?',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
        },
        {
          id: '2',
          role: 'user',
          content: 'Привет! Расскажи мне о себе.',
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
        },
        {
          id: '3',
          role: 'assistant',
          content:
            'Я AI-ассистент, созданный для помощи с различными задачами. Я могу помочь с написанием, анализом, кодированием и многим другим!',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
        },
      ]);
    }, 300);
  });
};

export function Chat({ onSendMessage, isLoading = false }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchInitialMessages().then((initialMessages) => {
      setMessages(initialMessages);
    });
  }, []);

  const handleSendMessage = (content: string) => {
    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Вызываем внешний обработчик
    onSendMessage?.(content);
  };

  return (
    <div className="flex flex-col h-full w-[770px]">
      <ChatMessages messages={messages} />
      <div className="pt-4 pb-2">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <p className="w-full mt-2 text-center text-xs font-medium text-muted-foreground">
          ChatGPT может допускать ошибки. Проверяйте важную информацию. Смотрите
          настройки cookie-файлов.
        </p>
      </div>
    </div>
  );
}
