import {
  Controller,
  Post,
  Put,
  UseInterceptors,
  Req,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  Delete,
  Body,
  Logger,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update_dto/update-category.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Категорії') // Група в Swagger
@Controller(':lang/categories')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  //================GET requests==============
  @Get('allstruct')
  @ApiOperation({ summary: 'Отримання всієї структури категорій' })
  @ApiResponse({ status: 200, description: 'Структуру успішно отримано' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні структури' })
  async getAllStructure() {
    try {
      this.logger.log('Отримання всієї структури категорій');
      return await this.categoryService.getAllStructure();
    } catch (error) {
      this.logger.error('Помилка при отриманні структури', error);
      throw new BadRequestException('Не вдалося отримати структуру.');
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримання лише категорій' })
  @ApiResponse({ status: 200, description: 'Категорії успішно отримані' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні категорій' })
  async getCategoriesOnly() {
    try {
      this.logger.log('Отримання категорій');
      return await this.categoryService.getCategoriesOnly();
    } catch (error) {
      this.logger.error('Помилка при отриманні категорій', error);
      throw new BadRequestException('Не вдалося отримати категорії.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі маркери для вказаної мови' })
  async getMarkers(@Param('lang') lang: string) {
    this.logger.log(`Отримання категорій для мови: ${lang}`);
    return lang === 'en' ? this.categoryService.getCategoriesEn() : this.categoryService.getCategoriesUk();
  }

  //===============POST requests==============
  @Post()
  @UseInterceptors(AnyFilesInterceptor()) // Обробка form-data
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Створення категорії' })
  @ApiResponse({ status: 201, description: 'Категорію успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні категорії' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Форма для створення категорії', type: CreateCategoryDto })
  async create(@Req() req: Request) {
    try {
      this.logger.log('Запит на створення категорії', JSON.stringify(req.body));
      const createCategoryDto: CreateCategoryDto = req.body;
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      this.logger.error('Помилка при створенні категорії', error);
      throw new BadRequestException('Не вдалося створити категорію.');
    }
  }

  //======================PUT requests=======================
  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Оновлення категорії' })
  @ApiParam({ name: 'id', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 200, description: 'Категорію успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні категорії' })
  @ApiResponse({ status: 404, description: 'Категорію не знайдено' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Форма для оновлення категорії', type: UpdateCategoryDto })
  async updateCategory(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      this.logger.log(`Оновлення категорії з ID: ${id}`, JSON.stringify(req.body));
      const updateCategoryDto: UpdateCategoryDto = req.body;
      return await this.categoryService.updateCategory(id, updateCategoryDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Категорію з ID ${id} не знайдено`);
        throw error;
      }
      this.logger.error('Помилка при оновленні категорії', error);
      throw new BadRequestException('Не вдалося оновити категорію.');
    }
  }

  //====================DELETE requests=======================
  @Delete(':id')
  @ApiOperation({ summary: 'Видалення категорії' })
  @ApiParam({ name: 'id', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 200, description: 'Категорію успішно видалено' })
  @ApiResponse({ status: 400, description: 'Помилка при видаленні категорії' })
  @ApiResponse({ status: 404, description: 'Категорію не знайдено' })
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    try {
      this.logger.log(`Видалення категорії з ID: ${id}`);
      return await this.categoryService.deleteCategory(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Категорію з ID ${id} не знайдено`);
        throw error;
      }
      this.logger.error('Помилка при видаленні категорії', error);
      throw new BadRequestException('Не вдалося видалити категорію.');
    }
  }
}
