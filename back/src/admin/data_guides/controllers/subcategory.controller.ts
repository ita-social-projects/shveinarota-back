import { 
  Controller, Post, Param, Req, Get, Put, Delete, BadRequestException, 
  NotFoundException, UseInterceptors, ParseIntPipe
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { SubcategoryService } from '../services/subcategory.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update_dto/update-subcategory.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Підкатегорії')
@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  /**
   * Утилита для безопасного парсинга JSON-строк
   */
  private parseJson(data: string | undefined, defaultValue: any) {
    if (!data) return defaultValue; 
    try {
      return JSON.parse(data.trim());
    } catch (error) {
      console.error(`Помилка парсингу JSON: ${data}`, error);
      return defaultValue;
    }
  }

  @ApiOperation({ summary: 'Створення підкатегорії' })
  @ApiParam({ name: 'categoryId', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 201, description: 'Підкатегорію успішно створено', type: CreateSubcategoryDto })
  @ApiResponse({ status: 400, description: 'Помилка при створенні підкатегорії' })
  @ApiBody({ type: CreateSubcategoryDto })
  @Post('category/:categoryId')
  @UseInterceptors(AnyFilesInterceptor()) 
  async create(@Param('categoryId', ParseIntPipe) categoryId: number, @Req() req: Request) {
    try {
      const createSubcategoryDto: CreateSubcategoryDto = {
        subcategory: req.body.subcategory,
        url: req.body.url,
        details: req.body.details,
        summary: req.body.summary,
        categoryname: req.body.categoryname || null,
        lekala: this.parseJson(req.body.lekala, []),  // Парсим JSON-строку в массив
        authors: this.parseJson(req.body.authors, []),
        example: this.parseJson(req.body.example, []),
      };

      return await this.subcategoryService.create(categoryId, createSubcategoryDto);
    } catch (error) {
      console.error('Помилка при створенні підкатегорії:', error);
      throw new BadRequestException('Не вдалося створити підкатегорію');
    }
  }

  @ApiOperation({ summary: 'Отримання всіх підкатегорій за категорією' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 200, description: 'Список підкатегорій' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні підкатегорій' })
  @Get(':subcategoryId')
  async getSubcategories(@Param('subcategoryId', ParseIntPipe) subcategoryId: number) {
    try {
      return await this.subcategoryService.getSubcategoryById(subcategoryId);
    } catch (error) {
      console.error('Помилка при отриманні підкатегорій:', error);
      throw new BadRequestException('Не вдалося отримати підкатегорії');
    }
  }

  @ApiOperation({ summary: 'Оновлення підкатегорії' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно оновлено', type: UpdateSubcategoryDto })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні підкатегорії' })
  @ApiResponse({ status: 404, description: 'Підкатегорію не знайдено' })
  @ApiBody({ type: UpdateSubcategoryDto })
  @Put(':subcategoryId')
  @UseInterceptors(AnyFilesInterceptor()) 
  async update(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('subcategoryId', ParseIntPipe) subcategoryId: number,
    @Req() req: Request
  ) {
    try {
      const updateSubcategoryDto: UpdateSubcategoryDto = {
        subcategory: req.body.subcategory || undefined,
        url: req.body.url || undefined,
        details: req.body.details || undefined,
        summary: req.body.summary || undefined,
        categoryname: req.body.categoryname || null,
        lekala: this.parseJson(req.body.lekala, []), // Парсим JSON-строку в массив
        authors: this.parseJson(req.body.authors, []),
        example: this.parseJson(req.body.example, []),
      };

      return await this.subcategoryService.update(subcategoryId, updateSubcategoryDto);
    } catch (error) {
      console.error('Помилка при оновленні підкатегорії:', error);
      throw new BadRequestException('Не вдалося оновити підкатегорію');
    }
  }

  @ApiOperation({ summary: 'Видалення підкатегорії' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно видалено' })
  @ApiResponse({ status: 400, description: 'Помилка при видаленні підкатегорії' })
  @ApiResponse({ status: 404, description: 'Підкатегорію не знайдено' })
  @Delete(':categoryId/subcategories/:subcategoryId')
  async delete(@Param('subcategoryId', ParseIntPipe) subcategoryId: number) {
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
