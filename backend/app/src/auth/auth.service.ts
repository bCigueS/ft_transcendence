import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import axios from 'axios';
import fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as speakeasy from 'speakeasy';
import * as CryptoJS from 'crypto-js';

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

	const token = jwt.sign({
		accessToken: user.token,
		userId: user.id
	}, `${process.env.NODE_ENV}`, { expiresIn: '1h' });

	console.log(token);

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
    if (token['access_token']) response['user'] = await this.aboutMe(token['access_token']);
    response['userId'] = response['user']['userId'];
    response['doubleAuth'] = response['user']['doubleAuth'];
	if (response['user']['doubleAuth'] == false)
	{
		response['accessToken'] = jwt.sign({
			accessToken: token['access_token'],
			userId: response['userId']
		}, `${process.env.NODE_ENV}`, { expiresIn: '1h' });
	}
	else
		delete response["user"];
    return response;
  }


  async verifyTwoFactorAuthenticationCode(userId: number, code: string)
  {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
    	throw new NotFoundException(`User with ${userId} does not exist.`);
    const verified = speakeasy.totp.verify({
      secret: user.secert,
      encoding: 'base32',
      token: code,
    });
	if (verified)
	{
		try {
			const url_data = 'https://api.intra.42.fr/v2/me';
			const token = CryptoJS.AES.decrypt(user.token, `${process.env.NODE_ENV}`).toString(CryptoJS.enc.Utf8);
			const headersRequest = { Authorization: `Bearer ${token}` };
			const data_response = await this.httpService.get(url_data, { headers: headersRequest }).toPromise();
			if (user)
				await this.prisma.user.update({ where: { id42: data_response.data['id'] }, data: {status: 1},});
			
			const accessToken = jwt.sign({
				accessToken: token,
				userId: user.id
			}, `${process.env.NODE_ENV}`, { expiresIn: '1h' });
			
			return {
				accessToken: accessToken,
				userId: user.id,
				doubleAuth: user.doubleAuth,
				id: data_response.data['id'],
				email: data_response.data['email'],
				login: data_response.data['login'],
				displayname: data_response.data['displayname'],
				image: data_response.data['image_url'],
				first_name: data_response.data['first_name'],
				last_name: data_response.data['last_name'],
			};
		} catch (error) {
			error.status = 403;
			throw new HttpException(error, HttpStatus.FORBIDDEN, { cause: error });
		}
	}
	else
		await this.prisma.user.update({ where: { id: userId}, data: {status: 0},});
    return {
      	result: verified,
    };
  }

  async aboutMe(token: string): Promise<any>  
  {
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
					token: CryptoJS.AES.encrypt(token, `${process.env.NODE_ENV}`).toString(),
					status: 1
				},
			});
		}
		if (user.doubleAuth == true)
		{
			return {
				userId: user.id,
				doubleAuth: user.doubleAuth,
			};
		}
		return {
			userId: user.id,
			doubleAuth: user.doubleAuth,
			id: data_response.data['id'],
			email: data_response.data['email'],
			login: data_response.data['login'],
			displayname: data_response.data['displayname'],
			image: data_response.data['image_url'],
			first_name: data_response.data['first_name'],
			last_name: data_response.data['last_name'],
		};
    } catch (error) {
      error.status = 403;
      throw new HttpException(error, HttpStatus.FORBIDDEN, { cause: error });
    }
  }
}