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

@ApiTags('Слайди')
@Controller('slides')
export class SlidesController {
  constructor(private readonly SlidesService: SlidesService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі слайди' })
  @ApiResponse({ status: 200, description: 'Слайди успішно отримані' })
  async getAllSlidess() {
    return this.SlidesService.getAllSlides();
  }

  @Post()
  @ApiOperation({ summary: 'Створити новий слайд' })
  @ApiResponse({ status: 201, description: 'Слайд успішно створений' })
  async createSlides(
    @Body() createSlidesDto: CreateSlideDto, 
  ) {
    if (!createSlidesDto.path ) {
      throw new BadRequestException('Посилання на зображення є обов’язковим');
    }

    return this.SlidesService.createSlides(createSlidesDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати слайд за ID' })
  @ApiParam({ name: 'id', description: 'ID слайду', example: 1 })
  @ApiResponse({ status: 200, description: 'Слайд успішно отриманий' })
  async getSlidesById(@Param('id', ParseIntPipe) id: number) {
    return this.SlidesService.getSlidesById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити слайд за ID' })
  @ApiParam({ name: 'id', description: 'ID слайду', example: 1 })
  @ApiResponse({ status: 200, description: 'Слайд успішно оновлений' })
  async updateSlides(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSlidesDto: UpdateSlideDto
  ) {
    return this.SlidesService.updateSlides(id, updateSlidesDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити слайд за ID' })
  @ApiParam({ name: 'id', description: 'ID слайду', example: 1 })
  @ApiResponse({ status: 200, description: 'Слайд успішно видалений' })
  async deleteSlides(@Param('id', ParseIntPipe) id: number) {
    await this.SlidesService.deleteSlides(id);
    return { message: 'Слайд успішно видалений' };
  }
}
