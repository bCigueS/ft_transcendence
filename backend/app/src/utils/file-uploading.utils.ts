import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({
    dest: '../../uploads',
  })],
  controllers: [AppController],
})
export class AppModule {}