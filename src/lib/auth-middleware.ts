import { NextRequest, NextResponse } from "next/server";
import { extractTokenFromHeader, verifyAccessToken } from "@/lib/jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    name?: string;
    isAdmin?: boolean;
  };
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticateToken = (req: NextRequest): NextResponse | null => {
  const authHeader = req.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return NextResponse.json(
      { code: 401, message: "Access token is required" },
      { status: 401 }
    );
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return NextResponse.json(
      { code: 401, message: "Invalid or expired access token" },
      { status: 401 }
    );
  }

  // Attach user info to request
  (req as AuthenticatedRequest).user = {
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    isAdmin: payload.isAdmin,
  };

  return null; // Continue to next middleware/handler
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (req: AuthenticatedRequest): NextResponse | null => {
  const user = req.user;
  
  if (!user || !user.isAdmin) {
    return NextResponse.json(
      { code: 403, message: "Admin access required" },
      { status: 403 }
    );
  }

  return null; // Continue to next middleware/handler
};

/**
 * Helper function to get user from authenticated request
 */
export const getAuthenticatedUser = (req: NextRequest) => {
  return (req as AuthenticatedRequest).user;
};
