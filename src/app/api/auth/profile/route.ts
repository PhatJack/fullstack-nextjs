import { NextRequest, NextResponse } from "next/server";
import { authenticateToken, getAuthenticatedUser } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  // Authenticate the request
  const authError = authenticateToken(req);
  if (authError) {
    return authError;
  }

  // Get the authenticated user
  const user = getAuthenticatedUser(req);

  return NextResponse.json(
    {
      message: "Profile retrieved successfully",
      user: {
        id: user?.userId,
        email: user?.email,
        name: user?.name,
        isAdmin: user?.isAdmin,
      },
    },
    { status: 200 }
  );
}
