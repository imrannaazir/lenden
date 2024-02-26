/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleDuplicateKeyError = (error: any): TGenericErrorResponse => {
  const statusCode = StatusCodes.CONFLICT;
  const message = 'Duplicate key error.';
  const path = Object.keys(error.keyValue)[0];
  const errorSources: TErrorSource[] = [
    {
      path,
      message: `Already have an entry in path '${path}' by '${error.keyValue[path]}'`,
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleDuplicateKeyError;
