import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({ username });
  
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { username: user.username };
  }
  

  async login(username: string, password: string): Promise<{ auth_token: string }> {
    const user = await this.validateUser(username, password);
    const payload = { username: user.username };
    return { auth_token: this.jwtService.sign(payload) };
  }

  async updateUser(currentUsername: string, newUsername: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username: currentUsername } });

    if (!user) {
        throw new Error('User not found');
    }

    if (newUsername) {
        user.username = newUsername; // Оновлюємо ім'я користувача
    }
    
    if (password) {
        user.password = await bcrypt.hash(password, 10); // Оновлюємо пароль
    }

    return await this.usersRepository.save(user);
  }





}
