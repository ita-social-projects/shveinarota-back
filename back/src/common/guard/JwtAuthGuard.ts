import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('Headers:', request.headers);
    
    // Отримуємо токен із кукі
    const authToken = request.cookies?.auth_token;

    if (!authToken || typeof authToken !== 'string') {
      console.log('No token provided or invalid type');
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(authToken.trim());
      console.log('Token payload:', payload);
      (request as any).user = payload;
      return true;
    } catch (error) {
      console.log('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
