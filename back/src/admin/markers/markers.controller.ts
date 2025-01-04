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
import { multerOptions } from './multer-options';

@Controller('markers')
export class MarkersController {
  constructor(private readonly MarkersService: MarkersService) {}

  @Get()
  async getAllMarkers() {
    return this.MarkersService.getAllMarkers();
  }

  @Post()
  @UseInterceptors(FileInterceptor('path', multerOptions)) // Указываем 'path' как имя файла
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
  async getMarkerById(@Param('id') id: number) {
    return this.MarkersService.getMarkerById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('path', multerOptions))
  async updateMarker(
    @Param('id') id: number,
    @Body() UpdateMarkerDto: UpdateMarkerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      UpdateMarkerDto.path = file.path.replace(/\\/g, '/'); // Устанавливаем новый путь к картинке
    }

    const updatedMarker = await this.MarkersService.updateMarker(id, UpdateMarkerDto);

    // Явно формируем ответ
    return {
      message: 'Marker updated successfully',
      data: updatedMarker,
    };
  }


  @Delete(':id')
  async deleteMarker(@Param('id') id: number) {
    await this.MarkersService.deleteMarker(id);
    return { message: 'Marker deleted successfully' };
  }
}
