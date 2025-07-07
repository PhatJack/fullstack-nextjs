import { users } from "@/db/schema";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { comparePassword } from "@/lib/password";
import { generateTokenPair } from "@/lib/jwt";

export async function POST(req: Request) {
  const body = await req.json();
  const findEmail = await db.query.users.findFirst({
    where: and(eq(users.email, body.email)),
  });

  if (!body.email || !body.password) {
    return NextResponse.json(
      {
        code: 400,
        message: "Email and password are required",
      },
      { status: 400 }
    );
  }
  if (!findEmail) {
    return NextResponse.json(
      {
        code: 401,
        message: "Email or password is incorrect",
      },
      { status: 401 }
    );
  }
  // Verify password against hashed password
  const isPasswordValid = await comparePassword(
    body.password,
    findEmail.password
  );
  if (!isPasswordValid) {
    return NextResponse.json(
      {
        code: 401,
        message: "Email or password is incorrect",
      },
      { status: 401 }
    );
  }

  // Generate token pair
  const tokenPair = generateTokenPair({
    userId: findEmail.id,
    email: findEmail.email,
    name: findEmail.name || undefined,
    isAdmin: findEmail.isAdmin,
  });

  // Update last login timestamp and store refresh token
  await db
    .update(users)
    .set({ 
      lastLogin: new Date(),
      refreshToken: tokenPair.refreshToken,
    })
    .where(eq(users.id, findEmail.id));

  return NextResponse.json(
    { 
      message: "Login successful",
      user: {
        id: findEmail.id,
        email: findEmail.email,
        name: findEmail.name,
        isAdmin: findEmail.isAdmin,
      },
      tokens: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      }
    }, 
    { status: 200 }
  );
}
