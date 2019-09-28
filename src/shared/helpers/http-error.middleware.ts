import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'shared/models';

/**
 * Formats and sends http errors correctly
 * @param err     Error object to be sent to client
 * @param _req    Request object
 * @param res     Response object
 * @param _next   Next function
 */
export function httpErrorMiddleware(err: { status: number, content: HttpError[] }, _req: Request, res: Response, _next: NextFunction): void {

  res.status(err.status || 400).json({ errors: err.content });

}
