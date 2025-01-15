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
import { multerOptions } from '../../common/multer-options';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Cards') // Группировка эндпоинтов в Swagger
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
  @ApiOperation({ summary: 'Создать новую карточку' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({ status: 201, description: 'Карточка успешно создана' })
  @UseInterceptors(FileInterceptor('path', multerOptions('cards')))
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

  @Get(':id')
  @ApiOperation({ summary: 'Получить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно получена' })
  async getCardById(@Param('id') id: number) {
    return this.cardsService.getCardById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCardDto })
  @ApiResponse({ status: 200, description: 'Карточка успешно обновлена' })
  @UseInterceptors(FileInterceptor('path', multerOptions('cards')))
  async updateCard(
    @Param('id') id: number,
    @Body() updateCardDto: UpdateCardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateCardDto.path = file.path.replace(/\\/g, '/'); // Универсальный вид пути
    }
    const updatedCard = await this.cardsService.updateCard(id, updateCardDto);
    return {
      message: 'Карточка успешно обновлена',
      data: updatedCard,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно удалена' })
  async deleteCard(@Param('id') id: number) {
    await this.cardsService.deleteCard(id);
    return { message: 'Карточка успешно удалена' };
  }
}
