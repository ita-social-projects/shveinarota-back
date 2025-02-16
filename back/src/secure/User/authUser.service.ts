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

  async validateUser(pass: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({}); // Используем findOneBy()
  
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { username: user.username };
  }
  

  async login(password: string): Promise<{ access_token: string }> {
    const user = await this.validateUser(password);
    const payload = { username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }

  async updateUser(username: string, password: string): Promise<User> {
    const users = await this.usersRepository.find();
    if (users.length > 0) {
        await this.usersRepository.remove(users);
    }
    const newUser = this.usersRepository.create({
        username,
        password: await bcrypt.hash(password, 10)
    });

    return await this.usersRepository.save(newUser);
}




}
