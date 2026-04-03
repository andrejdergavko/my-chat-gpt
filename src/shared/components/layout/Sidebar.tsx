'use client';

import Image from 'next/image';
import { Sidebar as SidebarIcon, SquarePen } from 'lucide-react';
import {
  Sidebar,
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

import { ChevronsUpDown, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function AppSidebar() {
  const { toggleSidebar, open: isSidebarOpen } = useSidebar();
  const [isLogoHovering, setIsLogoHovering] = useState(false);
  const { isMobile } = useSidebar();

  const handleLogoClick = () => {
    isSidebarOpen ? (window.location.href = '/') : toggleSidebar();
  };

  const recentChats = [
    { id: 1, title: 'Chat 1' },
    { id: 2, title: 'Chat 2' },
  ];

  return (
    <Sidebar collapsible="icon">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={'user.avatar'} alt={'user.name'} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{'user.name'}</span>
                    <span className="truncate text-xs">{'user.email'}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={'user.avatar'} alt={'user.name'} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {'user.name'}
                      </span>
                      <span className="truncate text-xs">{'user.email'}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
