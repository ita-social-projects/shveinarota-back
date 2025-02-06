import { 
  Controller, Post, Param, Req, Get, Put, Delete, BadRequestException, 
  NotFoundException, UseInterceptors, ParseIntPipe, Logger, UsePipes, ValidationPipe
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { SubcategoryService } from '../services/subcategory.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update_dto/update-subcategory.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Підкатегорії')
@Controller(':lang/subcategories')
export class SubcategoryController {
  private readonly logger = new Logger(SubcategoryController.name);

  constructor(private readonly subcategoryService: SubcategoryService) {}

  // ===========Get=========

  @Get(':subcategoryId')
  @ApiOperation({ summary: 'Отримання підкатегорії' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно отримано' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні підкатегорії' })
  async getSubcategory(
    @Param('lang') lang: string,
    @Param('subcategoryId', ParseIntPipe) subcategoryId: number
  ) {
    try {
      this.logger.log(`Отримання підкатегорії ID: ${subcategoryId} для мови: ${lang}`);
      if (lang === 'uk') {
        return await this.subcategoryService.getUkSubcategoryById(subcategoryId);
      } else if (lang === 'en') {
        return await this.subcategoryService.getEnSubcategoryById(subcategoryId);
      } else {
        throw new BadRequestException('Непідтримувана мова. Використовуйте "uk" або "en".');
      }
    } catch (error) {
      this.logger.error('Помилка при отриманні підкатегорії', error);
      throw new BadRequestException('Не вдалося отримати підкатегорію');
    }
  }

  //===================Post========================

  @Post('category/:categoryId')
  @UseInterceptors(AnyFilesInterceptor()) 
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Створення підкатегорії' })
  @ApiResponse({ status: 201, description: 'Підкатегорію успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні підкатегорії' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Форма для створення підкатегорії', type: CreateSubcategoryDto })
  async create(@Param('categoryId', ParseIntPipe) categoryId: number, @Req() req: Request) {
    try {
      this.logger.log(`Створення підкатегорії для категорії ID: ${categoryId}`, JSON.stringify(req.body));
      const createSubcategoryDto: CreateSubcategoryDto = req.body;
      return await this.subcategoryService.create(categoryId, createSubcategoryDto);
    } catch (error) {
      this.logger.error('Помилка при створенні підкатегорії', error);
      throw new BadRequestException('Не вдалося створити підкатегорію');
    }
  }

  @Put(':subcategoryId')
  @UseInterceptors(AnyFilesInterceptor()) 
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Оновлення підкатегорії' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні підкатегорії' })
  async update(
    @Param('subcategoryId', ParseIntPipe) subcategoryId: number,
    @Req() req: Request
  ) {
    try {
      this.logger.log(`Оновлення підкатегорії ID: ${subcategoryId}`, JSON.stringify(req.body));
      const updateSubcategoryDto: UpdateSubcategoryDto = req.body;
      return await this.subcategoryService.update(subcategoryId, updateSubcategoryDto);
    } catch (error) {
      this.logger.error('Помилка при оновленні підкатегорії', error);
      throw new BadRequestException('Не вдалося оновити підкатегорію');
    }
  }

  //===================Delete========================

  @Delete(':subcategoryId')
  @ApiOperation({ summary: 'Видалення підкатегорії' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно видалено' })
  @ApiResponse({ status: 400, description: 'Помилка при видаленні підкатегорії' })
  async delete(@Param('subcategoryId', ParseIntPipe) subcategoryId: number) {
    try {
      this.logger.log(`Видалення підкатегорії ID: ${subcategoryId}`);
      await this.subcategoryService.delete(subcategoryId);
      return { message: `Підкатегорію з ID ${subcategoryId} успішно видалено.` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Підкатегорію з ID ${subcategoryId} не знайдено`);
        throw error;
      }
      this.logger.error('Помилка при видаленні підкатегорії', error);
      throw new BadRequestException('Не вдалося видалити підкатегорію');
    }
  }
}
