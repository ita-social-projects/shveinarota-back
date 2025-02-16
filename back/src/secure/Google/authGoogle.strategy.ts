import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthGoogleService } from './authGoogle.service';
import { ConfigService } from '@nestjs/config';

// Интерфейс для профиля пользователя Google
interface GoogleProfile {
  id: string;
  emails: { value: string }[];
  displayName: string;
}

@Injectable()
export class AuthGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthGoogleService,
    private configService: ConfigService, // Используем ConfigService для конфигов
  ) {
    super({
      clientID: configService.get<string>('googleAuth.clientId'),
      clientSecret: configService.get<string>('googleAuth.clientSecret'),
      callbackURL: configService.get<string>('googleAuth.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  // Валидируем пользователя
  async validate(accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback): Promise<any> {
    try {
      const user = await this.authService.validateUser(profile);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
