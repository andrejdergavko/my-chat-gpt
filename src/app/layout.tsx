import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/shared/components/layout/Sidebar';
import Header from '@/shared/components/layout/Header';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { LoginModalProvider } from '@/shared/providers/LoginModalProvider';
import { LoginModal } from '@/shared/components/modals/LoginModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['cyrillic'],
});

export const metadata: Metadata = {
  title: 'ChatGPT',
  description: 'ChatGPT clone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        'dark',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
    >
      <body>
        <LoginModalProvider>
          <TooltipProvider>
            <SidebarProvider>
              <Sidebar />
              <SidebarInset>
                <Header />
                <main className="flex-1 overflow-auto">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
          <LoginModal />
        </LoginModalProvider>
      </body>
    </html>
  );
}
