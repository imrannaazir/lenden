import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AuthService from './auth.service';
import config from '../../config';

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

const AuthController = {
  registerUser,
};
export default AuthController;
