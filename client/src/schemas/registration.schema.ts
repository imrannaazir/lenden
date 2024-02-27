import { z } from "zod";

export const registrationFormSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  pin: z.string().regex(/^\d{5}$/),
  role: z.enum(["user", "agent", "admin"]),
  nidNumber: z.string().regex(/^\d{15}$/),
  mobileNumber: z.string().regex(/^\d{11}$/),
  email: z.string().email(),
});
