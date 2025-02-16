import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUserService } from './authUser.service';
import { AuthUserController } from './authUser.controller';
import { JwtStrategy } from '../../common/jwt/authUser.strategy';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h') },
      }),
    }),
  ],
  providers: [AuthUserService, JwtStrategy],
  controllers: [AuthUserController],
})
export class AuthUserModule {}
