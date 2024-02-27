import { z } from 'zod';

export const sendMoneyValidationSchema = z.object({
  body: z.object({
    receiver: z.string(),
    amount: z.number(),
  }),
});
