import { Injectable, NestMiddleware, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService, private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Executing request...');

    // if (!req.headers.authorization) {
    //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // }

    // const token = req.headers.authorization.replace('Bearer ', '');
    // console.log(`token: ${token}`);
    const token = "9b1eaf4130a7cb63284dd7c6fa53036ec4aea7a1f924ccd88d7e35a67aad6d74";
    
    // Use Prisma to find the user based on the token
    const user = await this.prisma.user.findFirst({ where: { token: token }});

    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const userId = user.id;
    console.log(`userId: ${userId}`);
    req['userId'] = userId;
    next();
  }
}
