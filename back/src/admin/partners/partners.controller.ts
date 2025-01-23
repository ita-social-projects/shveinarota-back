import { 
  Controller, Get, Post, Put, Param, Body, Delete, 
  BadRequestException, NotFoundException, UseInterceptors, UploadedFile, 
  ParseIntPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Partners')
@Controller('Partners')
export class PartnersController {
  constructor(private readonly PartnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все карточки' })
  @ApiResponse({ status: 200, description: 'Карточки успешно получены' })
  async getAllPartnerss() {
    return this.PartnersService.getAllPartners();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image')) // Обработка файлов
  @ApiOperation({ summary: 'Создать новую карточку' })
  @ApiResponse({ status: 201, description: 'Карточка успешно создана' })
  async createPartners(
    @Body() createPartnersDto: CreatePartnerDto, 
    @UploadedFile() image?: Express.Multer.File
  ) {
    if (!createPartnersDto.path && !image) {
      throw new BadRequestException('Ссылка на изображение обязательна');
    }

    // Если файл загружен, сохраняем его путь в DTO
    if (image) {
      createPartnersDto.path = image.path; // Если храните файлы локально
      // createPartnersDto.path = `https://your-storage.com/${image.filename}`; // Если храните в облаке
    }

    return this.PartnersService.createPartners(createPartnersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно получена' })
  async getPartnersById(@Param('id', ParseIntPipe) id: number) {
    return this.PartnersService.getPartnersById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно обновлена' })
  async updatePartners(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePartnersDto: UpdatePartnerDto
  ) {
    return this.PartnersService.updatePartners(id, updatePartnersDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить карточку по ID' })
  @ApiParam({ name: 'id', description: 'ID карточки', example: 1 })
  @ApiResponse({ status: 200, description: 'Карточка успешно удалена' })
  async deletePartners(@Param('id', ParseIntPipe) id: number) {
    await this.PartnersService.deletePartners(id);
    return { message: 'Карточка успешно удалена' };
  }
}
