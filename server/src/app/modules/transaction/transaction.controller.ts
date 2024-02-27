import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import TransactionService from './transaction.service';

// send money
const sendMoney = catchAsync(async (req, res) => {
  const payload = {
    amount: req.body.amount,
    receiver: req.body.receiver,
    pin: req.body.pin,
    mobileNumber: req.user.mobileNumber,
  };
  const result = await TransactionService.sendMoney(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Sent money successfully.',
    data: result,
  });
});

// cash out
const cashOut = catchAsync(async (req, res) => {
  const payload = {
    amount: req.body.amount,
    receiver: req.body.receiver,
    pin: req.body.pin,
    mobileNumber: req.user.mobileNumber,
  };
  const result = await TransactionService.cashOut(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'cash out done.',
    data: result,
  });
});
// cash out
const cashIn = catchAsync(async (req, res) => {
  const payload = {
    amount: req.body.amount,
    receiver: req.body.receiver,
    pin: req.body.pin,
    mobileNumber: req.user.mobileNumber,
  };
  const result = await TransactionService.cashIn(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'cash in done.',
    data: result,
  });
});

const TransactionController = {
  sendMoney,
  cashOut,
  cashIn,
};

export default TransactionController;
