import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Slides')
@Controller(':lang/slides') // Параметр lang для учета языка
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // Получение слайдов для указанного языка
  @Get()
  @ApiOperation({ summary: 'Get all slides for the specified language' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all slides for the language' })
  async getSlidesByLang(@Param('lang') lang: string) {
    // Проверяем язык и возвращаем соответствующие слайды
    return lang === 'en' ? this.slidesService.getEnSlides() : this.slidesService.getUkSlides();
  }

  // Получение всех слайдов без учета языка
  @Get('all')
  @ApiOperation({ summary: 'Get all slides regardless of language' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all slides' })
  async getAllSlides() {
    return this.slidesService.getAllSlides();
  }

  // Создание нового слайда
  @Post()
  @ApiOperation({ summary: 'Create a new slide' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSlideDto })
  @ApiResponse({ status: 201, description: 'Slide created successfully' })
  @UseInterceptors(FileInterceptor('path', multerOptions('slides')))
  async createSlide(
    @Body() createSlideDto: CreateSlideDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!createSlideDto.title) {
      throw new BadRequestException('Title is required');
    }

    if (!file) {
      throw new BadRequestException('Slide image file is required');
    }

    createSlideDto.path = file.path.replace(/\\/g, '/');
    return this.slidesService.createSlide(createSlideDto);
  }

  // Получение слайда по ID с полной информацией для обоих языков
  @Get(':id')
  @ApiOperation({ summary: 'Get slide by ID' })
  @ApiParam({ name: 'id', description: 'Slide ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the slide' })
  async getSlideById(@Param('id', ParseIntPipe) id: number) {
    // Получаем слайд по ID с полной информацией для обоих языков
    const slide = await this.slidesService.getSlideById(id);
    if (!slide) {
      throw new BadRequestException(`Slide with ID ${id} not found`);
    }

    // Возвращаем слайд с полной информацией (для обоих языков)
    return {
      id: slide.id,
      path: slide.path,
      title_uk: slide.title, // Здесь предполагается, что `title` - это украинская версия
      title_en: slide.title_en,
      text_uk: slide.text, // Для текста на украинском
      text_en: slide.text_en, // Для текста на английском
    };
  }

  // Обновление слайда по ID
  @Put(':id')
  @ApiOperation({ summary: 'Update a slide by ID' })
  @ApiParam({ name: 'id', description: 'Slide ID', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateSlideDto })
  @ApiResponse({ status: 200, description: 'Slide updated successfully' })
  @UseInterceptors(FileInterceptor('path', multerOptions('slides')))
  async updateSlide(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSlideDto: UpdateSlideDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {

    if (file) {
      updateSlideDto.path = file.path.replace(/\\/g, '/');
    }

    const updatedSlide = await this.slidesService.updateSlide(id, updateSlideDto);
    return {
      message: 'Slide updated successfully',
      data: updatedSlide,
    };
  }

  // Удаление слайда по ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a slide by ID' })
  @ApiParam({ name: 'id', description: 'Slide ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Slide deleted successfully' })
  async deleteSlide(@Param('id', ParseIntPipe) id: number) {
    await this.slidesService.deleteSlide(id);
    return { message: 'Slide deleted successfully' };
  }
}
