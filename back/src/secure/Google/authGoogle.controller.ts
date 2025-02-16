import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGoogleService } from './authGoogle.service';

@Controller('auth/google')
export class AuthGoogleController {
  constructor(private authService: AuthGoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Автоматический редирект на Google OAuth
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    if (!req.user) {
      return res.status(400).json({ message: 'Google authentication failed' });
    }

    const token = await this.authService.generateJwt(req.user);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: 'localhost', // При необходимости измените на нужный домен
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 3600000, // 1 час
    });

    return res.redirect('http://localhost:3000/dashboard');
  }
}
