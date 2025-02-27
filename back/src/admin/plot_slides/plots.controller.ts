import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { PlotService } from './plots.service';
import { CreatePlotDto } from './dto/create-plot.dto';
import { UpdatePlotDto } from './dto/update-plot.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard'; 

/**
 * Контролер для керування слайдами сюжетів. Підтримує багатомовні маршрути (en, uk).
 */
@ApiTags('Сюжетні слайди')
@Controller(':lang/plots') // Динамічний параметр lang для визначення мови
export class PlotController {
  constructor(private readonly plotService: PlotService) {}

  /**
   * Отримання всіх слайдів сюжетів для вказаної мови.
   */
  @Get()
  @ApiOperation({ summary: 'Отримати всі сюжетні слайди для вибраної мови' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiResponse({ status: 200, description: 'Список сюжетних слайдів успішно отримано' })
  async getPlotsByLang(@Param('lang') lang: string) {
    return lang === 'en' ? this.plotService.getEnPlots() : this.plotService.getUkPlots();
  }

  /**
   * Отримання всіх сюжетних слайдів без урахування мови.
   */
  @Get('all')
  @ApiOperation({ summary: 'Отримати всі сюжетні слайди незалежно від мови' })
  @ApiResponse({ status: 200, description: 'Успішно отримано всі сюжетні слайди' })
  async getAllPlots() {
    return this.plotService.getAllPlots();
  }

  /**
   * Створення нового сюжетного слайду.
   */
  @Post()
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Створити новий сюжетний слайд' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePlotDto })
  @ApiResponse({ status: 201, description: 'Сюжетний слайд успішно створено' })
  @UseInterceptors(AnyFilesInterceptor()) 
  async createPlot(
    @Body() createPlotDto: CreatePlotDto,
    @UploadedFile() file: Express.Multer.File,
  ) { 
    return this.plotService.createPlot(createPlotDto);
  }

  /**
   * Отримання сюжетного слайду за його ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Отримати сюжетний слайд за ID' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'Унікальний ідентифікатор сюжетного слайду', example: 1 })
  @ApiResponse({ status: 200, description: 'Сюжетний слайд успішно знайдено' })
  async getPlotById(@Param('id', ParseIntPipe) id: number) {
    const plot = await this.plotService.getPlotById(id);
    if (!plot) {
      throw new BadRequestException(`Сюжетний слайд з ID ${id} не знайдено`);
    }

    return {
      id: plot.id,
      path: plot.path,
      title: plot.title,
      title_en: plot.title_en,
      url: plot.url,
    };
  }

  /**
   * Оновлення сюжетного слайду за його ID.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Оновити сюжетний слайд за ID' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'Унікальний ідентифікатор сюжетного слайду', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePlotDto })
  @ApiResponse({ status: 200, description: 'Сюжетний слайд успішно оновлено' })
  @UseInterceptors(AnyFilesInterceptor())
  async updatePlot(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlotDto: UpdatePlotDto,
  ) {
    await this.plotService.updatePlot(id, updatePlotDto);
    return {
      message: 'Сюжетний слайд успішно оновлено',
    };
  }

  /**
   * Видалення сюжетного слайду за його ID.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Видалити сюжетний слайд за ID' })
  @ApiParam({ name: 'lang', description: 'Мова (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'Унікальний ідентифікатор сюжетного слайду', example: 1 })
  @ApiResponse({ status: 200, description: 'Сюжетний слайд успішно видалено' })
  async deletePlot(@Param('id', ParseIntPipe) id: number) {
    await this.plotService.deletePlot(id);
    return { message: 'Сюжетний слайд успішно видалено' };
  }
}
