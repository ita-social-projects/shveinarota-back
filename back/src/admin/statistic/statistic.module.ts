import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistic.service';
import { StatisticsController } from './statistic.controller';
import { Marker } from '../markers/entities/markers.entity';
import { Card } from '../cards/entities/card.entity';
import { Link } from '../mediaLinks/entities/links.entity';
import { Partner } from '../partners/entities/partners.entity';
import { Slide } from '../slides/entities/slide.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Marker, Card, Link, Partner, Slide])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
