import { ZodError } from 'zod';
import { TErrorSource, TGenericErrorResponse } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

const handleZodValidationError = (error: ZodError): TGenericErrorResponse => {
  const statusCode = StatusCodes.BAD_REQUEST;
  const message = 'Zod validation error.';
  const errorSources: TErrorSource[] = error.issues.map((issue) => {
    const path = issue.path[1];
    return {
      path: `${path}`,
      message: `${path} is ${issue.message}`,
    };
  });

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleZodValidationError;
