import { 
  Controller, Get, Post, Put, Param, Body, Delete, 
  BadRequestException, NotFoundException, UseInterceptors, UploadedFile, 
  ParseIntPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Маркери')
@Controller('Markers')
export class MarkersController {
  constructor(private readonly MarkersService: MarkersService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі картки' })
  @ApiResponse({ status: 200, description: 'Картки успішно отримано' })
  async getAllMarkers() {
    return this.MarkersService.getAllMarkers();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image')) // Обробка файлів
  @ApiOperation({ summary: 'Створити нову маркер' })
  @ApiResponse({ status: 201, description: 'маркер успішно створено' })
  async createMarker(
    @Body() createMarkerDto: CreateMarkerDto, 
    @UploadedFile() image?: Express.Multer.File
  ) {
    if (!createMarkerDto.path && !image) {
      throw new BadRequestException('Посилання на зображення є обов’язковим');
    }

    // Якщо файл завантажено, зберігаємо його шлях у DTO
    if (image) {
      createMarkerDto.path = image.path; // Якщо файли зберігаються локально
      // createMarkerDto.path = `https://your-storage.com/${image.filename}`; // Якщо файли зберігаються в хмарі
    }

    return this.MarkersService.createMarker(createMarkerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID картки', example: 1 })
  @ApiResponse({ status: 200, description: 'маркер успішно отримано' })
  async getMarkerById(@Param('id', ParseIntPipe) id: number) {
    return this.MarkersService.getMarkerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID картки', example: 1 })
  @ApiResponse({ status: 200, description: 'маркер успішно оновлено' })
  async updateMarker(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMarkerDto: UpdateMarkerDto
  ) {
    return this.MarkersService.updateMarker(id, updateMarkerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID картки', example: 1 })
  @ApiResponse({ status: 200, description: 'маркер успішно видалено' })
  async deleteMarker(@Param('id', ParseIntPipe) id: number) {
    await this.MarkersService.deleteMarker(id);
    return { message: 'маркер успішно видалено' };
  }
}
