import { Controller, Post, Put, UseInterceptors, Req, Get, Param, BadRequestException, NotFoundException, Delete } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update_dto/update-category.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Категорії') // Назва групи в Swagger
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * @swagger
   * @summary Створення нової категорії
   * @description Додає нову категорію. Дані передаються у форматі `form-data`.
   * @returns Повертає створену категорію.
   */
  @ApiOperation({ summary: 'Створення категорії' })
  @ApiResponse({ status: 201, description: 'Категорію успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні категорії' })
  @Post()
  @UseInterceptors(AnyFilesInterceptor()) // Обробка form-data
  async create(@Req() req: Request) {
    try {
      const createCategoryDto: CreateCategoryDto = {
        category: req.body.category, // Отримуємо значення з form-data
      };

      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      console.error('Помилка при створенні категорії:', error);
      throw new BadRequestException('Не вдалося створити категорію.');
    }
  }

  /**
   * @swagger
   * @summary Отримання всієї структури категорій
   * @returns Повертає всі категорії та їх підкатегорії.
   */
  @ApiOperation({ summary: 'Отримання всієї структури категорій' })
  @ApiResponse({ status: 200, description: 'Структуру успішно отримано' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні структури' })
  @Get('getallstructure')
  async getAllStructure() {
    try {
      return await this.categoryService.getAllStructure(); // Викликаємо метод сервісу
    } catch (error) {
      console.error('Помилка при отриманні структури:', error);
      throw new BadRequestException('Не вдалося отримати структуру.');
    }
  }

  /**
   * @swagger
   * @summary Отримання лише списку категорій
   * @returns Повертає масив категорій.
   */
  @ApiOperation({ summary: 'Отримання лише категорій' })
  @ApiResponse({ status: 200, description: 'Категорії успішно отримані' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні категорій' })
  @Get()
  async getCategoriesOnly() {
    try {
      return await this.categoryService.getCategoriesOnly();
    } catch (error) {
      console.error('Помилка при отриманні категорій:', error);
      throw new BadRequestException('Не вдалося отримати категорії.');
    }
  }

  /**
   * @swagger
   * @summary Оновлення категорії за ID
   * @description Оновлює назву категорії (`category`) за її ідентифікатором. Дані передаються у форматі `form-data`.
   * @param id Ідентифікатор категорії (ID), що оновлюється.
   * @returns Повертає оновлену категорію.
   */
  @ApiOperation({ summary: 'Оновлення категорії' })
  @ApiParam({ name: 'id', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 200, description: 'Категорію успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні категорії' })
  @ApiResponse({ status: 404, description: 'Категорію не знайдено' })
  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor()) // Обробка form-data
  async updateCategory(@Param('id') id: number, @Req() req: Request) {
    try {
      const updateCategoryDto: UpdateCategoryDto = {
        category: req.body.category, // Отримуємо значення з form-data
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

    /**
   * @swagger
   * @summary Видалення категорії за ID
   * @description Видаляє категорію за її ідентифікатором.
   * @param id Ідентифікатор категорії (ID), що видаляється.
   * @returns Повідомлення про успішне видалення.
   */
    @ApiOperation({ summary: 'Видалення категорії' })
    @ApiParam({ name: 'id', required: true, description: 'ID категорії' })
    @ApiResponse({ status: 200, description: 'Категорію успішно видалено' })
    @ApiResponse({ status: 400, description: 'Помилка при видаленні категорії' })
    @ApiResponse({ status: 404, description: 'Категорію не знайдено' })
    @Delete(':id')
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
