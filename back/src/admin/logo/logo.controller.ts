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
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { LogoService } from './logo.service';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { multerOptions } from '../../common/multer-options';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard'; 
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Створити новий логотип' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLogoDto })
  @ApiResponse({ status: 201, description: 'Логотип успішно створено' })
  @UseInterceptors(AnyFilesInterceptor()) 
  async createLogo(@Body() createLogoDto: CreateLogoDto) {
  
    if (!createLogoDto.path1) {
      throw new BadRequestException('Поле path1 є обов’язковим');
    }
  
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Оновити логотип за ID' })
  @ApiParam({ name: 'id', description: 'ID логотипу', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateLogoDto })
  @ApiResponse({ status: 200, description: 'Логотип успішно оновлено' })
  @UseInterceptors(AnyFilesInterceptor()) 
  async updateLogo(
    @Param('id') id: number, 
    @Body() updateLogo: UpdateLogoDto
  ) {
  
    if (!updateLogo.path1) {
      throw new BadRequestException('Поле path1 є обов’язковим');
    }
  
    return this.logoService.updateLogo(id, updateLogo);
  }
  
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Видалити логотип за ID' })
  @ApiParam({ name: 'id', description: 'ID логотипу', example: 1 })
  @ApiResponse({ status: 200, description: 'Логотип успішно видалено' })
  async deleteLogo(@Param('id', ParseIntPipe) id: number) {
    await this.logoService.deleteLogo(id);
    return { message: 'Логотип успішно видалено' };
  }
}
