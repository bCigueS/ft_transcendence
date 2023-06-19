import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenMiddleware implements NestMiddleware
{
  use(req: Request, res: Response, next: NextFunction)
  {
    console.log('Executing request...');

    if (!req.headers.authorization)
	{
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const token = req.headers.token; //.replace('Bearer ', '');
	console.log(`token: ${token}`);
    next();
  }
}
