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
  ParseIntPipe,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Создать новую карточку' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        path: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Карточка успешно создана' })
  @UseInterceptors(FileInterceptor('path', multerOptions('cards')))
  async createCard(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any, // Используем `any`, чтобы проверить данные
  ) {
    if (!file) {
      throw new BadRequestException('Файл изображения обязателен');
    }


    const createCardDto: CreateCardDto = {
      ...body,
      path: file.path.replace(/\\/g, '/'), // Приведение пути к универсальному виду
    };

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        path: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Карточка успешно обновлена' })
  @UseInterceptors(FileInterceptor('path', multerOptions('cards')))
  async updateCard(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    console.log('Обновление карточки, входные данные:', body);

    const updateCardDto: UpdateCardDto = {
      ...body,
      path: file ? file.path.replace(/\\/g, '/') : undefined,
    };

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
  async deleteCard(@Param('id', ParseIntPipe) id: number) {
    await this.cardsService.deleteCard(id);
    return { message: 'Карточка успешно удалена' };
  }
}
