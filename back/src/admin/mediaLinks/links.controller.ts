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
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-links.dto';
import { UpdateLinkDto } from './dto/update-links.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';

/**
 * Контроллер для работы с ссылками, поддерживает языковые маршруты (en, uk)
 */
@ApiTags('Ссылки')
@Controller(':lang/medialinks')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все ссылки для указанного языка' })
  async getLinks(@Param('lang') lang: string) {
    return lang === 'en' ? this.linksService.getEnLinks() : this.linksService.getUkLinks();
  }

  @Get('all')
  @ApiOperation({ summary: 'Получить все ссылки независимо от языка' })
  async getAllLinks() {
    return this.linksService.getAllLinks(); // Для получения всех ссылок без учёта языка
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить ссылку по ID' })
  @ApiParam({ name: 'id', description: 'ID ссылки', example: 1 })
  @ApiResponse({ status: 200, description: 'Ссылка успешно получена' })
  async getLinkById(@Param('id', ParseIntPipe) id: number, @Param('lang') lang: string) {
    return this.linksService.getLinkById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую ссылку' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLinkDto })
  @ApiResponse({ status: 201, description: 'Ссылка успешно создана' })
  @UseInterceptors(FileInterceptor('path', multerOptions('links')))
  async createLink(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!body.title || !body.url) {
      throw new BadRequestException('Поля title и url обязательны');
    }

    const createLinkDto: CreateLinkDto = { ...body, path: file ? file.path.replace(/\\/g, '/') : null };
    return this.linksService.createLink(createLinkDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить ссылку по ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('path', multerOptions('links')))
  async updateLink(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const updateLinkDto: UpdateLinkDto = { ...body, path: file ? file.path.replace(/\\/g, '/') : undefined };
    return this.linksService.updateLink(id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить ссылку по ID' })
  async deleteLink(@Param('id', ParseIntPipe) id: number) {
    await this.linksService.deleteLink(id);
    return { message: 'Ссылка успешно удалена' };
  }
}
