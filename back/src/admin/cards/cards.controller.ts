import { 
  Controller, Get, Post, Put, Param, Body, Delete, 
  BadRequestException, NotFoundException, UseInterceptors, 
  ParseIntPipe 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Карточки')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі картки' })
  @ApiResponse({ status: 200, description: 'Картки успішно отримані' })
  async getAllCards() {
    return this.cardsService.getAllCards();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати картку за ID' })
  @ApiParam({ name: 'id', description: 'ID картки', example: 1 })
  @ApiResponse({ status: 200, description: 'Картка успішно отримана' })
  async getCardById(@Param('id', ParseIntPipe) id: number) {
    return this.cardsService.getCardById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити нову картку' })
  @ApiResponse({ status: 201, description: 'Картка успішно створена' })
  @UseInterceptors(AnyFilesInterceptor())
  async createCard(@Body() createCardDto: CreateCardDto) {
    if (typeof createCardDto === 'string') {
      try {
        createCardDto = JSON.parse(createCardDto);
      } catch (error) {
        throw new BadRequestException('Невірний формат даних');
      }
    }
    return this.cardsService.createCard(createCardDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити картку за ID' })
  @ApiParam({ name: 'id', description: 'ID картки', example: 1 })
  @ApiResponse({ status: 200, description: 'Картка успішно оновлена' })
  @UseInterceptors(AnyFilesInterceptor())
  async updateCard(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto
  ) {
    if (typeof updateCardDto === 'string') {
      try {
        updateCardDto = JSON.parse(updateCardDto);
      } catch (error) {
        throw new BadRequestException('Невірний формат даних');
      }
    }
    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити картку за ID' })
  @ApiParam({ name: 'id', description: 'ID картки', example: 1 })
  @ApiResponse({ status: 200, description: 'Картка успішно видалена' })
  async deleteCard(@Param('id', ParseIntPipe) id: number) {
    await this.cardsService.deleteCard(id);
    return { message: 'Картка успішно видалена' };
  }
}
