import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthGoogleController } from './authGoogle.controller';
import { AuthGoogleService } from './authGoogle.service';
import { AuthGoogleStrategy } from './authGoogle.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService, AuthGoogleStrategy],
})
export class AuthGoogleModule {}
