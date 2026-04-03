'use client';

import { Chat } from '@/modules/chat';

export default function Home() {
  const handleSendMessage = (message: string) => {
    console.log('Сообщение отправлено:', message);
    // Здесь будет подключение к бэкэнду
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Chat onSendMessage={handleSendMessage} />
    </div>
  );
}
