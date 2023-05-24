import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
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

	@Get('forty-two/callback')
	@ApiOkResponse({ type: AuthEntity })
	async fortyTwoCallback(
		@Query('code') code: string,
		// @Res() res: Response,
	): Promise<any> {
		const url = 'https://api.intra.42.fr/oauth/token';
		const data = {
		  grant_type: "authorization_code",
		  client_id: `${process.env.CLIENT_ID}`,
		  client_secret: `${process.env.CLIENT_SECRET}`,
		  code: code,
		  redirect_uri: "http://127.0.0.1:3000/auth/forty-two/callback",
		};
		const response = await this.httpService.post(url, data).toPromise();
		// console.log(response.data);
		return (response.data);
		// return "code";
		// const redirectUrl = new URL(`http://127.0.0.1:3000/`);
		// return res.redirect(redirectUrl.toString());
	  }
}
