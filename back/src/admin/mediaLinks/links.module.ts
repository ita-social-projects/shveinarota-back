import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/links.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link])], // Подключаем сущность links
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService], // Экспортируем сервис, если он понадобится в других модулях
})
export class LinksModule {}