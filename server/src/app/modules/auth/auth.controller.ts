import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AuthService from './auth.service';
import config from '../../config';

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

// get refresh token
const getRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await AuthService.getRefreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Access token retrieved.',
    data: {
      accessToken,
    },
  });
});

// logout user
const logoutUser = catchAsync(async (req, res) => {
  await AuthService.logoutUser(req.user.mobileNumber);

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
  getRefreshToken,
  logoutUser,
};
export default AuthController;
