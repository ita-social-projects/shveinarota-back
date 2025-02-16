import { Controller, Post, Body, UseGuards, Request, Put, Res } from '@nestjs/common';
import { AuthUserService } from './authUser.service';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthUserController {
  constructor(private authService: AuthUserService) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response, // Добавляем @Res() в метод контроллера
  ) {
    return this.authService.login(body.username, body.password, res); // Передаем res в сервис
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Request() req, @Body() updateData: Partial<User>): Promise<User> {
    const user = req.user;
    return await this.authService.updateUser(user.username, updateData.username, updateData.password);
  }
}
