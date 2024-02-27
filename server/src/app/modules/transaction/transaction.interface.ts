import { Types } from 'mongoose';

type TTransactionType = 'send-money' | 'cash-in' | 'cash-out';

export type TTransaction = {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  transactionType: TTransactionType;
};
