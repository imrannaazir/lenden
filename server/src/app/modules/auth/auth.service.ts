import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import User from '../user/user.model';
import { createToken, verifyPin, verifyToken } from './auth.utils';
import config from '../../config';
import { TLoginUser } from './auth.interface';

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
  if (payload.role === 'admin') {
    const isAdminExist = await User.findOne({});
    if (isAdminExist) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'You are unauthorized to be admin.',
      );
    }
    if (payload.pin !== config.admin_pin) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'You are unauthorized to be admin.',
      );
    }
    payload.balance = 0;
    payload.status = 'active';
  } else if (payload.role === 'agent') {
    payload.status = 'pending';
    payload.balance = 100000;
  } else if (payload.role === 'user') {
    payload.status = 'active';
    payload.balance = 40;
  }
  // create access token
  const jwtPayload = {
    mobileNumber,
    role: payload.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_token_expires_in as string,
  );

  // create refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.refresh_secret as string,
    config.refresh_token_expires_in as string,
  );

  // add token in user data
  payload.token = refreshToken;
  // create user
  const result = await User.create(payload);

  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create account.');
  }

  return {
    accessToken,
    refreshToken,
    balance: result.balance,
  };
};

// login user
const loginUser = async (payload: TLoginUser) => {
  /* 
  1. check user is exist
  2. check password is correct
  4. generate token
  */
  const { mobileNumberOrEmail, pin } = payload;

  const isUserExist = await User.findOne({
    $or: [
      { email: mobileNumberOrEmail },
      { mobileNumber: mobileNumberOrEmail },
    ],
  }).select('+pin +token');

  if (!isUserExist) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Email / mobile number is incorrect.',
    );
  }

  // compare password
  const isPinMatched = await verifyPin(pin, isUserExist.pin);

  if (!isPinMatched) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You entered the wrong password.',
    );
  }

  if (isUserExist.token) {
    const decodedToken = await verifyToken(
      isUserExist.token,
      config.refresh_secret as string,
    );

    if (decodedToken) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'An account is not allowed to login more than 1 device.',
      );
    }
  }

  // create access token
  const jwtPayload = {
    mobileNumber: isUserExist.mobileNumber,
    role: isUserExist.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_token_expires_in as string,
  );

  // create refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.refresh_secret as string,
    config.refresh_token_expires_in as string,
  );

  // update token
  const result = await User.findByIdAndUpdate(isUserExist._id, {
    token: refreshToken,
  });

  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to log in.');
  }

  return {
    accessToken,
    refreshToken,
  };
};

const AuthService = {
  registerUser,
  loginUser,
};

export default AuthService;
