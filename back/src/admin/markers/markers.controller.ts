import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard'; 

/**
 * Контролер для роботи з маркерами, підтримує мовні маршрути (en, uk)
 */
@ApiTags('Маркери')
@Controller(':lang/markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі маркери для вказаної мови' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  async getMarkers(@Param('lang') lang: string) {
    return lang === 'en' ? this.markersService.getEnMarkers() : this.markersService.getUkMarkers();
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі маркери незалежно від мови' })
  async getAllMarkers() {
    return this.markersService.getAllMarkers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  async getMarkerById(@Param('id', ParseIntPipe) id: number) {
    return this.markersService.getMarkerById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Створити новий маркер' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMarkerDto })
  @ApiResponse({ status: 201, description: 'Маркер успішно створено' })
  @UseInterceptors(FileInterceptor('path', multerOptions('markers')))
  async createMarker(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const missingFields = [];
    if (!body.lat) missingFields.push('lat');
    if (!body.lng) missingFields.push('lng');
    if (!body.title) missingFields.push('title');

    if (missingFields.length > 0) {
      throw new BadRequestException(`Наступні поля обов'язкові: ${missingFields.join(', ')}`);
    }

    const createMarkerDto: CreateMarkerDto = {
      ...body,
      lat: parseFloat(body.lat),
      lng: parseFloat(body.lng),
    };

    return this.markersService.createMarker(createMarkerDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Оновити маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateMarkerDto })
  @ApiResponse({ status: 200, description: 'Маркер успішно оновлено' })
  @UseInterceptors(FileInterceptor('path', multerOptions('markers')))
  async updateMarker(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const updateMarkerDto: UpdateMarkerDto = {
      ...body,
      lat: body.lat ? parseFloat(body.lat) : undefined,
      lng: body.lng ? parseFloat(body.lng) : undefined,
    };

    return this.markersService.updateMarker(id, updateMarkerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Видалити маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiResponse({ status: 200, description: 'Маркер успішно видалено' })
  async deleteMarker(@Param('id', ParseIntPipe) id: number) {
    await this.markersService.deleteMarker(id);
    return { message: 'Маркер успішно видалено' };
  }
}
