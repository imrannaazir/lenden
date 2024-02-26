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
  const result = User.create(payload);

  // create user

  return result;
};

const AuthService = {
  registerUser,
};

export default AuthService;
