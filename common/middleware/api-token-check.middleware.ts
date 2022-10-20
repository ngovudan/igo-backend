import { NestMiddleware } from '@nestjs/common';
import { ApiTokenPaymentException } from 'common/exceptions/api-token-payement.exception';
import { NextFunction, Request, Response } from 'express';

export class ApiTokenCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['api-token'] !== 'my-token') {
      throw new ApiTokenPaymentException();
    }
    next();
  }
}
