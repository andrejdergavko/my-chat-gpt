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
import Link from 'next/link';
import { useState } from 'react';
import { Archive, MoreHorizontal } from 'lucide-react';

interface RecentConversationItemProps {
  chat: Conversation;
}

export function RecentConversationItem({
  chat,
}: RecentConversationItemProps) {
  const { mutate: archive, isPending } = useArchiveConversation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    archive(chat.id);
    setIsMenuOpen(false);
  };

  return (
    <div className="group flex items-center gap-2">
      <SidebarMenuButton asChild className="flex-1">
        <div>
          <Link
            href={`/chat/${chat.id}`}
            className="flex-1 flex items-center justify-between"
          >
            <span className="truncate">{chat.title}</span>

            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 transition-none  hover:text-white hover:bg-none focus:outline-none focus-visible:outline-none"
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
