import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import User from '../user/user.model';
import { createToken } from './auth.utils';
import config from '../../config';

// register user
const registerUser = async (payload: TUser) => {
  const { email, mobileNumber, nidNumber } = payload;
  /* 
1. check already have a user with email
2. check already have a user with mobile number
3. check already have a user with nid number
4. set balance and status
5. create accessToken and refresh token
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

  if (payload.role === 'agent') {
    payload.status = 'pending';
    payload.balance = 100000;
  } else if (payload.role === 'user') {
    payload.status = 'active';
    payload.balance = 40;
  }

  // create user
  const result = await User.create(payload);

  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create account.');
  }

  // create access token
  const jwtPayload = {
    mobileNumber,
    role: payload.role,
  };
  const accessToken = await createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_token_expires_in as string,
  );

  // create refresh token
  const refreshToken = await createToken(
    jwtPayload,
    config.refresh_secret as string,
    config.refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    balance: result.balance,
  };
};

const AuthService = {
  registerUser,
};

export default AuthService;
