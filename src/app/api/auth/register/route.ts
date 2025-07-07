import { users } from "@/db/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  const body = await req.json();
  const findEmail = await db.query.users.findFirst({
    where: eq(users.email, body.email),
  });

  if (!body.email || !body.password) {
    return NextResponse.json(
      { code: 400, message: "Email and password are required" },
      { status: 400 }
    );
  }
  if (findEmail) {
    return NextResponse.json(
      { code: 409, message: "Email already exists" },
      { status: 409 }
    );
  }

  // Hash the password before saving to database
  const hashedPassword = await hashPassword(body.password);

  await db.insert(users).values({
    email: body.email,
    password: hashedPassword,
    name: body.username,
    isActive: true,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
  });
  return NextResponse.json(
    { message: "Registration successful" },
    { status: 200 }
  );
}
