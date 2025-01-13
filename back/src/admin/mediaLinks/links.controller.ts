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
} from '@nestjs/common';
import { linksService } from './links.service';
import { CreatelinkDto } from './dto/create-links.dto';
import { UpdatelinkDto } from './dto/update-links.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Media Links') // Group under 'Media Links' in Swagger UI
@Controller('medialinks')
export class linksController {
  constructor(private readonly linksService: linksService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все ссылки' })
  @ApiResponse({ status: 200, description: 'Ссылки успешно получены' })
  async getAlllinks() {
    return this.linksService.getAlllinks();
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую ссылку' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatelinkDto })
  @ApiResponse({ status: 201, description: 'Ссылка успешно создана' })
  @UseInterceptors(FileInterceptor('path', multerOptions('links')))
  async createlink(
    @Body() createlinkDto: CreatelinkDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createlinkDto.path = file.path.replace(/\\/g, '/'); // Универсальный вид пути
    }
    return this.linksService.createlink(createlinkDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить ссылку по ID' })
  @ApiParam({ name: 'id', description: 'ID ссылки', example: 1 })
  @ApiResponse({ status: 200, description: 'Ссылка успешно получена' })
  async getlinkById(@Param('id') id: number) {
    return this.linksService.getlinkById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить ссылку по ID' })
  @ApiParam({ name: 'id', description: 'ID ссылки', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatelinkDto })
  @ApiResponse({ status: 200, description: 'Ссылка успешно обновлена' })
  @UseInterceptors(FileInterceptor('path', multerOptions('links')))
  async updatelink(
    @Param('id') id: number,
    @Body() updatelinkDto: UpdatelinkDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updatelinkDto.path = file.path.replace(/\\/g, '/'); // Универсальный вид пути
    }
    const updatedlink = await this.linksService.updatelink(id, updatelinkDto);
    return {
      message: 'Link updated successfully',
      data: updatedlink,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить ссылку по ID' })
  @ApiParam({ name: 'id', description: 'ID ссылки', example: 1 })
  @ApiResponse({ status: 200, description: 'Ссылка успешно удалена' })
  async deletelink(@Param('id') id: number) {
    await this.linksService.deletelink(id);
    return { message: 'Link deleted successfully' };
  }
}
