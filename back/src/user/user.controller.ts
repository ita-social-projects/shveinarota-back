import { Controller, Post, Body, BadRequestException, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<any> {
    return this.userService.getAllUsers();
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByUsername(createUserDto.username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    return this.userService.create(createUserDto.username, createUserDto.password);
  }
}
