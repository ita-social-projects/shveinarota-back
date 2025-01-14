import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubcategoriesService } from '../services/subcategories.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-dto/update-subcategory.dto';
import { SubcategoryResponseDto } from '../dto/response-dto/subcategory-response.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../common/multer-options';
import { CreateDetailDto } from '../dto/create-detail.dto';

@ApiTags('Subcategories')
@Controller('categories/:categoryId/subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @ApiOperation({ summary: 'Создание подкатегории с деталью' })
  @ApiResponse({ status: 201, description: 'Подкатегория успешно создана.', type: SubcategoryResponseDto })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'lekala', maxCount: 10 }, // Файлы лекал
        { name: 'example', maxCount: 10 }, // Примеры
      ],
      multerOptions('details'), // Папка для загрузки файлов
    ),
  )
  @UsePipes(ValidationPipe)
  async createSubcategoryWithDetail(
    @Param('categoryId') categoryId: number,
    @Body() body: Record<string, any>, // Данные из FormData
    @UploadedFiles() files: Record<string, Express.Multer.File[]>, // Файлы
  ): Promise<SubcategoryResponseDto> {
    try {
      // Преобразование данных для detail
      const createDetailDto: CreateDetailDto = {
        title: body.title,
        details: body.details,
        summary: body.summary,
        videoUrl: body.videoUrl,
        authors: body.authors ? JSON.parse(body.authors) : undefined,
        category: body.category,
        lekala: files.lekala?.map((file) => file.path) || [],
        example: files.example?.map((file) => file.path) || [],
      };

      // DTO для подкатегории
      const createSubcategoryDto: CreateSubcategoryDto = {
        subcategory_name: body.subcategory_name,
        detail: createDetailDto,
      };

      // Сохранение подкатегории через сервис
      const createdSubcategory = await this.subcategoriesService.createSubcategoryWithDetail(
        categoryId,
        createSubcategoryDto,
      );

      // Преобразование результата в DTO ответа
      return {
        id: createdSubcategory.id,
        subcategory_name: createdSubcategory.subcategory_name,
        detail: {
          title: createdSubcategory.detail.title,
          lekala: createdSubcategory.detail.lekala,
          example: createdSubcategory.detail.example,
          videoUrl: createdSubcategory.detail.videoUrl,
          details: createdSubcategory.detail.details,
          summary: createdSubcategory.detail.summary,
          authors: createdSubcategory.detail.authors,
          category: createdSubcategory.detail.category,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create subcategory: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Обновление подкатегории' })
  @ApiResponse({ status: 200, description: 'Подкатегория успешно обновлена.' })
  @ApiResponse({ status: 404, description: 'Подкатегория не найдена.' })
  @Put(':subcategoryId')
  @UsePipes(ValidationPipe)
  async updateSubcategory(
    @Param('subcategoryId') subcategoryId: number,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.updateSubcategory(
      subcategoryId,
      updateSubcategoryDto,
    );
  }

  @ApiOperation({ summary: 'Удаление подкатегории' })
  @ApiResponse({ status: 200, description: 'Подкатегория успешно удалена.' })
  @ApiResponse({ status: 404, description: 'Подкатегория не найдена.' })
  @Delete(':subcategoryId')
  async deleteSubcategoryById(@Param('subcategoryId') subcategoryId: number) {
    return this.subcategoriesService.deleteSubcategoryById(subcategoryId);
  }
}
