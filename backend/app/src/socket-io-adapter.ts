import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import * as redisAdapter from '@socket.io/redis-adapter';


export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: "*"
	};

    // this.logger.log('Configuring SocketIO server with custom CORS options', {
    //   cors,
    // });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);


    // // /Add Redis adapter
    // const redisOptions = {
	// 	host: 'localhost',
	// 	port: 6379,
	//   };
  
	//   const redisAdapterInstance = redisAdapter(redisOptions);
	//   server.adapter(redisAdapterInstance);
  

    return server;
  }
}