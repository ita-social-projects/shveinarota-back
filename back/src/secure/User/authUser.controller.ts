import { Controller, Post, Body, UseGuards, Request, Put } from '@nestjs/common';
import { AuthUserService } from './authUser.service';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthUserController {
  constructor(private authService: AuthUserService) {}

  @Post('login')
  async login(@Body() body: { password: string }) {
    return this.authService.login(body.password);
  }

  @Post('protected')
  @UseGuards(JwtAuthGuard)
  getProtected(@Request() req) {
    return { message: 'You have access', user: req.user };
  }

  @Put()
  @UseGuards(JwtAuthGuard) 
  async updateUser(@Request() req, @Body() updateData: Partial<User>): Promise<User> {
    const user = req.user; 
    return await this.authService.updateUser(user.username, updateData.password);
  }
}
