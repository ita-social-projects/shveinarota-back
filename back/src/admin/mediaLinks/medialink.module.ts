import { Module } from '@nestjs/common';
import { LinksController } from './medialink.controller';
import { LinksService } from './medialink.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaLink } from './entities/medialink.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaLink])], // Подключаем сущность links
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService], // Экспортируем сервис, если он понадобится в других модулях
})
export class LinksModule {}