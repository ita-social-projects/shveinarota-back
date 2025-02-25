import { Module } from '@nestjs/common';
import { LogoController } from './logo.controller';
import { LogoService } from './logo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logo } from './entities/logo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Logo])], 
  controllers: [LogoController],
  providers: [LogoService],
  exports: [LogoService], 
})
export class LogoModule {}
