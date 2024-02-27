import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import UserService from './user.service';

const approveAgent = catchAsync(async (req, res) => {
  const agentId = req.params.id;
  const result = await UserService.approveAgent(agentId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Agent approved successfully.',
    data: {
      agentMobileNumber: result.mobileNumber,
      balance: result.balance,
    },
  });
});

const UserController = { approveAgent };
export default UserController;
