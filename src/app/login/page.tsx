'use client';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">ChatGPT Clone</h1>
        <button
          onClick={handleGoogleSignIn}
          className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
