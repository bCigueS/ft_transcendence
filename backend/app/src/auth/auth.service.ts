import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
  
@Injectable()
export class AuthService {
constructor(private prisma: PrismaService, private jwtService: JwtService) {}

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
}