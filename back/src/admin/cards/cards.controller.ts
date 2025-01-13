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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@ApiTags('Cards') // Группировка эндпоинтов
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: 'Получить все карточки' })
  @ApiResponse({ status: 200, description: 'Список карточек.' })
  @Get()
  async getAllCards() {
    return this.cardsService.getAllCards();
  }

  @ApiOperation({ summary: 'Создать карточку' })
  @ApiConsumes('multipart/form-data') // Указывает, что используется загрузка файлов
  @ApiResponse({ status: 201, description: 'Карточка успешно создана.' })
  @Post()
  @UseInterceptors(FileInterceptor('path')) // Для загрузки файла
  async createCard(
    @Body() createCardDto: CreateCardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createCardDto.path = file.path.replace(/\\/g, '/'); // Универсальный вид пути
    } else {
      throw new BadRequestException('Файл изображения обязателен');
    }
    return this.cardsService.createCard(createCardDto);
  }

  @ApiOperation({ summary: 'Получить карточку по ID' })
  @ApiResponse({ status: 200, description: 'Карточка найдена.' })
  @ApiResponse({ status: 404, description: 'Карточка не найдена.' })
  @Get(':id')
  async getCardById(@Param('id') id: number) {
    return this.cardsService.getCardById(id);
  }

  @ApiOperation({ summary: 'Обновить карточку' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Карточка успешно обновлена.' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('path')) // Для загрузки файла
  async updateCard(
    @Param('id') id: number,
    @Body() updateCardDto: UpdateCardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateCardDto.path = file.path.replace(/\\/g, '/'); // Устанавливаем новый путь
    }
    const updatedCard = await this.cardsService.updateCard(id, updateCardDto);
    return {
      message: 'Card updated successfully',
      data: updatedCard,
    };
  }

  @ApiOperation({ summary: 'Удалить карточку' })
  @ApiResponse({ status: 200, description: 'Карточка успешно удалена.' })
  @Delete(':id')
  async deleteCard(@Param('id') id: number) {
    await this.cardsService.deleteCard(id);
    return { message: 'Card deleted successfully' };
  }
}
