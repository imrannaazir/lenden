import { Types } from 'mongoose';

export type TTransactionType =
  | 'send-money'
  | 'cash-in'
  | 'cash-out'
  | 'add-money';

export type TTransaction = {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  transactionType: TTransactionType;
  amount: number;
  fee: number;
  total: number;
};
