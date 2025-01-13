import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateDetailDto } from './dto/create-detail.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';

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

  // Создание подкатегории с деталью
  @Post(':categoryId/subcategory')
  async createSubcategoryWithDetail(
    @Param('categoryId') categoryId: number,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ) {
    return this.categoriesService.createSubcategoryWithDetail(
      categoryId,
      createSubcategoryDto,
    );
  }

  // Создание детали с загрузкой файлов (включая example)
  @Post(':categoryId/subcategory/:subcategoryId/detail')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'lekala', maxCount: 10 }, // Поле 'lekala' для массива файлов
        { name: 'authors', maxCount: 10 }, // Поле 'authors' для массива файлов
        { name: 'example', maxCount: 10 }, // Поле 'example' для массива файлов
      ],
      multerOptions('details'), // Ваши настройки для загрузки файлов
    ),
  )
  async createDetail(
    @Param('subcategoryId') subcategoryId: number,
    @Body() createDetailDto: CreateDetailDto,
    @UploadedFiles()
    files: {
      lekala?: Express.Multer.File[];
      authors?: Express.Multer.File[];
      example?: Express.Multer.File[];
    },
  ) {
    // Обработка загруженных файлов
    const lekalaPaths = files.lekala?.map((file) => file.path) || [];
    const authorsPaths = files.authors?.map((file) => file.path) || [];
    const examplePaths = files.example?.map((file) => file.path) || [];

    // Добавляем пути к файлам в DTO
    createDetailDto.lekala = lekalaPaths;
    createDetailDto.authors = authorsPaths;
    createDetailDto.example = examplePaths;

    // Сохраняем данные через сервис
    return this.categoriesService.createDetail(subcategoryId, createDetailDto);
  }

  // Получение детали по ID подкатегории
  @Get(':categoryId/subcategory/:subcategoryId')
  async getDetailBySubcategoryId(@Param('subcategoryId') subcategoryId: number) {
    return this.categoriesService.getDetailBySubcategoryId(subcategoryId);
  }

  // Удаление категории
  @Delete(':categoryId')
  async deleteCategoryById(@Param('categoryId') categoryId: number) {
    return this.categoriesService.deleteCategoryById(categoryId);
  }

  // Удаление подкатегории
  @Delete(':categoryId/subcategory/:subcategoryId')
  async deleteSubcategoryById(@Param('subcategoryId') subcategoryId: number) {
    return this.categoriesService.deleteSubcategoryById(subcategoryId);
  }

  // Удаление детали
  @Delete(':categoryId/subcategory/:subcategoryId/detail')
  async deleteDetailBySubcategoryId(@Param('subcategoryId') subcategoryId: number) {
    return this.categoriesService.deleteDetailBySubcategoryId(subcategoryId);
  }
}
