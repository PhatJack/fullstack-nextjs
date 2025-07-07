import { users } from "@/db/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { extractTokenFromHeader, verifyAccessToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { code: 400, message: "Access token is required" },
        { status: 400 }
      );
    }

    // Verify the access token
    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { code: 401, message: "Invalid access token" },
        { status: 401 }
      );
    }

    // Clear refresh token from database
    await db
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.id, payload.userId));

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { code: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
