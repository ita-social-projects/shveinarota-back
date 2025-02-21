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
import { LinksService } from './medialink.service';
import { CreateMediaLinkDto } from './dto/create-medialink.dto';
import { UpdateMediaLinkDto } from './dto/update-medialink.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard'; 

/**
 * Контролер для роботи з посиланнями, підтримує мовні маршрути (en, uk)
 */
@ApiTags('Посилання')
@Controller(':lang/medialinks')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі посилання для вказаної мови' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiResponse({ status: 200, description: 'Посилання успішно отримані' })
  async getLinks(@Param('lang') lang: string) {
    return lang === 'en' ? this.linksService.getEnLinks() : this.linksService.getUkLinks();
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі посилання незалежно від мови' })
  @ApiResponse({ status: 200, description: 'Всі посилання успішно отримані' })
  async getAllLinks() {
    return this.linksService.getAllLinks(); // Отримати всі посилання без урахування мови
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати посилання за ID' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'ID посилання', example: 1 })
  @ApiResponse({ status: 200, description: 'Посилання успішно отримано' })
  async getLinkById(@Param('id', ParseIntPipe) id: number, @Param('lang') lang: string) {
    return this.linksService.getLinkById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Створити нове посилання' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMediaLinkDto })
  @ApiResponse({ status: 201, description: 'Посилання успішно створено' })
  @UseInterceptors(FileInterceptor('path', multerOptions('links')))
  async createLink(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!body.title || !body.url) {
      throw new BadRequestException('Поля title та url є обов’язковими');
    }

    const CreateMediaLinkDto: CreateMediaLinkDto = { ...body, path: file ? file.path.replace(/\\/g, '/') : null };
    return this.linksService.createLink(CreateMediaLinkDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Оновити посилання за ID' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'ID посилання', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateMediaLinkDto })
  @ApiResponse({ status: 200, description: 'Посилання успішно оновлено' })
  @UseInterceptors(FileInterceptor('path', multerOptions('links')))
  async updateLink(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const UpdateMediaLinkDto: UpdateMediaLinkDto = { ...body, path: file ? file.path.replace(/\\/g, '/') : undefined };
    return this.linksService.updateLink(id, UpdateMediaLinkDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Видалити посилання за ID' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'ID посилання', example: 1 })
  @ApiResponse({ status: 200, description: 'Посилання успішно видалено' })
  async deleteLink(@Param('id', ParseIntPipe) id: number) {
    await this.linksService.deleteLink(id);
    return { message: 'Посилання успішно видалено' };
  }
}
