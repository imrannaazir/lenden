import { Response } from 'express';

type TSendResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
  const { message, statusCode, success } = data;
  return res.status(statusCode).json({
    success,
    message,
    data: data.data,
  });
};

export default sendResponse;
