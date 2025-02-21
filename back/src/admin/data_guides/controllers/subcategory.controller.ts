import { 
  Controller, Post, Param, Req, Get, Put, Delete, BadRequestException, 
  NotFoundException, ParseIntPipe, Logger, UsePipes, ValidationPipe, Body,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { SubcategoryService } from '../services/subcategory.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update_dto/update-subcategory.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guard/JwtAuthGuard'; 

@ApiTags('Підкатегорії')
@Controller(':lang/subcategories')
export class SubcategoryController {
  private readonly logger = new Logger(SubcategoryController.name);

  constructor(private readonly subcategoryService: SubcategoryService) {}

  // =========== Get =========

  @Get(':subcategoryId')
  @ApiOperation({ summary: 'Отримання підкатегорії за ID' })
  @ApiParam({ name: 'lang', required: true, description: 'Мова запиту (uk або en)' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно отримано' })
  @ApiResponse({ status: 400, description: 'Помилка при отриманні підкатегорії' })
  @ApiResponse({ status: 404, description: 'Підкатегорія не знайдена' })
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

  @Get('all/:subcategoryId')
  @ApiOperation({ summary: 'Отримати детальну інформацію про підкатегорію' })
  @ApiParam({ name: 'subcategoryId', description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорія успішно отримана' })
  @ApiResponse({ status: 404, description: 'Підкатегорія не знайдена' })
  async getAllById(@Param('subcategoryId', ParseIntPipe) subcategoryId: number) {
    return this.subcategoryService.getAllById(subcategoryId);
  }

  // =========== Post =========

  @Post('category/:categoryId')
  @UseGuards(JwtAuthGuard) // Защищаем маршрут
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Створення нової підкатегорії' })
  @ApiParam({ name: 'categoryId', required: true, description: 'ID категорії' })
  @ApiResponse({ status: 201, description: 'Підкатегорію успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні підкатегорії' })
  @ApiBody({ type: CreateSubcategoryDto, description: 'Дані для створення підкатегорії' })
  async create(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() createSubcategoryDto: CreateSubcategoryDto
  ) {
    try {
      this.logger.log(`Створення підкатегорії для категорії ID: ${categoryId}`, JSON.stringify(createSubcategoryDto));
      return await this.subcategoryService.create(categoryId, createSubcategoryDto);
    } catch (error) {
      this.logger.error('Помилка при створенні підкатегорії', error);
      throw new BadRequestException('Не вдалося створити підкатегорію');
    }
  }

  // =========== Put =========

  @Put(':subcategoryId')
  @UseGuards(JwtAuthGuard) // Защищаем маршрут
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Оновлення існуючої підкатегорії' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні підкатегорії' })
  @ApiResponse({ status: 404, description: 'Підкатегорія не знайдена' })
  @ApiBody({ type: UpdateSubcategoryDto, description: 'Дані для оновлення підкатегорії' })
  async update(
    @Param('subcategoryId', ParseIntPipe) subcategoryId: number,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto
  ) {
    try {
      this.logger.log(`Оновлення підкатегорії ID: ${subcategoryId}`, JSON.stringify(updateSubcategoryDto));
      return await this.subcategoryService.update(subcategoryId, updateSubcategoryDto);
    } catch (error) {
      this.logger.error('Помилка при оновленні підкатегорії', error);
      throw new BadRequestException('Не вдалося оновити підкатегорію');
    }
  }

  // =========== Delete =========

  @Delete(':subcategoryId')
  @UseGuards(JwtAuthGuard) // Защищаем маршрут
  @ApiOperation({ summary: 'Видалення підкатегорії' })
  @ApiParam({ name: 'subcategoryId', required: true, description: 'ID підкатегорії' })
  @ApiResponse({ status: 200, description: 'Підкатегорію успішно видалено' })
  @ApiResponse({ status: 400, description: 'Помилка при видаленні підкатегорії' })
  @ApiResponse({ status: 404, description: 'Підкатегорія не знайдена' })
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
