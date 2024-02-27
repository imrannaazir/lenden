import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import { startSession } from 'mongoose';
import Transaction from './transaction.model';
import { TTransaction } from './transaction.interface';
import { verifyPin } from '../auth/auth.utils';

// send money
const sendMoney = async (payload: {
  receiver: string;
  amount: number;
  mobileNumber: string;
  pin: string;
}) => {
  const { amount, receiver, mobileNumber, pin } = payload;
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
  const sender = await User.findOne({ mobileNumber }).select('+pin');
  if (!sender) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Sender account not founded.');
  }

  const isPinMatched = await verifyPin(pin, sender.pin);

  if (!isPinMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Pin is incorrect.');
  }

  // check receiver is exit
  const isAgentExist = await User.findOne({
    mobileNumber: receiver,
    role: 'user',
  });

  if (!isAgentExist) {
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
      isAgentExist._id,
      { balance: isAgentExist.balance + amount },
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
      receiver: isAgentExist._id,
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
// cash out
const cashOut = async (payload: {
  receiver: string;
  amount: number;
  mobileNumber: string;
  pin: string;
}) => {
  const { amount, receiver, mobileNumber, pin } = payload;
  /* 
    1. check receiver is exist
    2. check receiver is an agent 
    3. check minimum amount is 50 taka
    4. calculate , fee and total 
    4. add money to agent balance
    5. add money to admin balance 
    6. deduct fee from sender balance
    7. create transaction
    */

  // sender
  const sender = await User.findOne({ mobileNumber }).select('+pin');
  if (!sender) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Sender account not founded.');
  }

  // verify pin
  const isPinMatched = await verifyPin(pin, sender.pin);

  if (!isPinMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Pin is incorrect.');
  }

  // check receiver agent is exit
  const isAgentExist = await User.findOne({
    mobileNumber: receiver,
    role: 'agent',
  });

  if (!isAgentExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Agent account not founded.');
  }

  // check minimum amount is 50 tk
  if (amount < 50) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You can not cash out less than 50 taka.',
    );
  }

  // calculate total and fee
  const agentFee = (amount / 100) * 1;
  const adminFee = (amount / 100) * 0.5;
  const fee = agentFee + adminFee;
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

    // add amount to agent account
    await User.findByIdAndUpdate(
      isAgentExist._id,
      { balance: isAgentExist.balance + amount + agentFee },
      { session, new: true },
    );

    // add fee to admin account
    await User.findOneAndUpdate(
      { role: 'admin' },
      { $inc: { balance: adminFee } },
      { session, new: true },
    );

    const transactionPayload: TTransaction = {
      amount,
      fee,
      receiver: isAgentExist._id,
      sender: sender._id,
      total,
      transactionType: 'cash-out',
    };

    const result = await Transaction.create(transactionPayload);
    if (!result) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to complete cash out transaction.',
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
      'Failed to complete cash out transaction.',
    );
  }
};

//
const TransactionService = {
  sendMoney,
  cashOut,
};

export default TransactionService;
