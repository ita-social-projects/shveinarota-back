import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUserService } from './authUser.service';
import { AuthUserController } from './authUser.controller';
import {SharedModule} from '../../common/guard/jwt.module'
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SharedModule
  ],
  providers: [AuthUserService],
  controllers: [AuthUserController],
})
export class AuthUserModule {}
