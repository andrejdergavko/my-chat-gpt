import Sidebar from '@/shared/components/layout/Sidebar';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
