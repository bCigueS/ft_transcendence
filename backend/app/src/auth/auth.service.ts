import { BadGatewayException, BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as AuthUtils from './auth.utils';
import axios from 'axios';
import fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
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

	const token = jwt.sign({
		accessToken: user.token,
		userId: user.id
	}, `${process.env.NODE_ENV}`, { expiresIn:'2h' });


	return {
		accessToken: token,
		userId: user.id
	};
}

  async saveImageFromUrl(url: string, filePath: string): Promise<void> {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const targetPath = `./uploads/${filePath}`;

    fs.writeFileSync(targetPath, Buffer.from(response.data, 'binary'));
  }

  async registerUser(apiResponse: any) {
    const avatar = `${apiResponse.login}.jpg`; // Specify the desired path where you want to save the image

    const createUserDto = new CreateUserDto();
    createUserDto.name = apiResponse.login;
    createUserDto.login = apiResponse.login;
    createUserDto.email = apiResponse.email;
    // createUserDto.password = 'lolilolilol';
    createUserDto.avatar = avatar;

    const user = await this.prisma.user.create({
      data: {
        id42: apiResponse.id,
        name: createUserDto.name,
        login: createUserDto.login,
        email: createUserDto.email,
        // password: createUserDto.password,
        avatar: createUserDto.avatar,
      },
    });

    this.saveImageFromUrl(apiResponse.image.link, avatar);
    return user;
  }

  async validateUser(code: string): Promise<any>
  {
    var response = {};
	  let token = {};
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
      token = token_data.data;
    } catch (error) {
      error.response.data.status = 403;
      throw new HttpException(error.response.data, HttpStatus.FORBIDDEN, { cause: error });
    }
    if (token['access_token']) 
		response['user'] = await this.aboutMe(token['access_token']);
    response['userId'] = response['user']['userId'];
    response['doubleAuth'] = response['user']['doubleAuth'];
    response['accessToken'] = response['user']['accessToken'];
    response['newUser'] = response['user']['newUser'];
	if (response['user']['doubleAuth'] == false)
		response['accessToken'] = response['user']['accessToken'];
	else
		delete response["user"];
    return (response);
  }

  async verifyTwoFactor(userId: number, code: string)
  {
	if (!code || !userId)
		throw new BadRequestException(`Code or userId is missing.`);
	const DIGIT_EXPRESSION: RegExp = /^\d$/;
	const isDigit = (character: string): boolean => { return character && DIGIT_EXPRESSION.test(character);};

	for (let i = 0; i < code.length; i ++)
	{
		if (isDigit(code[i]) === false)
			throw new BadRequestException(`Code is not a number.`);
	}

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
    	throw new NotFoundException(`User with ${userId} does not exist.`);
    const verified = AuthUtils.verifyTwoFactor(code, user.secert);
	if (verified)
	{
		let response = AuthUtils.getUserData(user.login);
		response['accessToken'] = AuthUtils.signToken(user.id, user.token);
		return response;
	}
	else
		await this.prisma.user.update({ where: { id: userId}, data: {status: 0},});
    return {
      	result: verified,
    };
  }

  async aboutMe(token: string): Promise<any>  
  {
	let response = {
		newUser: false,
	};
	const url_data = 'https://api.intra.42.fr/v2/me';
	const headersRequest = { Authorization: `Bearer ${token}` };
	try {
		const data_response = await this.httpService.get(url_data, { headers: headersRequest }).toPromise();
		let user = await this.prisma.user.findFirst({ where: { login: data_response.data.login } });
		if (!user)
		{
			response['newUser'] = true;
			await this.registerUser(data_response.data);
			user = await this.prisma.user.findFirst({ where: { login: data_response.data.login } });
		}
		if (user)
		{
			await this.prisma.user.update({
				where: { login: data_response.data.login },
				data: { 
				token: CryptoJS.AES.encrypt(token, `${process.env.NODE_ENV}`).toString(),
				status: 1
				},
			});
		}
		if (user && user.doubleAuth == true)
		{
			response['userId'] = user.id;
			response['doubleAuth'] = user.doubleAuth;
			return response;
		}
		const userInfo = await AuthUtils.getUserData( data_response.data.login );
		userInfo['newUser'] = response['newUser'];
		return userInfo;
	} catch (error) {
		console.log('error');
		error.status = 403;
		throw new HttpException(error, HttpStatus.FORBIDDEN, { cause: error });
	}
  }
}