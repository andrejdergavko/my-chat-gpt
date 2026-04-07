'use client';

import { Chat } from '@/modules/chat';

export default function Home() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Chat />
    </div>
  );
}
