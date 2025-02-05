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

@ApiTags('Logos')
@Controller('logos')
export class LogoController {
  constructor(private readonly logoService: LogoService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все лого' })
  @ApiResponse({ status: 200, description: 'Лого успешно получены' })
  async getAllLogos() {
    return this.logoService.getAllLogos();
  }

  @Post()
  @ApiOperation({ summary: 'Создать новое лого' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLogoDto })
  @ApiResponse({ status: 201, description: 'Лого успешно создано' })
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
  @ApiOperation({ summary: 'Получить лого по ID' })
  @ApiParam({ name: 'id', description: 'ID лого', example: 1 })
  @ApiResponse({ status: 200, description: 'Лого успешно получено' })
  async getLogoById(@Param('id', ParseIntPipe) id: number) {
    return this.logoService.getLogoById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить лого по ID' })
  @ApiParam({ name: 'id', description: 'ID лого', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateLogoDto })
  @ApiResponse({ status: 200, description: 'Лого успешно обновлено' })
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
  @ApiOperation({ summary: 'Удалить лого по ID' })
  @ApiParam({ name: 'id', description: 'ID лого', example: 1 })
  @ApiResponse({ status: 200, description: 'Лого успешно удалено' })
  async deleteLogo(@Param('id', ParseIntPipe) id: number) {
    await this.logoService.deleteLogo(id);
    return { message: 'Лого успешно удалено' };
  }
}
