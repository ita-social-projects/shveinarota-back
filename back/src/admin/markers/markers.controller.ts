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

@ApiTags('Маркери')
@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі маркери' })
  @ApiResponse({ status: 200, description: 'Маркер успішно отримано' })
  async getAllMarkers() {
    return this.markersService.getAllMarkers();
  }

  @Post()
  @ApiOperation({ summary: 'Створити новий маркер' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        lat: { type: 'number' },
        lng: { type: 'number' },
        path: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Маркер успішно створено' })
  @UseInterceptors(FileInterceptor('path', multerOptions('markers')))
  async createMarker(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!body.lat || !body.lng || !body.title) {
      throw new BadRequestException('Поля lat, lng и title обязательны');
    }

    const createMarkerDto: CreateMarkerDto = {
      ...body,
      path: file ? file.path.replace(/\\/g, '/') : null,
    };

    return this.markersService.createMarker(createMarkerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiResponse({ status: 200, description: 'Маркер успішно отримано' })
  async getMarkerById(@Param('id', ParseIntPipe) id: number) {
    return this.markersService.getMarkerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        lat: { type: 'number' },
        lng: { type: 'number' },
        path: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Маркер успішно оновлено' })
  @UseInterceptors(FileInterceptor('path', multerOptions('markers')))
  async updateMarker(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    console.log('Оновлення маркера, вхідні дані:', body);

    const updateMarkerDto: UpdateMarkerDto = {
      ...body,
      path: file ? file.path.replace(/\\/g, '/') : undefined,
    };

    return this.markersService.updateMarker(id, updateMarkerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити маркер за ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiResponse({ status: 200, description: 'Маркер успішно видалено' })
  async deleteMarker(@Param('id', ParseIntPipe) id: number) {
    await this.markersService.deleteMarker(id);
    return { message: 'Маркер успішно видалено' };
  }
}
