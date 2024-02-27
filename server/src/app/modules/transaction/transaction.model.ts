import { Schema, model } from 'mongoose';
import { TTransaction } from './transaction.interface';
import { TransactionTypes } from './transaction.constant';

const transactionSchema = new Schema<TTransaction>(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    transactionType: {
      type: String,
      enum: TransactionTypes,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Transaction = model<TTransaction>('transaction', transactionSchema);
export default Transaction;
