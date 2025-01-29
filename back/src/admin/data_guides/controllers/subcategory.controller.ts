import { Controller, Post, Param, Req, Get, Put, Delete, BadRequestException, NotFoundException, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { SubcategoryService } from '../services/subcategory.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update_dto/update-subcategory.dto';

@Controller('categories') // Контроллер для работы с категориями
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  // Создание подкатегории
  @Post(':categoryId/subcategories')
  @UseInterceptors(AnyFilesInterceptor()) // Обработка form-data
  async create(
    @Param('categoryId') categoryId: number,
    @Req() req: Request,
  ) {
    try {
      const parseJson = (data: string, defaultValue: any) => {
        try {
          return JSON.parse(data.trim());
        } catch {
          return defaultValue;
        }
      };

      const createSubcategoryDto: CreateSubcategoryDto = {
        subcategory: req.body.subcategory,
        url: req.body.url,
        details: req.body.details,
        summary: req.body.summary,
        categoryId: categoryId,
        categoryname: req.body.categoryname || null,
        lekala: parseJson(req.body.lekala, []),
        authors: parseJson(req.body.authors, []),
        example: parseJson(req.body.example, []),
      };

      return await this.subcategoryService.create(createSubcategoryDto);
    } catch (error) {
      console.error('Ошибка при создании подкатегории:', error);
      throw new BadRequestException('Не удалось создать подкатегорию');
    }
  }

  // Получение всех подкатегорий по ID категории
  @Get(':categoryId/subcategories')
  async getSubcategories(@Param('categoryId') categoryId: number) {
    try {
      const subcategories = await this.subcategoryService.getSubcategoriesByCategoryId(categoryId);
      return subcategories.map(subcat => ({
        id: subcat.id,
        subcategory: subcat.subcategory,
      }));
    } catch (error) {
      console.error('Ошибка при получении подкатегорий:', error);
      throw new BadRequestException('Не удалось получить подкатегории');
    }
  }

  // Обновление подкатегории
  @Put(':categoryId/subcategories/:subcategoryId')
  @UseInterceptors(AnyFilesInterceptor()) // Обработка form-data
  async update(
    @Param('categoryId') categoryId: number,
    @Param('subcategoryId') subcategoryId: number,
    @Req() req: Request,
  ) {
    try {
      const parseJson = (data: string, defaultValue: any) => {
        try {
          return JSON.parse(data.trim());
        } catch {
          return defaultValue;
        }
      };

      const updateSubcategoryDto: UpdateSubcategoryDto = {
        subcategory: req.body.subcategory,
        url: req.body.url,
        details: req.body.details,
        summary: req.body.summary,
        categoryId: categoryId,
        categoryname: req.body.categoryname || null,
        lekala: parseJson(req.body.lekala, []),
        authors: parseJson(req.body.authors, []),
        example: parseJson(req.body.example, []),
      };

      return await this.subcategoryService.update(subcategoryId, updateSubcategoryDto);
    } catch (error) {
      console.error('Ошибка при обновлении подкатегории:', error);
      throw new BadRequestException('Не удалось обновить подкатегорию');
    }
  }

  // Удаление подкатегории
  @Delete(':categoryId/subcategories/:subcategoryId')
  async delete(@Param('subcategoryId') subcategoryId: number) {
    try {
      await this.subcategoryService.delete(subcategoryId);
      return { message: `Подкатегория с ID ${subcategoryId} успешно удалена.` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Ошибка при удалении подкатегории:', error);
      throw new BadRequestException('Не удалось удалить подкатегорию');
    }
  }
}
