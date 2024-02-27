import { NextFunction, Request, Response } from 'express';
import { TRole } from '../modules/user/user.interface';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../modules/auth/auth.utils';
import config from '../config';
import User from '../modules/user/user.model';

const auth = (...requiredRoles: TRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    /* 
1. check if token is sent
2. decode token 
3. check user is exist 
4. check user is not blocked 
5. check user is not pending 
6. check user role is allowed 
7. set user to request
*/

    // check token
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Token not sent.');
    }

    const decodedToken = await verifyToken(
      token,
      config.access_secret as string,
    );
    if (!decodedToken) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access.');
    }

    // check user exist
    const isUserExist = await User.findOne({
      mobileNumber: decodedToken.mobileNumber,
    });

    if (!isUserExist) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Account not founded.');
    }

    // check is account active
    if (isUserExist.status !== 'active') {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        `Account is ${isUserExist.status}.`,
      );
    }

    // allow role
    if (requiredRoles && !requiredRoles.includes(decodedToken.role)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access.');
    }
    req.user = decodedToken;

    next();
  });
};

export default auth;
