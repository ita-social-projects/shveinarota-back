import { 
  Controller, Get, Post, Put, Param, Body, Delete, 
  BadRequestException, NotFoundException, UseInterceptors, UploadedFile, 
  ParseIntPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Slides')
@Controller('slides')
export class SlidesController {
  constructor(private readonly SlidesService: SlidesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все карточки' })
  @ApiResponse({ status: 200, description: 'Карточки успешно получены' })
  async getAllSlidess() {
    return this.SlidesService.getAllSlides();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image')) // Обработка файлов
  @ApiOperation({ summary: 'Создать новую карточку' })
  @ApiResponse({ status: 201, description: 'Карточка успешно создана' })
  async createSlides(
    @Body() createSlidesDto: CreateSlideDto, 
    @UploadedFile() image?: Express.Multer.File
  ) {
    if (!createSlidesDto.path && !image) {
      throw new BadRequestException('Ссылка на изображение обязательна');
    }

    // Если файл загружен, сохраняем его путь в DTO
    if (image) {
      createSlidesDto.path = image.path; // Если храните файлы локально
      // createSlidesDto.path = `https://your-storage.com/${image.filename}`; // Если храните в облаке
    }

    return this.SlidesService.createSlides(createSlidesDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно получена' })
  async getSlidesById(@Param('id', ParseIntPipe) id: number) {
    return this.SlidesService.getSlidesById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно обновлена' })
  async updateSlides(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSlidesDto: UpdateSlideDto
  ) {
    return this.SlidesService.updateSlides(id, updateSlidesDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно удалена' })
  async deleteSlides(@Param('id', ParseIntPipe) id: number) {
    await this.SlidesService.deleteSlides(id);
    return { message: 'Карточка успешно удалена' };
  }
}
