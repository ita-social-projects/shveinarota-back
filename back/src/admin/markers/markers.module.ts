import { Module } from '@nestjs/common';
import { MarkersController } from './markers.controller';
import { MarkersService } from './markers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marker } from './entities/markers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marker])], // Подключаем сущность Card
  controllers: [MarkersController],
  providers: [MarkersService],
  exports: [MarkersService], // Экспортируем сервис, если он понадобится в других модулях
})
export class MarkersModule {}