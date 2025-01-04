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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-options';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async getAllCards() {
    return this.cardsService.getAllCards();
  }

  @Post()
  @UseInterceptors(FileInterceptor('path', multerOptions))
  async createCard(
    @Body() createCardDto: CreateCardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createCardDto.path = file.path.replace(/\\/g, '/'); // Приводим путь к универсальному виду
    } else {
      throw new BadRequestException('Файл изображения обязателен');
    }
    return this.cardsService.createCard(createCardDto);
  }

  @Get(':id')
  async getCardById(@Param('id') id: number) {
    return this.cardsService.getCardById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('path', multerOptions))
  async updateCard(
    @Param('id') id: number,
    @Body() updateCardDto: UpdateCardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateCardDto.path = file.path.replace(/\\/g, '/'); // Устанавливаем новый путь к картинке
    }

    const updatedCard = await this.cardsService.updateCard(id, updateCardDto);

    // Явно формируем ответ
    return {
      message: 'Card updated successfully',
      data: updatedCard,
    };
  }


  @Delete(':id')
  async deleteCard(@Param('id') id: number) {
    await this.cardsService.deleteCard(id);
    return { message: 'Card deleted successfully' };
  }
}
