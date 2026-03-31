import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from '@/modules/auth/components/LogoutButton';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome!</h1>
        <p className="text-gray-300 mb-6">Logged in as: {data.user.email}</p>
        <LogoutButton />
      </div>
    </div>
  );
}
