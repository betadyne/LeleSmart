import { NextApiResponse } from 'next';

export function successResponse<T>(res: NextApiResponse, data: T, status = 200) {
  return res.status(status).json({
    success: true,
    data,
  });
}

export function errorResponse(res: NextApiResponse, message: string, status = 400) {
  return res.status(status).json({
    success: false,
    error: message,
  });
} 