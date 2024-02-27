import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import TransactionService from './transaction.service';

// send money
const sendMoney = catchAsync(async (req, res) => {
  const payload = {
    amount: req.body.amount,
    receiver: req.body.receiver,
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

const TransactionController = {
  sendMoney,
};

export default TransactionController;
