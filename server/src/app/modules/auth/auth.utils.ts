import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const hashPin = async (pin: string) => {
  try {
    return await bcrypt.hash(pin, Number(config.salt_rounds));
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Could not hash the password',
    );
  }
};

export const createToken = async (
  payload: JwtPayload,
  select: string,
  expiresIn: string,
) => {
  try {
    return await jwt.sign(payload, select, {
      expiresIn,
    });
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Could not create token.',
    );
  }
};
