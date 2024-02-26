import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import User from '../user/user.model';

// register user
const registerUser = async (payload: TUser) => {
  const result = await User.findById('sldfsfls');
};

const AuthService = {
  registerUser,
};

export default AuthService;
