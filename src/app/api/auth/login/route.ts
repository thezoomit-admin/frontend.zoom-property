import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { login } from "@/server/features/auth/session";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
  cookieOptions,
} from "@/server/features/auth/cookies";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const res = await login(email, password);
    if (!res.success) {
      return NextResponse.json(
        { success: false, error: res.error },
        { status: 401 }
      );
    }

    const { token, refreshToken, user } = res.result;
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_COOKIE, token, {
      ...cookieOptions,
      maxAge: ACCESS_MAX_AGE,
    });

    if (refreshToken) {
      cookieStore.set(REFRESH_COOKIE, refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_MAX_AGE,
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error during login" },
      { status: 500 }
    );
  }
}
