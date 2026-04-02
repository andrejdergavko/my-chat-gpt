'use client';

import { useEffect } from 'react';
import { LoginForm } from '@/shared/components/forms/LoginForm';
import { useLoginModal } from '@/shared/providers/LoginModalProvider';

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
      className="fixed w-full h-full inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground z-10 cursor-pointer w-6 h-6 flex items-center justify-center"
        >
          ✕
        </button>
        <LoginForm />
      </div>
    </div>
  );
}
