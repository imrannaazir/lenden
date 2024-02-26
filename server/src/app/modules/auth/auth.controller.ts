import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AuthService from './auth.service';
import config from '../../config';
import { verifyToken } from './auth.utils';
import AppError from '../../errors/AppError';

// register user
const registerUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const { accessToken, balance, refreshToken } =
    await AuthService.registerUser(payload);

  //set cookie
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'development' ? true : false,
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully.',
    data: { accessToken, balance },
  });
});

// login user
const loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const { accessToken, refreshToken } = await AuthService.loginUser(payload);
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'development' ? true : false,
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Logged in successfully.',
    data: { accessToken },
  });
});

// logout user
const logoutUser = catchAsync(async (req, res) => {
  const decodedToken = await verifyToken(
    req.cookies.refreshToken,
    config.refresh_secret as string,
  );

  if (!decodedToken) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You are unauthorized to logout.',
    );
  }
  await AuthService.logoutUser(decodedToken.mobileNumber);

  res.cookie('refreshToken', '', {
    secure: config.NODE_ENV === 'development' ? true : false,
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Logged out successfully.',
    data: null,
  });
});
const AuthController = {
  registerUser,
  loginUser,
  logoutUser,
};
export default AuthController;
