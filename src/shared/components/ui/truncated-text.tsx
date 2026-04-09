'use client';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';

interface TruncatedTextProps {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  prefixIcon?: ReactNode;
  contentClassName?: string;
}

export function TruncatedText({
  children,
  className,
  wrapperClassName,
  prefixIcon,
  contentClassName,
}: TruncatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const textElement = textRef.current;

      if (textElement) {
        const isCurrentlyTruncated =
          textElement.scrollWidth > textElement.clientWidth;
        setIsTruncated(isCurrentlyTruncated);
      }
    };

    const debouncedCheckTruncation = debounce(checkTruncation, 300);

    const element = textRef.current;
    if (!element) return;

    let previousWidth = element.clientWidth;

    debouncedCheckTruncation();

    const resizeObserver = new ResizeObserver(() => {
      const currentWidth = element.clientWidth;

      if (currentWidth !== previousWidth) {
        previousWidth = currentWidth;
        debouncedCheckTruncation();
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      debouncedCheckTruncation.cancel();
    };
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          ref={textRef}
          className={cn('flex items-center gap-2 min-w-0', wrapperClassName, className)}
        >
          {prefixIcon}
          <span className="truncate">{children}</span>
        </div>
      </TooltipTrigger>
      {isTruncated && (
        <TooltipContent className={contentClassName}>{children}</TooltipContent>
      )}
    </Tooltip>
  );
}
