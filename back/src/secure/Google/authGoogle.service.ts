import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface GoogleProfile {
  emails: { value: string }[];
  displayName: string;
}

@Injectable()
export class AuthGoogleService {
  private allowedEmail: string;
  private jwtExpiresIn: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {

    this.allowedEmail = this.configService.get<string>('ALLOWED_GOOGLE_EMAIL', '');
    this.jwtExpiresIn = this.configService.get<string>('jwt.expiresIn', '1h');

    if (!this.allowedEmail) {
      throw new UnauthorizedException('Allowed Google email not configured');
    }
  }

  async validateUser(profile: GoogleProfile) {
    const email = profile.emails[0].value;


    if (email !== this.allowedEmail) {
      throw new UnauthorizedException('Access Denied');
    }

    return { email, name: profile.displayName };
  }

  async generateJwt(user: { email: string; name: string }) {
    return this.jwtService.signAsync(
      { email: user.email, name: user.name },
      { expiresIn: this.jwtExpiresIn }, 
    );
  }
}
