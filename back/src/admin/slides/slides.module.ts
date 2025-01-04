import { Module } from '@nestjs/common';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slide } from './entities/slide.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slide])], // Подключаем сущность Card
  controllers: [SlidesController],
  providers: [SlidesService],
  exports: [SlidesService], // Экспортируем сервис, если он понадобится в других модулях
})
export class SlidesModule {}