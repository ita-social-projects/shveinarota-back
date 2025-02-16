import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGoogleService } from './authGoogle.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth/google')
export class AuthGoogleController {
  constructor(
    private authService: AuthGoogleService,
    private configService: ConfigService
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Автоматический редирект на Google OAuth
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    if (!req.user) {
      return res.status(400).json({ message: 'Google authentication failed' });
    }

    const token = await this.authService.generateJwt(req.user);

    // Получаем домен из конфига
    const domain = this.configService.get<string>('database.domain') || 'localhost';

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain, // Используем домен из конфига
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 3600000, // 1 час
    });

    return { message: 'Authentication successful' };
  }
}
