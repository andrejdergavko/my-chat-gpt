import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 p-4 border-t">
      <Input
        placeholder="Напишите сообщение..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="flex-1"
      />
      <Button
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        size="icon"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
