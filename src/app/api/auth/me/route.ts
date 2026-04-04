import { authService } from "@/modules/auth/service/auth.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await authService.getCurrentUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get current user API error:", error);
    return NextResponse.json(
      { error: "Failed to get current user" },
      { status: 401 },
    );
  }
}
