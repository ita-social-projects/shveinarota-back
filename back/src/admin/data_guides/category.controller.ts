import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateDetailDto } from './dto/create-detail.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Создание категории
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // Получение всех категорий
  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  // Создание детали для подкатегории
  @Post(':categoryId/subcategory/:subcategoryId/detail')
  async createDetail(
    @Param('subcategoryId') subcategoryId: number,
    @Body() createDetailDto: CreateDetailDto,
  ) {
    return this.categoriesService.createDetail(subcategoryId, createDetailDto);
  }

  // Получение детали по ID подкатегории
  @Get(':categoryId/subcategory/:subcategoryId')
  async getDetailBySubcategoryId(@Param('subcategoryId') subcategoryId: number) {
    return this.categoriesService.getDetailBySubcategoryId(subcategoryId);
  }

  // Удаление категории по ID
  @Delete(':categoryId')
  async deleteCategoryById(@Param('categoryId') categoryId: number) {
    return this.categoriesService.deleteCategoryById(categoryId);
  }

  // Удаление подкатегории по ID
  @Delete(':categoryId/subcategory/:subcategoryId')
  async deleteSubcategoryById(@Param('subcategoryId') subcategoryId: number) {
    return this.categoriesService.deleteSubcategoryById(subcategoryId);
  }

  // Удаление детали по ID подкатегории
  @Delete(':categoryId/subcategory/:subcategoryId/detail')
  async deleteDetailBySubcategoryId(@Param('subcategoryId') subcategoryId: number) {
    return this.categoriesService.deleteDetailBySubcategoryId(subcategoryId);
  }
}
