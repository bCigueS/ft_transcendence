import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Redirect, Res, UseGuards } from '@nestjs/common';
// import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { OAuth42Strategy } from './strategy/passport.strategy';
import {OAuth42Guard} from './auth.guard';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly httpService: HttpService) {}

	@Post('login')
	@ApiOkResponse({ type: AuthEntity })
	login(@Body() { name, password }: LoginDto) {
		return this.authService.login(name, password);
	}
	
	@Get('forty-two')
	@UseGuards(OAuth42Guard, OAuth42Strategy)
	@ApiOkResponse({ type: AuthEntity })
	fortyTwo() {
		return "";
	}

	@Post('me')
	@ApiOkResponse({ type: AuthEntity })
	async token42(
		@Body() { code }
	): Promise<any> {
		var response = {};
		const url_token = 'https://api.intra.42.fr/oauth/token';
		const data_token = {
			grant_type: "authorization_code",
			client_id: `${process.env.CLIENT_ID}`,
			client_secret: `${process.env.CLIENT_SECRET}`,
			code: code,
			redirect_uri: `${process.env.REDIRECT_URL}`,
		};
		console.log(data_token);
		try 
		{
			const t = await this.httpService.post(url_token, data_token).toPromise();
			response['token'] = t.data;
		} catch (error) { 
			error.response.data.status = 403;
			throw new HttpException(error.response.data , HttpStatus.FORBIDDEN, { cause: error });
		}
		// if (response['token']['access_token'])
		// {
		// 	const url_data = 'https://api.intra.42.fr/oauth/token/info';
		// 	const headersRequest = { 'Authorization': `Bearer ${response['token_response']['access_token']}`};
		// 	const data_response = await this.httpService.post(url_data, {},  {headers: headersRequest}).toPromise();
		// 	response['token'] = data_response.data;
		// }
		return (response);
	}
}
