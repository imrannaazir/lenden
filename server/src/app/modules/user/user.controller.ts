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

// unblock user
const unblockUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserService.unblockUser(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `${result.role} has been unblocked successfully.`,
    data: {
      unblockUserMobileNumber: result.mobileNumber,
    },
  });
});

const UserController = { approveAgent, blockUser, unblockUser };
export default UserController;
