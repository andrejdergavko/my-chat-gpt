'use client';

import { Chat } from '@/modules/chat';
import { useParams } from 'next/navigation';

export default function Home() {
  const params = useParams();
  const slug = params.slug as string[] | undefined;

  const conversationId = slug?.[0] === 'chat' ? slug[1] : undefined;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Chat conversationId={conversationId} />
    </div>
  );
}
