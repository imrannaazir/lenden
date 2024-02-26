import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import User from '../user/user.model';

// register user
const registerUser = async (payload: TUser) => {
  const { email, mobileNumber, nidNumber } = payload;
  /* 
1. check already have a user with email
2. check already have a user with mobile number
3. check already have a user with nid number
*/

  // check is already have a user by email
  const isAlreadyUserExistByEmail = await User.findOne({ email });
  if (isAlreadyUserExistByEmail) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'Already have an account by this email.',
    );
  }
  // check is already have a user by mobile number
  const isAlreadyUserExistByMobileNumber = await User.findOne({ mobileNumber });
  if (isAlreadyUserExistByMobileNumber) {
    if (isAlreadyUserExistByMobileNumber) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'Already have an account by this mobile number.',
      );
    }
  }

  // check is already have an account by nid number
  const isAlreadyUserExistByNid = await User.findOne({ nidNumber });
  if (isAlreadyUserExistByNid) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'Already have an account by this nid number.',
    );
  }

  // create user
  const result = User.create(payload);
  return result;
};

const AuthService = {
  registerUser,
};

export default AuthService;
