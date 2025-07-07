import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { errorSchema } from "./types/error";

const c = initContract();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginSchema = z.infer<typeof LoginSchema>;

const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenSchema = z.infer<typeof RefreshTokenSchema>;

const TokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  isAdmin: z.boolean(),
});

const LoginResponseSchema = z.object({
  message: z.string(),
  user: UserSchema,
  tokens: TokenPairSchema,
});

const RefreshResponseSchema = z.object({
  message: z.string(),
  tokens: TokenPairSchema,
});

const RegisterSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
  });

export type RegisterSchema = z.infer<typeof RegisterSchema>;

export const authContract = c.router(
  {
    login: {
      method: "POST",
      path: "/auth/login",
      body: LoginSchema,
      responses: {
        200: LoginResponseSchema,
        401: errorSchema,
        400: errorSchema,
      },
      summary: "Login user",
      description: "Logs in a user and returns access and refresh tokens",
    },
    register: {
      method: "POST",
      path: "/auth/register",
      body: RegisterSchema,
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchema,
        409: errorSchema,
      },
      summary: "Register user",
      description: "Registers a new user",
    },
    refresh: {
      method: "POST",
      path: "/auth/refresh",
      body: RefreshTokenSchema,
      responses: {
        200: RefreshResponseSchema,
        401: errorSchema,
        400: errorSchema,
      },
      summary: "Refresh access token",
      description: "Refreshes an access token using a refresh token",
    },
    logout: {
      method: "POST",
      path: "/auth/logout",
      body: z.object({}),
      headers: z.object({
        authorization: z.string(),
      }),
      responses: {
        200: z.object({ message: z.string() }),
        401: errorSchema,
        400: errorSchema,
      },
      summary: "Logout user",
      description: "Logs out a user and invalidates their refresh token",
    },
    profile: {
      method: "GET",
      path: "/auth/profile",
      headers: z.object({
        authorization: z.string(),
      }),
      responses: {
        200: z.object({
          message: z.string(),
          user: UserSchema,
        }),
        401: errorSchema,
        403: errorSchema,
      },
      summary: "Get current user profile",
      description: "Fetches the currently logged-in user's profile information",
    },
    getUser: {
      method: "GET",
      path: "/auth/user",
      responses: {
        200: z.object({
          id: z.string(),
          email: z.string().email(),
          createdAt: z.string().datetime(),
        }),
        401: errorSchema,
      },
      summary: "Get current user info",
      description: "Fetches the currently logged-in user's information",
    },
  },
  //Enforce that only status codes defined in your contract are allowed
  {
    strictStatusCodes: true,
  }
);
