import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Создание категории' })
  @ApiResponse({ status: 201, description: 'Категория успешно создана.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }
 
  // Получение всех категорий
  @ApiOperation({ summary: 'Получение всех категорий' })
  @ApiResponse({ status: 200, description: 'Список всех категорий.' })
  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  // Обновление только имени категории
  @ApiOperation({ summary: 'Обновление имени категории' })
  @ApiResponse({ status: 200, description: 'Имя категории успешно обновлено.' })
  @ApiResponse({ status: 404, description: 'Категория не найдена.' })
  @Put(':categoryId/name')
  async updateCategoryName(
    @Param('categoryId') categoryId: number,
    @Body('category_name') categoryName: string,
  ) {
    return this.categoriesService.updateCategoryName(categoryId, categoryName);
  }

  // Удаление категории
  @ApiOperation({ summary: 'Удаление категории' })
  @ApiResponse({ status: 200, description: 'Категория успешно удалена.' })
  @ApiResponse({ status: 404, description: 'Категория не найдена.' })
  @Delete(':categoryId')
  async deleteCategoryById(@Param('categoryId') categoryId: number) {
    return this.categoriesService.deleteCategoryById(categoryId);
  }

  // Получить подкатегорию с деталью по ID
  @ApiOperation({ summary: 'Получить подкатегорию с деталью по ID' })
  @ApiResponse({ status: 200, description: 'Подкатегория успешно найдена.' })
  @ApiResponse({ status: 404, description: 'Подкатегория или категория не найдена.' })
  @Get(':categoryId/subcategory/:subcategoryId')
  async getSubcategoryWithDetail(
    @Param('categoryId') categoryId: number,
    @Param('subcategoryId') subcategoryId: number,
  ) {
    return this.categoriesService.getSubcategoryWithDetail(categoryId, subcategoryId);
  }
}