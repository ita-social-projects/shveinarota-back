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

@ApiTags('Партнери')
@Controller('Partners')
export class PartnersController {
  constructor(private readonly PartnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі картки' })
  @ApiResponse({ status: 200, description: 'Картки успішно отримані' })
  async getAllPartnerss() {
    return this.PartnersService.getAllPartners();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image')) // Обробка файлів
  @ApiOperation({ summary: 'Створити нову партнера' })
  @ApiResponse({ status: 201, description: 'Картка успішно створена' })
  async createPartners(
    @Body() createPartnersDto: CreatePartnerDto, 
    @UploadedFile() image?: Express.Multer.File
  ) {
    if (!createPartnersDto.path && !image) {
      throw new BadRequestException('Посилання на зображення є обов’язковим');
    }

    // Якщо файл завантажено, зберігаємо його шлях у DTO
    if (image) {
      createPartnersDto.path = image.path; // Якщо зберігаєте файли локально
      // createPartnersDto.path = `https://your-storage.com/${image.filename}`; // Якщо зберігаєте у хмарі
    }

    return this.PartnersService.createPartners(createPartnersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати партнера за ID' })
  @ApiParam({ name: 'id', description: 'ID картки', example: 1 })
  @ApiResponse({ status: 200, description: 'Картка успішно отримана' })
  async getPartnersById(@Param('id', ParseIntPipe) id: number) {
    return this.PartnersService.getPartnersById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити партнера за ID' })
  @ApiParam({ name: 'id', description: 'ID картки', example: 1 })
  @ApiResponse({ status: 200, description: 'Картка успішно оновлена' })
  async updatePartners(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePartnersDto: UpdatePartnerDto
  ) {
    return this.PartnersService.updatePartners(id, updatePartnersDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити партнера за ID' })
  @ApiParam({ name: 'id', description: 'ID картки', example: 1 })
  @ApiResponse({ status: 200, description: 'Картка успішно видалена' })
  async deletePartners(@Param('id', ParseIntPipe) id: number) {
    await this.PartnersService.deletePartners(id);
    return { message: 'Картка успішно видалена' };
  }
}
