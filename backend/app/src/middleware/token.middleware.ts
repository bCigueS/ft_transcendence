import { Injectable, NestMiddleware, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  accessToken: string;
}

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService, private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // console.log('Executing request...');

    if (!req.headers.authorization) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const token = req.headers.authorization.replace('Bearer ', '');
    // console.log(`token: ${token}`);

    try {
      const decodedToken = await jwt.verify(token, `${process.env.NODE_ENV}`) as JwtPayload;
      const userId = decodedToken.userId;
      const accessToken = decodedToken.accessToken;
      const user = await this.prisma.user.findFirst({ where: { id: parseInt(userId) }});

      if (!user) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      req['userId'] = userId;
      req['token'] = accessToken;
      next();
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
 