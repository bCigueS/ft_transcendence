import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDTO } from './auth.controller';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private config: ConfigService) {}

    async register(dto: RegisterDTO) {
        try {
            if (dto.password !== dto.repeatPassword) throw new BadRequestException("Passwords must be equal!")
            const key = CryptoJS.enc.Utf8.parse(this.config.get('SECRET_PASS'));
            const passwordHash = CryptoJS.AES.encrypt(dto.password, key, {iv: key}).toString()
            const user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: passwordHash
                }
            })
            const {password, ...result} = user
            return {
                statusCode: 201,
                message: "User created successfully.",
                data: result
            }
        } catch (error) {
            console.log(error)
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException("Email or name has already been used!")
                }
            } throw error;
        }
    }
}
