import { 
  Controller, Get, Post, Put, Param, Body, Delete, 
  BadRequestException, NotFoundException, UseInterceptors, UploadedFile, 
  ParseIntPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LinksService } from './links.service';
import { CreatelinkDto } from './dto/create-links.dto';
import { UpdatelinkDto } from './dto/update-links.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Links')
@Controller('medialinks')
export class LinksController {
  constructor(private readonly LinksService: LinksService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все карточки' })
  @ApiResponse({ status: 200, description: 'Карточки успешно получены' })
  async getAllLinks() {
    return this.LinksService.getAllLinks();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image')) // Обработка файлов
  @ApiOperation({ summary: 'Создать новую карточку' })
  @ApiResponse({ status: 201, description: 'Карточка успешно создана' })
  async createLink(
    @Body() createLinkDto: CreatelinkDto, 
    @UploadedFile() image?: Express.Multer.File
  ) {
    if (!createLinkDto.path && !image) {
      throw new BadRequestException('Ссылка на изображение обязательна');
    }

    // Если файл загружен, сохраняем его путь в DTO
    if (image) {
      createLinkDto.path = image.path; // Если храните файлы локально
      // createLinkDto.path = `https://your-storage.com/${image.filename}`; // Если храните в облаке
    }

    return this.LinksService.createLinks(createLinkDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно получена' })
  async getLinkById(@Param('id', ParseIntPipe) id: number) {
    return this.LinksService.getLinksById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно обновлена' })
  async updateLink(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateLinkDto: UpdatelinkDto
  ) {
    return this.LinksService.updateLinks(id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно удалена' })
  async deleteLink(@Param('id', ParseIntPipe) id: number) {
    await this.LinksService.deleteLinks(id);
    return { message: 'Карточка успешно удалена' };
  }
}
