'use client';

import { Conversation, useArchiveConversation } from '@/modules/conversations';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/shared/components/ui/sidebar';
import { TruncatedText } from '@/shared/components/ui/truncated-text';
import { useSlugParam } from '@/shared/hooks/useSlugParam';
import Link from 'next/link';
import { useState } from 'react';
import { Archive, MoreHorizontal } from 'lucide-react';

interface RecentConversationItemProps {
  chat: Conversation;
}

export function RecentConversationItem({ chat }: RecentConversationItemProps) {
  const { mutate: archive, isPending } = useArchiveConversation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentConversationId = useSlugParam(1, 'chat');
  const isActive = currentConversationId === chat.id;

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    archive(chat.id);
    setIsMenuOpen(false);
  };

  return (
    <div className={`group/item flex items-center gap-2`}>
      <SidebarMenuButton
        asChild
        className={`flex-1 transition-colors`}
        isActive={isActive || isMenuOpen}
      >
        <div>
          <Link
            href={`/chat/${chat.id}`}
            className="flex-1 flex items-center justify-between min-w-0"
          >
            <TruncatedText>{chat.title}</TruncatedText>

            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 text-gray-400 transition-opacity hover:text-white hover:bg-none focus:outline-none focus-visible:outline-none ${
                    isMenuOpen
                      ? 'opacity-100'
                      : 'opacity-0 group-hover/item:opacity-100'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="bottom" className="w-40">
                <DropdownMenuItem onClick={handleArchive} disabled={isPending}>
                  <Archive className="h-4 w-4 mr-2" />
                  <span>Архивировать</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Link>
        </div>
      </SidebarMenuButton>
    </div>
  );
}
