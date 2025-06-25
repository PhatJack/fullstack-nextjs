import { z } from "zod";

export const errorSchema = z.object({
  message: z.string().describe("Error message"),
});
