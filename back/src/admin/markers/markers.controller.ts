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
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';

/**
 * Контролер для роботи з маркерами, підтримує мовні маршрути (en, uk)
 */
@ApiTags('Маркери')
@Controller(':lang/markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі маркери для вказаної мови' })
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
  async getMarkerById(@Param('id', ParseIntPipe) id: number) {
    return this.markersService.getMarkerById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити новий маркер' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('path', multerOptions('markers')))
  async createMarker(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!body.lat || !body.lng || !body.title) {
      throw new BadRequestException('Поля lat, lng и title обязательны');
    }

    const createMarkerDto: CreateMarkerDto = { ...body, path: file ? file.path.replace(/\\/g, '/') : null };
    return this.markersService.createMarker(createMarkerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити маркер за ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('path', multerOptions('markers')))
  async updateMarker(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const updateMarkerDto: UpdateMarkerDto = { ...body, path: file ? file.path.replace(/\\/g, '/') : undefined };
    return this.markersService.updateMarker(id, updateMarkerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити маркер за ID' })
  async deleteMarker(@Param('id', ParseIntPipe) id: number) {
    await this.markersService.deleteMarker(id);
    return { message: 'Маркер успішно видалено' };
  }
}
