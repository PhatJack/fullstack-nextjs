import { z } from "zod";

export const errorSchema = z.object({
  code: z.number().describe("Error code"),
  message: z.string().describe("Error message"),
});
