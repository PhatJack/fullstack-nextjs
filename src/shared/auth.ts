import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { errorSchema } from "./types/error";

const c = initContract();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginSchema = z.infer<typeof LoginSchema>;

const RegisterSchema = z
  .object({
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
        200: z.object({ token: z.string() }),
        401: errorSchema,
      },
      summary: "Login user",
      description: "Logs in a user and returns an access token",
    },
    register: {
      method: "POST",
      path: "/auth/register",
      body: RegisterSchema,
      responses: {
        200: z.string().describe("Success message"),
        400: errorSchema,
      },
      summary: "Register user",
      description: "Registers a new user and returns an access token",
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
