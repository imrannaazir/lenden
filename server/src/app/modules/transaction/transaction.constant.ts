import { TTransactionType } from './transaction.interface';

export const TransactionTypes: TTransactionType[] = [
  'add-money',
  'cash-in',
  'cash-out',
  'send-money',
] as const;
