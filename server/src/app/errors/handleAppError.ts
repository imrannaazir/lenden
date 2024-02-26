import { TErrorSource, TGenericErrorResponse } from '../interface/error';
import AppError from './AppError';

const handleAppError = (error: AppError): TGenericErrorResponse => {
  const statusCode = error.statusCode;
  const message = 'App error.';
  const errorSources: TErrorSource[] = [
    {
      path: '',
      message: error.message,
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleAppError;
