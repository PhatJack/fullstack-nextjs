import { users } from "@/db/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { generateTokenPair, verifyRefreshToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStores = await cookies();
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { code: 400, message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Verify the refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { code: 401, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Check if refresh token exists in database
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
    });

    if (
      !user ||
      cookieStores.get("todo-refreshToken")?.value !== refreshToken
    ) {
      return NextResponse.json(
        { code: 401, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate new token pair
    const newTokenPair = generateTokenPair({
      userId: user.id,
      email: user.email,
      name: user.name || undefined,
      isAdmin: user.isAdmin,
    });

    return NextResponse.json(
      {
        message: "Tokens refreshed successfully",
        tokens: {
          accessToken: newTokenPair.accessToken,
          refreshToken: newTokenPair.refreshToken,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { code: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
