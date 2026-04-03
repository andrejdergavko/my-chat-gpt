import { authService } from '@/modules/auth/service/auth.service';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const url = await authService.getGoogleOAuthUrl();
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Google OAuth API error:', error);
    return NextResponse.json(
      { error: 'Failed to get Google OAuth URL' },
      { status: 500 },
    );
  }
}
