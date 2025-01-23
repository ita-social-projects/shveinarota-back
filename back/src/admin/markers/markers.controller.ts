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

@ApiTags('Markers')
@Controller('Markers')
export class MarkersController {
  constructor(private readonly MarkersService: MarkersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все карточки' })
  @ApiResponse({ status: 200, description: 'Карточки успешно получены' })
  async getAllMarkers() {
    return this.MarkersService.getAllMarkers();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image')) // Обработка файлов
  @ApiOperation({ summary: 'Создать новую карточку' })
  @ApiResponse({ status: 201, description: 'Карточка успешно создана' })
  async createMarker(
    @Body() createMarkerDto: CreateMarkerDto, 
    @UploadedFile() image?: Express.Multer.File
  ) {
    if (!createMarkerDto.path && !image) {
      throw new BadRequestException('Ссылка на изображение обязательна');
    }

    // Если файл загружен, сохраняем его путь в DTO
    if (image) {
      createMarkerDto.path = image.path; // Если храните файлы локально
      // createMarkerDto.path = `https://your-storage.com/${image.filename}`; // Если храните в облаке
    }

    return this.MarkersService.createMarker(createMarkerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно получена' })
  async getMarkerById(@Param('id', ParseIntPipe) id: number) {
    return this.MarkersService.getMarkerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно обновлена' })
  async updateMarker(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMarkerDto: UpdateMarkerDto
  ) {
    return this.MarkersService.updateMarker(id, updateMarkerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно удалена' })
  async deleteMarker(@Param('id', ParseIntPipe) id: number) {
    await this.MarkersService.deleteMarker(id);
    return { message: 'Карточка успешно удалена' };
  }
}
