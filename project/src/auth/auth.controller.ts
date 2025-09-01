import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AccessTokenGuard } from './guards/access.token.guard';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: express.Request) {
    const user = req.user as { sub: string };
    console.log('Logging out user:', user.sub);
    // this.authService.logout(user.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: express.Request) {
    const user = req.user as { sub: string; refreshToken: string };
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req: express.Request) {
    return req.user;
  }
}
