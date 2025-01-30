import { 
  Controller, Get, Post, Put, Param, Body, Delete, 
  BadRequestException, UseInterceptors, ParseIntPipe 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
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
  @ApiOperation({ summary: 'Створити нового партнера' })
  @ApiResponse({ status: 201, description: 'Партнер успішно створений' })
  @UseInterceptors(AnyFilesInterceptor())
  async createPartners(
    @Body() createPartnersDto: CreatePartnerDto
  ) {
    return this.PartnersService.createPartners(createPartnersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати партнера за ID' })
  @ApiParam({ name: 'id', description: 'ID партнера', example: 1 })
  @ApiResponse({ status: 200, description: 'Партнер успішно отриманий' })
  async getPartnersById(@Param('id', ParseIntPipe) id: number) {
    return this.PartnersService.getPartnersById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити партнера за ID' })
  @ApiParam({ name: 'id', description: 'ID партнера', example: 1 })
  @ApiResponse({ status: 200, description: 'Партнер успішно оновлений' })
  @UseInterceptors(AnyFilesInterceptor())
  async updatePartners(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePartnersDto: UpdatePartnerDto
  ) {
    return this.PartnersService.updatePartners(id, updatePartnersDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити партнера за ID' })
  @ApiParam({ name: 'id', description: 'ID партнера', example: 1 })
  @ApiResponse({ status: 200, description: 'Партнер успішно видалений' })
  async deletePartners(@Param('id', ParseIntPipe) id: number) {
    await this.PartnersService.deletePartners(id);
    return { message: 'Партнер успішно видалений' };
  }
}
