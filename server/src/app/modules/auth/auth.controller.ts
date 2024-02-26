import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AuthService from './auth.service';

const registerUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.registerUser(payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully.',
    data: result,
  });
});

const AuthController = {
  registerUser,
};
export default AuthController;
