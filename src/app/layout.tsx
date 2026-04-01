import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/shared/components/layout/Sidebar';

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
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
    >
      <body>
        <div className="grid grid-cols-[auto_1fr] h-full">
          <div className="w-[200px]">
            <Sidebar />
          </div>
          <div>
            <div>Header</div>
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
