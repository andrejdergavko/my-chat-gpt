'use client';

import { LoginForm, useLoginModal } from '@/modules/auth';
import { useEffect } from 'react';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useLoginModal();
  const isOpen = isLoginModalOpen;
  const onClose = closeLoginModal;

  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground absolute top-2 right-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center"
        >
          ✕
        </button>
        <LoginForm />
      </div>
    </div>
  );
}
