import { z } from "zod";

export const errorSchema = z.object({
  status: z.number().describe("Error code"),
  message: z.string().describe("Error message"),
});
