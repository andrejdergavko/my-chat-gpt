'use client';

import { Button } from '@/shared/components/ui/button';
import { useLoginModal } from '@/modules/auth';

export function SidebarUnauthenticated() {
  const { openLoginModal } = useLoginModal();

  return (
    <div className="flex flex-col gap-4 p-4 ">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-sm">
          Получаете ответы, адаптированные специально для вас
        </h3>
        <p
          className="text-sidebar-accent-foreground/70 mt-3"
          style={{ fontSize: '14px' }}
        >
          Войдите в систему, чтобы получать ответы на основе сохраненных чатов,
          а также создавать изображения и загружать файлы.
        </p>
      </div>
      <Button
        onClick={openLoginModal}
        variant="outline"
        size="lg"
        className="w-full mt-3 rounded-4xl"
      >
        Войти
      </Button>
    </div>
  );
}
