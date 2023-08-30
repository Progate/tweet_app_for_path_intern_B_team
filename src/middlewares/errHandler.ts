import {RequestHandler, Request, Response, NextFunction} from "express";

export type Error = {err: any; msg: string; statusCode: number};

export class HTTPStatusError extends Error {
  message: string;
  statusCode: number;
  error: any;
  constructor(message: string, statusCode: number, error: any = null) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export const errHandler = (
  err: HTTPStatusError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode);
  res.render(err.message);
};
