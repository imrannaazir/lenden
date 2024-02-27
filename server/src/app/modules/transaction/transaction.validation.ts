import { z } from 'zod';

export const transactionMoneyValidationSchema = z.object({
  body: z.object({
    receiver: z.string(),
    amount: z.number(),
    pin: z.string().trim().length(5),
  }),
});
