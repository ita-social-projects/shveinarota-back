import { Module } from '@nestjs/common';
import { LogoController } from './logo.controller';
import { LogoService } from './logo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logo } from './entities/logo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Logo])], // Подключаем сущность Logo
  controllers: [LogoController],
  providers: [LogoService],
  exports: [LogoService], // Экспортируем сервис, если он понадобится в других модулях
})
export class LogoModule {}
