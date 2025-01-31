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

  private parseJson<T>(data: any, defaultValue: T): T {
    if (!data) return defaultValue;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data.trim());
      } catch (error) {
        console.error(`Помилка парсингу JSON: ${data}`, error);
        return defaultValue;
      }
    }
    return Array.isArray(data) || typeof data === 'object' ? data : defaultValue;
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
      const lekala = this.parseJson(req.body.lekala, []).filter((item: any) => item.path && item.text);
      
      const createSubcategoryDto: CreateSubcategoryDto = {
        subcategory: req.body.subcategory,
        url: req.body.url,
        details: req.body.details,
        summary: req.body.summary,
        categoryname: req.body.categoryname || null,
        lekala,
        authors: this.parseJson(req.body.authors, []),
        example: this.parseJson(req.body.example, []),
      };

      return await this.subcategoryService.create(categoryId, createSubcategoryDto);
    } catch (error) {
      console.error('Помилка при створенні підкатегорії:', error);
      throw new BadRequestException('Не вдалося створити підкатегорію');
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
    @Param('subcategoryId', ParseIntPipe) subcategoryId: number,
    @Req() req: Request
  ) {
    try {
      const lekala = this.parseJson(req.body.lekala, []).filter((item: any) => item.path && item.text);
      
      const updateSubcategoryDto: UpdateSubcategoryDto = {
        subcategory: req.body.subcategory || undefined,
        url: req.body.url || undefined,
        details: req.body.details || undefined,
        summary: req.body.summary || undefined,
        categoryname: req.body.categoryname || null,
        lekala,
        authors: this.parseJson(req.body.authors, []),
        example: this.parseJson(req.body.example, []),
      };

      return await this.subcategoryService.update(subcategoryId, updateSubcategoryDto);
    } catch (error) {
      console.error('Помилка при оновленні підкатегорії:', error);
      throw new BadRequestException('Не вдалося оновити підкатегорію');
    }
  }
}
