import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistic.service';

@ApiTags('Статистика')
@Controller(':lang/statistic')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({ summary: 'Отримати статистику' })
  @ApiResponse({ status: 200, description: 'Успішне отримання статистики' })
  @ApiResponse({ status: 500, description: 'Внутрішня помилка сервера' })
  @Get()
  async getStatistics() {
    return this.statisticsService.getCounts();
  }
}
