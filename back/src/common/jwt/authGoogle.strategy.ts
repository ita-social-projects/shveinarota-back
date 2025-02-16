import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Интерфейс для payload JWT
interface JwtPayload {
  email: string;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.jwt]),
      secretOrKey: configService.get<string>('jwt.secret'), // Используем ConfigService
    });
  }

  async validate(payload: JwtPayload) {
    return { email: payload.email, name: payload.name };
  }
}
