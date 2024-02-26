import { z } from 'zod';
import { UserRole } from '../user/user.constant';

const userNameValidationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});
export const registrationValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    mobileNumber: z.string(),
    role: z.enum(UserRole),
    pin: z.string().length(5),
    nidNumber: z.string().length(15),
    name: userNameValidationSchema,
  }),
});
