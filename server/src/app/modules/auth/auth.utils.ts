import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';

// hash pin number
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

//verify pin
export const verifyPin = async (plainPin: string, hashedPin: string) => {
  try {
    return bcrypt.compare(plainPin, hashedPin);
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to compare pin.',
    );
  }
};

// create token
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
