import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // 1️⃣ Получаем токен из cookie
    let token = request.cookies?.auth_token;

    // 2️⃣ Если в cookie нет токена, пробуем взять его из заголовка Authorization
    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]; // Берем вторую часть после "Bearer "
      }
    }

    if (!token) {
      console.log('No token provided');
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Проверяем токен
      const payload = await this.jwtService.verifyAsync(token.trim());
      (request as any).user = payload;
      return true;
    } catch (error) {
      console.log('Invalid token:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
