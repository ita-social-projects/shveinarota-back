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
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Markers') // Grouped under 'Markers' in Swagger UI
@Controller('markers')
export class MarkersController {
  constructor(private readonly MarkersService: MarkersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все маркеры' })
  @ApiResponse({ status: 200, description: 'Маркеры успешно получены' })
  async getAllMarkers() {
    return this.MarkersService.getAllMarkers();
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый маркер' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMarkerDto })
  @ApiResponse({ status: 201, description: 'Маркер успешно создан' })
  @UseInterceptors(FileInterceptor('path', multerOptions('markers')))
  async createMarker(
    @Body() createMarkerDto: CreateMarkerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createMarkerDto.path = file.path.replace(/\\/g, '/'); // Универсальный вид пути
    }
    return this.MarkersService.createMarker(createMarkerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить маркер по ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiResponse({ status: 200, description: 'Маркер успешно получен' })
  async getMarkerById(@Param('id') id: number) {
    return this.MarkersService.getMarkerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить маркер по ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateMarkerDto })
  @ApiResponse({ status: 200, description: 'Маркер успешно обновлен' })
  @UseInterceptors(FileInterceptor('path', multerOptions('markers')))
  async updateMarker(
    @Param('id') id: number,
    @Body() updateMarkerDto: UpdateMarkerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateMarkerDto.path = file.path.replace(/\\/g, '/'); // Универсальный вид пути
    }
    const updatedMarker = await this.MarkersService.updateMarker(id, updateMarkerDto);
    return {
      message: 'Marker updated successfully',
      data: updatedMarker,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить маркер по ID' })
  @ApiParam({ name: 'id', description: 'ID маркера', example: 1 })
  @ApiResponse({ status: 200, description: 'Маркер успешно удален' })
  async deleteMarker(@Param('id') id: number) {
    await this.MarkersService.deleteMarker(id);
    return { message: 'Marker deleted successfully' };
  }
}
