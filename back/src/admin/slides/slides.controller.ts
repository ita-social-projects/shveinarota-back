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
@Controller('slides')
export class SlidesController {
  constructor(private readonly SlidesService: SlidesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all slides' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all slides' })
  async getAllSlides() {
    return this.SlidesService.getAllSlides();
  }

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
    return this.SlidesService.createSlide(createSlideDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get slide by ID' })
  @ApiParam({ name: 'id', description: 'Slide ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the slide' })
  async getSlideById(@Param('id', ParseIntPipe) id: number) {
    return this.SlidesService.getSlideById(id);
  }

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
    if (!updateSlideDto.title) {
      throw new BadRequestException('Title is required');
    }

    if (file) {
      updateSlideDto.path = file.path.replace(/\\/g, '/');
    }

    const updatedSlide = await this.SlidesService.updateSlide(id, updateSlideDto);
    return {
      message: 'Slide updated successfully',
      data: updatedSlide,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a slide by ID' })
  @ApiParam({ name: 'id', description: 'Slide ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Slide deleted successfully' })
  async deleteSlide(@Param('id', ParseIntPipe) id: number) {
    await this.SlidesService.deleteSlide(id);
    return { message: 'Slide deleted successfully' };
  }
}
