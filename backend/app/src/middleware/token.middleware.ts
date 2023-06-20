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
    const token = "72b9f17ef081978d02e84bc259591cfdbd28fbcdaf1ddab3524b1929f78c30b4";
    
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
