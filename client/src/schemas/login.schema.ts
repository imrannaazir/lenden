import { z } from "zod";

export const loginFormSchema = z.object({
  pin: z.string().length(5, {
    message: "Pin must be exact 5 digit number.",
  }),
  mobileNumberOrEmail: z
    .string()
    .regex(/^(\d{10}|[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/, {
      message: "Input must be a valid mobile number or email address",
    }),
});
