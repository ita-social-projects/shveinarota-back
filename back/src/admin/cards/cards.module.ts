import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card])], // Подключаем сущность Card
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService], // Экспортируем сервис, если он понадобится в других модулях
})
export class CardsModule {}