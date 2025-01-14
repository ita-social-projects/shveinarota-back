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
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Создание категории' })
  @ApiResponse({ status: 201, description: 'Категория успешно создана.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(file);
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: 'Получение всех категорий' })
  @ApiResponse({ status: 200, description: 'Список всех категорий.' })
  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }


  @ApiOperation({ summary: 'Удаление категории' })
  @ApiResponse({ status: 200, description: 'Категория успешно удалена.' })
  @ApiResponse({ status: 404, description: 'Категория не найдена.' })
  @Delete(':categoryId')
  async deleteCategoryById(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.deleteCategoryById(categoryId);
  }

  @ApiOperation({ summary: 'Получение подкатегории с деталью по ID' })
  @ApiResponse({ status: 200, description: 'Подкатегория успешно найдена.' })
  @ApiResponse({ status: 404, description: 'Подкатегория или категория не найдена.' })
  @Get(':categoryId/subcategory/:subcategoryId')
  async getSubcategoryWithDetail(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('subcategoryId', ParseIntPipe) subcategoryId: number,
  ) {
    return this.categoriesService.getSubcategoryWithDetail(categoryId, subcategoryId);
  }
}
