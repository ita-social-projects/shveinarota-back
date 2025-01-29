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
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor()) // Обробка form-data
  @ApiOperation({ summary: 'Створення категорії' })
  @ApiResponse({ status: 201, description: 'Категорію успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні категорії' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Форма для створення категорії', type: CreateCategoryDto })
  async create(@Req() req: Request) {
    try {
      const createCategoryDto: CreateCategoryDto = {
        category: req.body.category,
      };

      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      console.error('Помилка при створенні категорії:', error);
      throw new BadRequestException('Не вдалося створити категорію.');
    }
  }

  @Get('getallstructure')
  @ApiOperation({ summary: 'Отримання всієї структури категорій' })
  @ApiResponse({ status: 200, description: 'Структуру успішно отримано' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні структури' })
  async getAllStructure() {
    try {
      return await this.categoryService.getAllStructure();
    } catch (error) {
      console.error('Помилка при отриманні структури:', error);
      throw new BadRequestException('Не вдалося отримати структуру.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Отримання лише категорій' })
  @ApiResponse({ status: 200, description: 'Категорії успішно отримані' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні категорій' })
  async getCategoriesOnly() {
    try {
      return await this.categoryService.getCategoriesOnly();
    } catch (error) {
      console.error('Помилка при отриманні категорій:', error);
      throw new BadRequestException('Не вдалося отримати категорії.');
    }
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor()) // Обробка form-data
  @ApiOperation({ summary: 'Оновлення категорії' })
  @ApiParam({ name: 'id', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 200, description: 'Категорію успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні категорії' })
  @ApiResponse({ status: 404, description: 'Категорію не знайдено' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Форма для оновлення категорії', type: UpdateCategoryDto })
  async updateCategory(@Param('id') id: number, @Req() req: Request) {
    try {
      const updateCategoryDto: UpdateCategoryDto = {
        category: req.body.category,
      };

      return await this.categoryService.updateCategory(id, updateCategoryDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Помилка при оновленні категорії:', error);
      throw new BadRequestException('Не вдалося оновити категорію.');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалення категорії' })
  @ApiParam({ name: 'id', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 200, description: 'Категорію успішно видалено' })
  @ApiResponse({ status: 400, description: 'Помилка при видаленні категорії' })
  @ApiResponse({ status: 404, description: 'Категорію не знайдено' })
  async deleteCategory(@Param('id') id: number) {
    try {
      return await this.categoryService.deleteCategory(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Помилка при видаленні категорії:', error);
      throw new BadRequestException('Не вдалося видалити категорію.');
    }
  }
}
