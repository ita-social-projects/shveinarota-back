import { Module } from '@nestjs/common';
import { linksController } from './links.controller';
import { linksService } from './links.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { link } from './entities/links.entity';

@Module({
  imports: [TypeOrmModule.forFeature([link])], // Подключаем сущность links
  controllers: [linksController],
  providers: [linksService],
  exports: [linksService], // Экспортируем сервис, если он понадобится в других модулях
})
export class LinksModule {}