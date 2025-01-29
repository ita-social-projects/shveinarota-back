import { 
  Controller, Post, Param, Req, Get, Put, Delete, BadRequestException, 
  NotFoundException, UseInterceptors 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { SubcategoryService } from '../services/subcategory.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update_dto/update-subcategory.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Підкатегорії') // Група в Swagger
@Controller('categories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @ApiOperation({ summary: 'Створення підкатегорії' })
  @ApiParam({ name: 'categoryId', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 201, description: 'Підкатегорію успішно створено', type: CreateSubcategoryDto })
  @ApiResponse({ status: 400, description: 'Помилка при створенні підкатегорії' })
  @Post(':categoryId/subcategories')
  @UseInterceptors(AnyFilesInterceptor()) 
  async create(@Param('categoryId') categoryId: number, @Req() req: Request) {
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
      console.error('Помилка при створенні підкатегорії:', error);
      throw new BadRequestException('Не вдалося створити підкатегорію');
    }
  }

  @ApiOperation({ summary: 'Отримання всіх підкатегорій за категорією' })
  @ApiParam({ name: 'categoryId', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 200, description: 'Список підкатегорій' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні підкатегорій' })
  @Get(':categoryId/subcategories')
  async getSubcategories(@Param('categoryId') categoryId: number) {
    try {
      const subcategories = await this.subcategoryService.getSubcategoriesByCategoryId(categoryId);
      return subcategories.map(subcat => ({
        id: subcat.id,
        subcategory: subcat.subcategory,
      }));
    } catch (error) {
      console.error('Помилка при отриманні підкатегорій:', error);
      throw new BadRequestException('Не вдалося отримати підкатегорії');
    }
  }

  @ApiOperation({ summary: 'Оновлення підкатегорії' })
  @ApiParam({ name: 'categoryId', required: true, description: 'ID категорії' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно оновлено', type: UpdateSubcategoryDto })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні підкатегорії' })
  @ApiResponse({ status: 404, description: 'Підкатегорію не знайдено' })
  @Put(':categoryId/subcategories/:subcategoryId')
  @UseInterceptors(AnyFilesInterceptor()) 
  async update(
    @Param('categoryId') categoryId: number,
    @Param('subcategoryId') subcategoryId: number,
    @Req() req: Request
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
      console.error('Помилка при оновленні підкатегорії:', error);
      throw new BadRequestException('Не вдалося оновити підкатегорію');
    }
  }

  @ApiOperation({ summary: 'Видалення підкатегорії' })
  @ApiParam({ name: 'categoryId', required: true, description: 'ID категорії' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно видалено' })
  @ApiResponse({ status: 400, description: 'Помилка при видаленні підкатегорії' })
  @ApiResponse({ status: 404, description: 'Підкатегорію не знайдено' })
  @Delete(':categoryId/subcategories/:subcategoryId')
  async delete(@Param('subcategoryId') subcategoryId: number) {
    try {
      await this.subcategoryService.delete(subcategoryId);
      return { message: `Підкатегорію з ID ${subcategoryId} успішно видалено.` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Помилка при видаленні підкатегорії:', error);
      throw new BadRequestException('Не вдалося видалити підкатегорію');
    }
  }
}
