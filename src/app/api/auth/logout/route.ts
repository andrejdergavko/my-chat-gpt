import { authService } from '@/modules/auth/service/auth.service';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await authService.signOut();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}
