import { createClient } from "@/lib/supabase/server";

export class AuthService {
  async getGoogleOAuthUrl() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google OAuth error:", error);
      throw error;
    }

    return data.url;
  }

  async signOut() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Get user error:", error);
      throw error;
    }

    return user;
  }
}

export const authService = new AuthService();
