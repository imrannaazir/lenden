import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import UserService from './user.service';

// approve agent
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

// block user
const blockUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.blockUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `${result.role} has been blocked successfully.`,
    data: {
      blockedUserMobileNumber: result.mobileNumber,
    },
  });
});

const UserController = { approveAgent, blockUser };
export default UserController;
