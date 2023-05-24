import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hi Felicia! by ${process.env.NODE_ENV}`;
  }
}
