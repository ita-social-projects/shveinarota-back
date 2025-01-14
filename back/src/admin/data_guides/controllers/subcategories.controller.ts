import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubcategoriesService } from '../services/subcategories.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-dto/update-subcategory.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../common/multer-options';

@ApiTags('Subcategories')
@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @ApiOperation({ summary: 'Создание подкатегории с деталью' })
  @ApiResponse({ status: 201, description: 'Подкатегория успешно создана.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @Post(':categoryId/subcategories')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'lekala', maxCount: 10 },
        { name: 'example', maxCount: 10 },
      ],
      multerOptions('details'),
    ),
  )
  @UsePipes(ValidationPipe)
  async createSubcategoryWithDetail(
    @Param('categoryId') categoryId: number,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    const mapFilesToPaths = (files?: Express.Multer.File[]) =>
      files?.map((file) => file.path) || [];

    const detailDto = {
      title: createSubcategoryDto.title,
      lekala: mapFilesToPaths(files.lekala),
      example: mapFilesToPaths(files.example),
    };

    createSubcategoryDto.detail = detailDto;

    return this.subcategoriesService.createSubcategoryWithDetail(
      categoryId,
      createSubcategoryDto,
    );
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
