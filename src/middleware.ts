import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const protectedRoutes = ["/"];

  const currentPath = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(`${route}/`)
  );
  if (isProtected) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.nextUrl.origin).toString()
      );
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/privacy-policy",
    "/terms-and-conditions",
    "/google-callback",
  ],
};
