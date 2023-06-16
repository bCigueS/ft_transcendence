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
	token42( @Body() { code } ): Promise<any> {
		return this.authService.validateUser(code);
	}
}
