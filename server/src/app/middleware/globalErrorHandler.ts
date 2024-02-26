import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import handleZodValidationError from '../errors/handleZodValidationError';
import config from '../config';
import handleMongooseValidationError from '../errors/handleMongooseValidationError';
import handleDuplicateKeyError from '../errors/handleDuplicateKeyError';
import handleCastError from '../errors/handleCastError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const success = false;
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = error.message || 'Internal server error.';
  let errorSources = null;

  /* 
    1. handle zod validation error
    2. handle mongoose validation error
    3. handle duplicate key error
    4. handle cast error
    5. handle instance of AppError
    */

  // handle zod validation error
  if (error instanceof ZodError) {
    const simplifiedError = handleZodValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }

  // handle mongoose validation error
  else if (error.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }

  // handle duplicate key error
  else if (error.code === 11000) {
    const simplifiedError = handleDuplicateKeyError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }

  // handle cast error
  else if (error.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }

  return res.status(statusCode).json({
    success,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? error?.stack : null,
  });
};
export default globalErrorHandler;
