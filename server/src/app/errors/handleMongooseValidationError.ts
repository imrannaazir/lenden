import { TErrorSource, TGenericErrorResponse } from '../interface/error';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import mongoose from 'mongoose';

const handleMongooseValidationError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = StatusCodes.BAD_REQUEST;
  const message = `${config.NODE_ENV === 'development' && 'Mongoose'} validation error.`;
  const errorSources: TErrorSource[] = Object.values(error.errors).map(
    (issue: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        message: issue.message,
        path: issue.path,
      };
    },
  );

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleMongooseValidationError;
