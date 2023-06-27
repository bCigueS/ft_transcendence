import { MiddlewareConsumer, Module, NestMiddleware, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TokenMiddleware } from 'src/middleware/token.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-';
          callback(null, uniqueSuffix + file.originalname);
        },
      }),
    })
  ],
  exports: [UsersService],
})

export class UsersModule implements NestMiddleware
{
  use(req: any, res: any, next: (error?: any) => void)
  {
    throw new Error('Method not implemented.');
  }
  configure(consumer: MiddlewareConsumer)
  {
    consumer
      .apply(TokenMiddleware)
      .forRoutes(UsersController);
  }
}
