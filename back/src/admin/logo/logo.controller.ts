import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { LogoService } from './logo.service';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { multerOptions } from '../../common/multer-options';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Логотипи')
@Controller(':lang/logos') // Добавлен параметр :lang, но он не используется
export class LogoController {
  constructor(private readonly logoService: LogoService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі логотипи' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiResponse({ status: 200, description: 'Логотипи успішно отримані' })
  async getAllLogos() {
    return this.logoService.getAllLogos(); // lang не передается
  }

  @Post()
  @ApiOperation({ summary: 'Створити новий логотип' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLogoDto })
  @ApiResponse({ status: 201, description: 'Логотип успішно створено' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'path1', maxCount: 1 },
    { name: 'path2', maxCount: 1 },
  ], multerOptions('logos')))
  async createLogo(
    @Body() createLogoDto: CreateLogoDto,
    @UploadedFiles() files: { path1?: Express.Multer.File[], path2?: Express.Multer.File[] },
  ) {
    if (files?.path1?.[0]) createLogoDto.path1 = files.path1[0].path.replace(/\\/g, '/');
    if (files?.path2?.[0]) createLogoDto.path2 = files.path2[0].path.replace(/\\/g, '/');

    return this.logoService.createLogo(createLogoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати логотип за ID' })
  @ApiParam({ name: 'id', description: 'ID логотипу', example: 1 })
  @ApiResponse({ status: 200, description: 'Логотип успішно отримано' })
  async getLogoById(@Param('id', ParseIntPipe) id: number) {
    return this.logoService.getLogoById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити логотип за ID' })
  @ApiParam({ name: 'id', description: 'ID логотипу', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateLogoDto })
  @ApiResponse({ status: 200, description: 'Логотип успішно оновлено' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'path1', maxCount: 1 },
    { name: 'path2', maxCount: 1 },
  ], multerOptions('logos')))
  async updateLogo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLogoDto: UpdateLogoDto,
    @UploadedFiles() files: { path1?: Express.Multer.File[], path2?: Express.Multer.File[] },
  ) {
    if (files?.path1?.[0]) updateLogoDto.path1 = files.path1[0].path.replace(/\\/g, '/');
    if (files?.path2?.[0]) updateLogoDto.path2 = files.path2[0].path.replace(/\\/g, '/');

    return this.logoService.updateLogo(id, updateLogoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити логотип за ID' })
  @ApiParam({ name: 'id', description: 'ID логотипу', example: 1 })
  @ApiResponse({ status: 200, description: 'Логотип успішно видалено' })
  async deleteLogo(@Param('id', ParseIntPipe) id: number) {
    await this.logoService.deleteLogo(id);
    return { message: 'Логотип успішно видалено' };
  }
}
