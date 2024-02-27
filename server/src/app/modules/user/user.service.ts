import User from './user.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

// approve agent
const approveAgent = async (id: string) => {
  // check if agent is exist
  const isAgentExist = await User.findById(id);
  if (!isAgentExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Agent account not founded.');
  }

  if (isAgentExist.role !== 'agent') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Account is not agent account.',
    );
  }
  if (isAgentExist.status === 'blocked') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This account is blocked.');
  }

  const result = await User.findByIdAndUpdate(isAgentExist._id, {
    status: 'active',
  });

  // approve agent
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to approve agent.');
  }

  return result;
};

//block user
const blockUser = async (id: string) => {
  // check is user exist
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not founded.');
  }

  // block the user
  const result = await User.findByIdAndUpdate(isUserExist._id, {
    status: 'blocked',
  });

  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to block the user.');
  }

  return result;
};

const UserService = {
  approveAgent,
  blockUser,
};

export default UserService;
