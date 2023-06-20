import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import axios from 'axios';
import fs from 'fs';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly httpService: HttpService
  ) {}

  async login(name: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { name: name } });

    if (!user) {
      throw new NotFoundException(`No user found with username: ${name}`);
    }

    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

	return {
		accessToken: user.token,
		userId: user.id
	};
}

  async saveImageFromUrl(url: string, filePath: string): Promise<void> {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const targetPath = `./uploads/${filePath}`;

    fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
  }

  async registerUser(apiResponse: any) {
    const avatar = `${apiResponse.login}.jpg`; // Specify the desired path where you want to save the image

    const createUserDto = new CreateUserDto();
    createUserDto.name = apiResponse.displayname;
    createUserDto.login = apiResponse.login;
    createUserDto.email = apiResponse.email;
    createUserDto.password = 'lolilolilol';
    createUserDto.avatar = avatar;

    const user = await this.prisma.user.create({
      data: {
        id42: apiResponse.id,
        name: createUserDto.name,
        login: createUserDto.login,
        email: createUserDto.email,
        password: createUserDto.password,
        avatar: createUserDto.avatar,
      },
    });

    this.saveImageFromUrl(apiResponse.image.link, avatar);
    return user;
  }

  async validateUser(code: string): Promise<any> {
	console.log("vali");
    var response = {};
    const url_token = 'https://api.intra.42.fr/oauth/token';
    const data_token = {
		grant_type: 'authorization_code',
		client_id: `${process.env.CLIENT_ID}`,
		client_secret: `${process.env.CLIENT_SECRET}`,
		code: code,
		redirect_uri: `${process.env.REDIRECT_URL}`,
    };
    try {
		const token_data = await this.httpService.post(url_token, data_token).toPromise();
		response['token'] = token_data.data;
    } catch (error) {
		error.response.data.status = 403;
		throw new HttpException(error.response.data, HttpStatus.FORBIDDEN, { cause: error });
    }
    if (response['token']['access_token']) response['user'] = await this.aboutMe(response['token']['access_token']);
	response['userId'] = response['user']['userId'];
	console.log(response);
    return response;
  }

  async aboutMe(token: string): Promise<any> {
    const url_data = 'https://api.intra.42.fr/v2/me';
    const headersRequest = { Authorization: `Bearer ${token}` };
    try {
		const data_response = await this.httpService.get(url_data, { headers: headersRequest }).toPromise();
		let user = await this.prisma.user.findFirst({ where: { login: data_response.data.login } });
		if (!user) user = await this.registerUser(data_response.data);
		if (user) {
			await this.prisma.user.update({
				where: { id42: data_response.data['id'] },
				data: { 
					token: token,
					status: 1
				},
			});
		}
		data_response['data']['userId'] = user.id;
		return data_response.data;
    } catch (error) {
      error.status = 403;
      throw new HttpException(error, HttpStatus.FORBIDDEN, { cause: error });
    }
  }

  async add2fa(token: string, secret: string): Promise<any> {
    return true;
  }

//   async fortyTwo(): Promise<AuthEntity> {
//     return {
//       accessToken: this.jwtService.sign({ userId: 42 }),
//     };
//   }
}
