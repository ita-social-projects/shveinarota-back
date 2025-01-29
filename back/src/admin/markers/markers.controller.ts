import { Controller, Get, Post, Put, Param, Body, Delete, ParseIntPipe, UseInterceptors, BadRequestException } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Маркери')
@Controller('markers')
export class MarkersController {
  constructor(private readonly MarkersService: MarkersService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі маркери' })
  @ApiResponse({ status: 200, description: 'Маркер успішно отримано' })
  async getAllMarkers() {
    return this.MarkersService.getAllMarkers();
  }

  @Post()
  @ApiOperation({ summary: 'Створити новий маркер' })
  @ApiResponse({ status: 201, description: 'Маркер успішно створено' })
  @UseInterceptors(AnyFilesInterceptor()) // Используем interceptor для обработки формы
  async createMarker(@Body() createMarkerDto: CreateMarkerDto) {
    if (!createMarkerDto.lat || !createMarkerDto.lng || !createMarkerDto.title) {
      throw new BadRequestException('Поля lat, lng и title обязательны');
    }
    return this.MarkersService.createMarker(createMarkerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiResponse({ status: 200, description: 'Маркер успішно отримано' })
  async getMarkerById(@Param('id', ParseIntPipe) id: number) {
    return this.MarkersService.getMarkerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiResponse({ status: 200, description: 'Маркер успішно оновлено' })
  @UseInterceptors(AnyFilesInterceptor()) // Интерсептор для поддержки FormData
  async updateMarker(@Param('id', ParseIntPipe) id: number, @Body() updateMarkerDto: UpdateMarkerDto) {
    return this.MarkersService.updateMarker(id, updateMarkerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiResponse({ status: 200, description: 'Маркер успішно видалено' })
  async deleteMarker(@Param('id', ParseIntPipe) id: number) {
    await this.MarkersService.deleteMarker(id);
    return { message: 'Маркер успішно видалено' };
  }
}
