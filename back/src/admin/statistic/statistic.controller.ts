import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistic.service';

@Controller('statistic')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getStatistics() {
    return this.statisticsService.getCounts();
  }
}
