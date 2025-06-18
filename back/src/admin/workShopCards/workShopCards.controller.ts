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
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { WorkShopCardsService } from './workShopCards.service';
import { CreateWorkShopCardsDto } from './dto/create-workShopCards.dto';
import { UpdateWorkShopCardsDto } from './dto/update-workShopCards.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Картки Workshop')
@Controller(':lang/workshop-cards')
export class WorkShopCardsController {
  constructor(private readonly workShopCardsService: WorkShopCardsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі картки для вказаної мови' })
  @ApiParam({
    name: 'lang',
    required: true,
    description: 'Мова карток (en або uk)',
  })
  @ApiResponse({ status: 200, description: 'Список карток успішно отримано' })
  async getCards(@Param('lang') lang: string) {
    if (lang !== 'en' && lang !== 'uk') {
      throw new BadRequestException('Неправильний формат мови');
    }
    return lang === 'en'
      ? this.workShopCardsService.getEnCards()
      : this.workShopCardsService.getUkCards();
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі картки незалежно від мови' })
  @ApiResponse({ status: 200, description: 'Список всіх карток отримано' })
  async getAllCards() {
    return this.workShopCardsService.getAllCards();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати картку за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID картки' })
  @ApiResponse({ status: 200, description: 'Картка успішно отримана' })
  @ApiResponse({ status: 404, description: 'Картку не знайдено' })
  async getCardById(@Param('id', ParseIntPipe) id: number) {
    return this.workShopCardsService.getCardById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Створити нову картку' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Дані для створення картки',
    type: CreateWorkShopCardsDto,
  })
  @ApiResponse({ status: 201, description: 'Картку успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні картки' })
  @UseInterceptors(AnyFilesInterceptor())
  async createCard(@Body() body: any) {
    const payload = typeof body === 'string' ? JSON.parse(body) : body;
    const dto = new CreateWorkShopCardsDto();
    Object.assign(dto, payload);
    return this.workShopCardsService.createCard(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Оновити картку за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID картки' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Дані для оновлення картки',
    type: UpdateWorkShopCardsDto,
  })
  @ApiResponse({ status: 200, description: 'Картку успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні картки' })
  @ApiResponse({ status: 404, description: 'Картку не знайдено' })
  @UseInterceptors(AnyFilesInterceptor())
  async updateCard(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const payload = typeof body === 'string' ? JSON.parse(body) : body;
    const dto: UpdateWorkShopCardsDto = { ...payload };
    return this.workShopCardsService.updateCard(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Видалити картку за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID картки' })
  @ApiResponse({ status: 200, description: 'Картку успішно видалено' })
  @ApiResponse({ status: 404, description: 'Картку не знайдено' })
  async deleteCard(@Param('id', ParseIntPipe) id: number) {
    await this.workShopCardsService.deleteCard(id);
    return { message: 'Картку успішно видалено' };
  }
}
