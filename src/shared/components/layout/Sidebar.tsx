'use client';

import { AppSidebar } from '../app-sidebar';
import { SidebarProvider } from '../ui/sidebar';

export default function Sidebar() {
  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
}
