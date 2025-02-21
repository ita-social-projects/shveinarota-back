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
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard'; 

@ApiTags('Картки')
@Controller(':lang/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі картки для вказаної мови' })
  @ApiParam({ name: 'lang', required: true, description: 'Мова карток (en або uk)' })
  @ApiResponse({ status: 200, description: 'Список карток успішно отримано' })
  @ApiResponse({ status: 400, description: 'Неправильний формат мови' })
  async getCards(@Param('lang') lang: string) {
    return lang === 'en' ? this.cardsService.getEnCards() : this.cardsService.getUkCards();
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі картки незалежно від мови' })
  @ApiResponse({ status: 200, description: 'Список всіх карток отримано' })
  async getAllCards() {
    return this.cardsService.getAllCards();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати картку за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID картки' })
  @ApiResponse({ status: 200, description: 'Картка успішно отримана' })
  @ApiResponse({ status: 404, description: 'Картку не знайдено' })
  async getCardById(@Param('id', ParseIntPipe) id: number) {
    return this.cardsService.getCardById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Створити нову картку' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Дані для створення картки', type: CreateCardDto })
  @ApiResponse({ status: 201, description: 'Картку успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні картки' })
  @UseInterceptors(FileInterceptor('path', multerOptions('cards')))
  async createCard(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!file) {
      throw new BadRequestException('Файл є обов’язковим.');
    }

    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const createCardDto = new CreateCardDto();
    Object.assign(createCardDto, parsedBody, { path: file.path.replace(/\\/g, '/') });

    return this.cardsService.createCard(createCardDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) // Защищаем маршрут
  @ApiOperation({ summary: 'Оновити картку за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID картки' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Дані для оновлення картки', type: UpdateCardDto })
  @ApiResponse({ status: 200, description: 'Картку успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні картки' })
  @ApiResponse({ status: 404, description: 'Картку не знайдено' })
  @UseInterceptors(FileInterceptor('path', multerOptions('cards')))
  async updateCard(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const updateCardDto: UpdateCardDto = {
      ...parsedBody,
      path: file ? file.path.replace(/\\/g, '/') : undefined,
    };

    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Защищаем маршрут
  @ApiOperation({ summary: 'Видалити картку за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID картки' })
  @ApiResponse({ status: 200, description: 'Картку успішно видалено' })
  @ApiResponse({ status: 404, description: 'Картку не знайдено' })
  async deleteCard(@Param('id', ParseIntPipe) id: number) {
    await this.cardsService.deleteCard(id);
    return { message: 'Картку успішно видалено' };
  }
}
