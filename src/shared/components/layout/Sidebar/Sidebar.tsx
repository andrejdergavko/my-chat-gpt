'use client';

import Image from 'next/image';
import { Sidebar as SidebarIcon, SquarePen } from 'lucide-react';
import {
  Sidebar as SidebarComponent,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator,
} from '@/shared/components/ui/sidebar';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

import { SidebarUnauthenticated } from './SidebarUnauthenticated';
import { SidebarUser } from './SidebarUser';
import { useAuth } from '@/modules/auth';

export default function Sidebar() {
  const { toggleSidebar, open: isSidebarOpen } = useSidebar();
  const [isLogoHovering, setIsLogoHovering] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleLogoClick = () => {
    isSidebarOpen ? (window.location.href = '/') : toggleSidebar();
  };

  const recentChats = [
    { id: 1, title: 'Chat 1' },
    { id: 2, title: 'Chat 2' },
  ];

  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between ">
        <Button
          className="w-8 h-8 p-0"
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
          <SidebarGroupLabel>Недавние</SidebarGroupLabel>
          <SidebarMenu>
            {recentChats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton asChild>
                  <a href={'item.url'}>
                    <span>{chat.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
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
