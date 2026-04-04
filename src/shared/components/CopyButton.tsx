'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  content: string;
  tooltipText?: string;
}

export function CopyButton({
  content,
  tooltipText = 'Копировать ответ',
}: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleCopy}
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-white/20"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="no-arrow">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
