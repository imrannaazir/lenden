import { z } from 'zod';
import { UserRole } from '../user/user.constant';

const userNameValidationSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
});
export const registrationValidationSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
    mobileNumber: z.string().trim(),
    role: z.enum(UserRole),
    pin: z.string().length(5).trim(),
    nidNumber: z.string().length(15).trim(),
    name: userNameValidationSchema,
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    mobileNumberOrEmail: z.string().trim(),
    pin: z.string().length(5).trim(),
  }),
});
