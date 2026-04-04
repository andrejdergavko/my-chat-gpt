import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/shared/components/layout/Header';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { LoginModalProvider, LoginModal } from '@/modules/auth';
import { ReactQueryProvider } from '@/shared/providers/ReactQueryProvider';
import Sidebar from '@/shared/components/layout/Sidebar/Sidebar';

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
        <ReactQueryProvider>
          <LoginModalProvider>
            <TooltipProvider>
              <SidebarProvider>
                <Sidebar />
                <SidebarInset>
                  <div className="absolute top-0 left-0 right-0 z-10">
                    <Header />
                  </div>
                  <main className="h-screen">{children}</main>
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
            <LoginModal />
          </LoginModalProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
