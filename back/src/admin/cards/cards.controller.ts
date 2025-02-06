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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';

/**
 * Контролер для роботи з картками, підтримує мовні маршрути (en, uk)
 */
@ApiTags('Картки')
@Controller(':lang/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі картки для вказаної мови' })
  async getCards(@Param('lang') lang: string) {
    return lang === 'en' ? this.cardsService.getEnCards() : this.cardsService.getUkCards();
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі картки незалежно від мови' })
  async getAllCards() {
    return this.cardsService.getAllCards();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати картку за ID' })
  async getCardById(@Param('id', ParseIntPipe) id: number) {
    return this.cardsService.getCardById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити нову картку' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('path', multerOptions('cards')))
  async createCard(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!file) {
      throw new BadRequestException('Файл обов’язковий');
    }

    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const createCardDto = new CreateCardDto();
    Object.assign(createCardDto, parsedBody, { path: file.path.replace(/\\/g, '/') });

    return this.cardsService.createCard(createCardDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити картку за ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('path', multerOptions('cards')))
  async updateCard(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const updateCardDto: UpdateCardDto = { ...parsedBody, path: file ? file.path.replace(/\\/g, '/') : undefined };

    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити картку за ID' })
  async deleteCard(@Param('id', ParseIntPipe) id: number) {
    await this.cardsService.deleteCard(id);
    return { message: 'Картку успішно видалено' };
  }
}
