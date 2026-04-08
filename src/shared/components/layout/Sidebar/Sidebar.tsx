'use client';

import { useAuth } from '@/modules/auth';
import { useConversations } from '@/modules/conversations';
import { Button } from '@/shared/components/ui/button';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/shared/components/ui/sidebar';
import Image from 'next/image';
import { useState } from 'react';
import { Sidebar as SidebarIcon, SquarePen } from 'lucide-react';
import { SidebarUnauthenticated } from './SidebarUnauthenticated';
import { SidebarUser } from './SidebarUser';
import { RecentConversationItem } from './RecentConversationItem';

export default function Sidebar() {
  const { toggleSidebar, open: isSidebarOpen } = useSidebar();
  const [isLogoHovering, setIsLogoHovering] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data: recentChats = [], isLoading } = useConversations();

  const handleLogoClick = () => {
    if (isSidebarOpen) {
      window.location.href = '/';
    } else {
      toggleSidebar();
    }
  };

  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between">
        <Button
          className="h-8 w-8 p-0"
          variant="ghost"
          size="default"
          onClick={handleLogoClick}
          onMouseEnter={() => setIsLogoHovering(true)}
          onMouseLeave={() => setIsLogoHovering(false)}
        >
          {isSidebarOpen || !isLogoHovering ? (
            <Image
              src="/gpt-icon-white.png"
              alt="ChatGPT"
              width={22}
              height={22}
            />
          ) : (
            <SidebarIcon />
          )}
        </Button>
        {isSidebarOpen && (
          <Button variant="ghost" size="icon-lg" onClick={toggleSidebar}>
            <SidebarIcon />
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup className="mt-2 p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                variant="default"
                size="default"
                tooltip="Новый чат"
              >
                <SquarePen />
                <span className="font-semibold">Новый чат</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-5 p-0 group-data-[collapsible=icon]:hidden">
          {isAuthenticated && (
            <>
              <SidebarGroupLabel>Недавние</SidebarGroupLabel>
              <SidebarMenu>
                {isLoading ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Загрузка...
                  </div>
                ) : recentChats.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Нет чатов
                  </div>
                ) : (
                  recentChats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <RecentConversationItem chat={chat} />
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-0" />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isAuthenticated ? <SidebarUser /> : <SidebarUnauthenticated />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
}
