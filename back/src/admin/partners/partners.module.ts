import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partners.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partner])], // Подключаем сущность Card
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService], // Экспортируем сервис, если он понадобится в других модулях
})
export class PartnersModule {}