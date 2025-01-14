import {
  Controller,
  Put,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DetailsService } from '../services/details.service';
import { UpdateDetailDto } from '../dto/update-dto/update-detail.dto';

@ApiTags('Details')
@Controller('details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @ApiOperation({ summary: 'Обновление детали' })
  @ApiResponse({ status: 200, description: 'Деталь успешно обновлена.' })
  @ApiResponse({ status: 404, description: 'Деталь не найдена.' })
  @Put(':subcategoryId')
  @UsePipes(ValidationPipe)
  async updateDetail(
    @Param('subcategoryId') subcategoryId: number,
    @Body() updateDetailDto: UpdateDetailDto,
  ) {
    return this.detailsService.updateDetail(subcategoryId, updateDetailDto);
  }
}
