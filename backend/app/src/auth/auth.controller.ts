import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { OAuth42Strategy } from './strategy/passport.strategy';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@ApiOkResponse({ type: AuthEntity })
	login(@Body() { name, password }: LoginDto) {
		return this.authService.login(name, password);
	}
	
	@Get('forty-two')
	@UseGuards(AuthGuard(), OAuth42Strategy)
	@ApiOkResponse({ type: AuthEntity })
	fortyTwo() {
		return "";
	}
}
