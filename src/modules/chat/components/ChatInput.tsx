import { useState, useRef } from 'react';
import { Button } from '@/shared/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="bg-input rounded-[32px] flex items-center justify-between px-4 pr-2 pl-5 gap-3 min-h-[56px]">
      <textarea
        ref={textareaRef}
        placeholder="Спросите ChatGPT"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="py-4 w-full border-none placeholder:text-[16px] placeholder:font-medium focus:outline-none disabled:opacity-50 resize-none"
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        size="icon"
        className="w-10 h-10 bg-white  rounded-full hover:opacity-80 shrink-0"
        style={{ backgroundColor: 'white' }}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
