import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import { startSession } from 'mongoose';
import Transaction from './transaction.model';
import { TTransaction } from './transaction.interface';

const sendMoney = async (payload: {
  receiver: string;
  amount: number;
  mobileNumber: string;
}) => {
  const { amount, receiver, mobileNumber } = payload;
  /* 
    1. check receiver is exist
    2. check receiver is a user 
    3. check minimum amount is 50 taka
    4. calculate , fee and total 
    4. add money to receiver balance
    5. add money to admin balance 
    6. deduct fee from sender balance
    7. create transaction
    */

  // sender
  const sender = await User.findOne({ mobileNumber });
  if (!sender) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Sender account not founded.');
  }

  // check receiver is exit
  const isReceiverExist = await User.findOne({
    mobileNumber: receiver,
    role: 'user',
  });

  if (!isReceiverExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Receiver account not founded.');
  }

  // check minimum amount is 50 tk
  if (amount < 50) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You can not send money less than 50 taka.',
    );
  }

  // calculate total and fee
  let fee = 0;

  if (amount >= 100) {
    fee = 5;
  }

  const total = amount + fee;
  // check is total is more than sender balance
  if (total > sender.balance) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Insufficient balance.');
  }
  // transaction and rollback
  const session = await startSession();

  try {
    session.startTransaction();

    //deduct fee from sender balance
    await User.findByIdAndUpdate(
      sender?._id,
      {
        balance: sender?.balance - total,
      },
      { session, new: true },
    );

    // add amount to receiver account
    await User.findByIdAndUpdate(
      isReceiverExist._id,
      { balance: isReceiverExist.balance + amount },
      { session, new: true },
    );

    // add fee to admin account
    await User.findOneAndUpdate(
      { role: 'admin' },
      { $inc: { balance: fee } },
      { session, new: true },
    );

    const transactionPayload: TTransaction = {
      amount,
      fee,
      receiver: isReceiverExist._id,
      sender: sender._id,
      total,
      transactionType: 'send-money',
    };

    const result = await Transaction.create(transactionPayload);
    if (!result) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to complete send money transaction.',
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Failed to complete send money transaction.',
    );
  }
};

const TransactionService = {
  sendMoney,
};

export default TransactionService;
