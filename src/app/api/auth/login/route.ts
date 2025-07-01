import { users } from "@/db/schema";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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
  return NextResponse.json("hihi", { status: 200 });
}
