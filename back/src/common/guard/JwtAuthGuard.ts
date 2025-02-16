import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Проверяем JWT-токен, который выдал сервер после входа (локальный или Google)
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload; // Сохраняем данные пользователя в request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
