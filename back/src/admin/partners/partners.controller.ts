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
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard'; 

@ApiTags('Партнери')
@Controller(':lang/partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всіх партнерів' })
  @ApiParam({ name: 'lang', description: 'Мова відповіді (uk або en)', example: 'uk' })
  @ApiResponse({ status: 200, description: 'Список партнерів успішно отримано' })
  async getAllPartners() {
    return this.partnersService.getAllPartners();
  }

  @Post()
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Створити нового партнера' })
  @ApiParam({ name: 'lang', description: 'Мова відповіді (uk або en)', example: 'uk' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Дані для створення партнера',
    type: CreatePartnerDto,
  })
  @ApiResponse({ status: 201, description: 'Партнера успішно створено' })
  @UseInterceptors(FileInterceptor('path', multerOptions('partners')))
  async createPartner(
    @Body() createPartnerDto: CreatePartnerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createPartnerDto.path = file.path.replace(/\\/g, '/');
    }
    return this.partnersService.createPartner(createPartnerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати партнера за ID' })
  @ApiParam({ name: 'lang', description: 'Мова відповіді (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'Ідентифікатор партнера', example: 1 })
  @ApiResponse({ status: 200, description: 'Партнера успішно отримано' })
  async getPartnerById(@Param('id', ParseIntPipe) id: number) {
    return this.partnersService.getPartnerById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Оновити партнера за ID' })
  @ApiParam({ name: 'lang', description: 'Мова відповіді (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'Ідентифікатор партнера', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Дані для оновлення партнера',
    type: UpdatePartnerDto,
  })
  @ApiResponse({ status: 200, description: 'Партнера успішно оновлено' })
  @UseInterceptors(FileInterceptor('path', multerOptions('partners')))
  async updatePartner(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartnerDto: UpdatePartnerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updatePartnerDto.path = file.path.replace(/\\/g, '/');
    }
    return this.partnersService.updatePartner(id, updatePartnerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Видалити партнера за ID' })
  @ApiParam({ name: 'lang', description: 'Мова відповіді (uk або en)', example: 'uk' })
  @ApiParam({ name: 'id', description: 'Ідентифікатор партнера', example: 1 })
  @ApiResponse({ status: 200, description: 'Партнера успішно видалено' })
  async deletePartner(@Param('id', ParseIntPipe) id: number) {
    await this.partnersService.deletePartner(id);
    return { message: 'Партнера успішно видалено' };
  }
}
