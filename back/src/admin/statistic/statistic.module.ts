import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistic.service';
import { StatisticsController } from './statistic.controller';
import { Marker } from '../markers/entities/markers.entity';
import { Card } from '../cards/entities/card.entity';
import { MediaLink } from '../mediaLinks/entities/medialink.entity';
import { Partner } from '../partners/entities/partners.entity';
import { Slide } from '../slides/entities/slide.entity';
import { Category } from '../data_guides/entities/category.entity'
import { Subcategory } from '../data_guides/entities/subcategory.entity'



@Module({
  imports: [TypeOrmModule.forFeature([Marker, Card, MediaLink, Partner, Slide, Category, Subcategory])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
