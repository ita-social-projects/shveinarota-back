import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';


@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService, // Подключаем ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { username: user.username };
  }

  async login(
    username: string,
    password: string,
    res: Response, // Добавляем параметр res для работы с куки
  ): Promise<void> {
    // Получаем дефолтные значения из .env
    const defaultUsername = this.configService.get<string>('DEFAULT_USERNAME');
    const defaultPassword = this.configService.get<string>('DEFAULT_PASSWORD');

    if (!defaultUsername || !defaultPassword) {
      throw new Error('DEFAULT_USERNAME or DEFAULT_PASSWORD is not set in .env');
    }

    // Проверяем, есть ли пользователи в базе
    const userCount = await this.usersRepository.count();
    let user: User;

    if (userCount === 0) {
      // Создаем дефолтного пользователя, если БД пустая
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      user = this.usersRepository.create({
        username: defaultUsername,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
    } else {
      // Получаем первого пользователя
      user = await this.usersRepository.findOne({ where: {} });

      let updated = false;

      // Если username или password отсутствует, задаем дефолтные значения
      if (!user.username) {
        user.username = defaultUsername;
        updated = true;
      }
      if (!user.password) {
        user.password = await bcrypt.hash(defaultPassword, 10);
        updated = true;
      }

      if (updated) {
        await this.usersRepository.save(user);
      }
    }

    // Проверяем учетные данные
    const validUser = await this.validateUser(username, password);
    if (!validUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Генерируем JWT-токен
    const payload = { username: validUser.username };
    const authToken = this.jwtService.sign(payload);

    // Устанавливаем токен в HttpOnly куки
    res.cookie('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Только в продакшене
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 день
    });

    // Отправляем успешный ответ
    res.send({ message: 'Login successful' });
  }
  

  async updateUser(currentUsername: string, newUsername: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username: currentUsername } });

    if (!user) {
      throw new Error('User not found');
    }

    if (newUsername) {
      user.username = newUsername;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    return await this.usersRepository.save(user);
  }
}
