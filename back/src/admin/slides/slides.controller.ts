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
} from '@nestjs/common';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './slides-options';

@Controller('slides')
export class SlidesController {
  constructor(private readonly SlidesService: SlidesService) {}

  @Get()
  async getAllSlides() {
    return this.SlidesService.getAllSlides();
  }

  @Post()
  @UseInterceptors(FileInterceptor('path', multerOptions)) // Указываем 'path' как имя файла
  async createSlide(
    @Body() createSlideDto: CreateSlideDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createSlideDto.path = file.path.replace(/\\/g, '/'); // Универсальный вид пути
    } 

    
    return this.SlidesService.createSlide(createSlideDto);
  }
  

  @Get(':id')
  async getSlideById(@Param('id') id: number) {
    return this.SlidesService.getSlideById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('path', multerOptions))
  async updateSlide(
    @Param('id') id: number,
    @Body() UpdateSlideDto: UpdateSlideDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      UpdateSlideDto.path = file.path.replace(/\\/g, '/'); // Устанавливаем новый путь к картинке
    }

    const updatedSlide = await this.SlidesService.updateSlide(id, UpdateSlideDto);

    // Явно формируем ответ
    return {
      message: 'Slide updated successfully',
      data: updatedSlide,
    };
  }


  @Delete(':id')
  async deleteSlide(@Param('id') id: number) {
    await this.SlidesService.deleteSlide(id);
    return { message: 'Slide deleted successfully' };
  }
}
