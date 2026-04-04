import { useState, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="bg-input flex min-h-[56px] items-center justify-between gap-3 rounded-[32px] px-4 pr-2 pl-5">
      <textarea
        ref={textareaRef}
        placeholder="Спросите ChatGPT"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="w-full resize-none border-none py-4 placeholder:text-[16px] placeholder:font-medium focus:outline-none disabled:opacity-50"
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full bg-white hover:opacity-80"
        style={{ backgroundColor: "white" }}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
