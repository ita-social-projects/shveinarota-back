import {
  Controller,
  Put,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../common/multer-options';
import { DetailsService } from '../services/details.service';
import { UpdateDetailDto } from '../dto/update-dto/update-detail.dto';

@ApiTags('Details')
@Controller('categories/:categoryId/subcategory/:subcategoryId/detail')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @ApiOperation({ summary: 'Обновление детали' })
  @ApiResponse({ status: 200, description: 'Деталь успешно обновлена.' })
  @ApiResponse({ status: 404, description: 'Деталь не найдена.' })
  @ApiConsumes('multipart/form-data')
  @Put(':detailId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'lekala', maxCount: 10 }, // Лекала
        { name: 'example', maxCount: 10 }, // Примеры
      ],
      multerOptions('details'),
    ),
  )
  async updateDetail(
    @Param('categoryId') categoryId: number,
    @Param('subcategoryId') subcategoryId: number,
    @Param('detailId') detailId: number,
    @Body(ValidationPipe) body: Record<string, any>,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    const updateDetailDto: UpdateDetailDto = {
      title: body.title,
      details: body.details,
      summary: body.summary,
      videoUrl: body.videoUrl,
      authors: body.authors ? JSON.parse(body.authors) : undefined,
      category: body.category,
      // Добавление новых файлов или сохранение старых, если не переданы новые
      lekala: files.lekala?.map((file) => file.path) || null,
      example: files.example?.map((file) => file.path) || null,
    };

    return this.detailsService.updateDetail(
      categoryId,
      subcategoryId,
      detailId,
      updateDetailDto,
    );
  }
}
