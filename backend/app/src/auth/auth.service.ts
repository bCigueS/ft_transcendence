import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
constructor(
	private prisma: PrismaService, 
	private jwtService: JwtService, 
	private readonly httpService: HttpService) {}

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
		accessToken: this.jwtService.sign({ userId: user.id }),
	};
}

async registerNewUser(name: string, password: string, login: string): Promise<any> 
{
	const user = await this.prisma.user.findUnique({ where: { login: login } });
}

async validateUser(code: string): Promise<any>
{
	var response = {};
	const url_token = 'https://api.intra.42.fr/oauth/token';
	const data_token = {
		grant_type: "authorization_code",
		client_id: `${process.env.CLIENT_ID}`,
		client_secret: `${process.env.CLIENT_SECRET}`,
		code: code,
		redirect_uri: `${process.env.REDIRECT_URL}`,
	};
	try 
	{
		const token_data = await this.httpService.post(url_token, data_token).toPromise();
		response['token'] = token_data.data;

	} catch (error) { 
		error.response.data.status = 403;
		throw new HttpException(error.response.data , HttpStatus.FORBIDDEN, { cause: error });
	}
	if (response['token']['access_token'])
		response['user'] = await this.aboutMe(response['token']['access_token']);
	return (response);
}

async aboutMe(token: string): Promise<any>
{
	const url_data = 'https://api.intra.42.fr/v2/me';
	const headersRequest = { 'Authorization': `Bearer ${token}`};
	try 
	{
		const data_response = await this.httpService.get(url_data,  {headers: headersRequest}).toPromise();
		const user = await this.prisma.user.findFirst({ where: { login: data_response.data.login } });
		if (!user)
		{
			const user = await this.prisma.user.create({
				data: {
					login: data_response.data.login,
					name: data_response.data.first_name,
					password: data_response.data.id,
					email: data_response.data.email,
				}
			});
		}
		return (data_response.data);
	} catch (error) { 
		error.status = 403;
		throw new HttpException(error.response.data , HttpStatus.FORBIDDEN, { cause: error });
	}	
}

async add2fa(token: string, secret: string): Promise<any>
{
	return (true);
}

async fortyTwo(): Promise<AuthEntity> {
    return {
      accessToken: this.jwtService.sign({ userId: 42 }),
    };
  }

}