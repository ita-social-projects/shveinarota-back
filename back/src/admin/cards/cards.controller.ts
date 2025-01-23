import { 
  Controller, Get, Post, Put, Param, Body, Delete, 
  BadRequestException, NotFoundException, UseInterceptors, UploadedFile, 
  ParseIntPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все карточки' })
  @ApiResponse({ status: 200, description: 'Карточки успешно получены' })
  async getAllCards() {
    return this.cardsService.getAllCards();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image')) // Обработка файлов
  @ApiOperation({ summary: 'Создать новую карточку' })
  @ApiResponse({ status: 201, description: 'Карточка успешно создана' })
  async createCard(
    @Body() createCardDto: CreateCardDto, 
    @UploadedFile() image?: Express.Multer.File
  ) {
    if (!createCardDto.path && !image) {
      throw new BadRequestException('Ссылка на изображение обязательна');
    }

    // Если файл загружен, сохраняем его путь в DTO
    if (image) {
      createCardDto.path = image.path; // Если храните файлы локально
      // createCardDto.path = `https://your-storage.com/${image.filename}`; // Если храните в облаке
    }

    return this.cardsService.createCard(createCardDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно получена' })
  async getCardById(@Param('id', ParseIntPipe) id: number) {
    return this.cardsService.getCardById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно обновлена' })
  async updateCard(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCardDto: UpdateCardDto
  ) {
    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно удалена' })
  async deleteCard(@Param('id', ParseIntPipe) id: number) {
    await this.cardsService.deleteCard(id);
    return { message: 'Карточка успешно удалена' };
  }
}
