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
  UseGuards
} from '@nestjs/common';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard'; 


/**
 * Контролер для керування слайдами. Підтримує мовні маршрути (en, uk).
 */
@ApiTags('Слайди')
@Controller(':lang/slides') // Параметр lang для урахування мови
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  /**
   * Отримати всі слайди для вказаної мови.
   */
  @Get()
  @ApiOperation({ summary: 'Отримати всі слайди для вказаної мови' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiResponse({ status: 200, description: 'Успішно отримано всі слайди для мови' })
  async getSlidesByLang(@Param('lang') lang: string) {
    return lang === 'en' ? this.slidesService.getEnSlides() : this.slidesService.getUkSlides();
  }

  /**
   * Отримати всі слайди незалежно від мови.
   */
  @Get('all')
  @ApiOperation({ summary: 'Отримати всі слайди незалежно від мови' })
  @ApiResponse({ status: 200, description: 'Успішно отримано всі слайди' })
  async getAllSlides() {
    return this.slidesService.getAllSlides();
  }

  /**
   * Створити новий слайд.
   */
      @Post()
      @UseGuards(JwtAuthGuard) 
      @ApiOperation({ summary: 'Створити новий слайд' })
      @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
      @ApiConsumes('multipart/form-data')
      @ApiBody({ type: CreateSlideDto })
      @ApiResponse({ status: 201, description: 'Слайд успішно створено' })
      @UseInterceptors(AnyFilesInterceptor()) 
      async createSlide(
        @Body() createSlideDto: CreateSlideDto,
        @UploadedFile() file: Express.Multer.File,
      ) { 
        return this.slidesService.createSlide(createSlideDto);
      }
  

  /**
   * Отримати слайд за ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Отримати слайд за ID' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'ID слайду', example: 1 })
  @ApiResponse({ status: 200, description: 'Успішно отримано слайд' })
  async getSlideById(@Param('id', ParseIntPipe) id: number) {
    const slide = await this.slidesService.getSlideById(id);
    if (!slide) {
      throw new BadRequestException(`Слайд з ID ${id} не знайдено`);
    }

    return {
      id: slide.id,
      path: slide.path,
      title: slide.title,
      title_en: slide.title_en,
      text: slide.text,
      text_en: slide.text_en,
    };
  }

  /**
   * Оновити слайд за ID.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Оновити слайд за ID' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'ID слайду', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateSlideDto })
  @ApiResponse({ status: 200, description: 'Слайд успішно оновлено' })
  @UseInterceptors(AnyFilesInterceptor())
  async updateSlide(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSlideDto: UpdateSlideDto,
  ) {
    

    const updatedSlide = await this.slidesService.updateSlide(id, updateSlideDto);
    return {
      message: 'Слайд успішно оновлено',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Видалити слайд за ID' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'ID слайду', example: 1 })
  @ApiResponse({ status: 200, description: 'Слайд успішно видалено' })
  async deleteSlide(@Param('id', ParseIntPipe) id: number) {
    await this.slidesService.deleteSlide(id);
    return { message: 'Слайд успішно видалено' };
  }
}
