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
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить всех партнеров' })
  @ApiResponse({ status: 200, description: 'Партнеры успешно получены' })
  async getAllPartners() {
    return this.partnersService.getAllPartners();
  }

  @Post()
  @ApiOperation({ summary: 'Создать нового партнера' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePartnerDto })
  @ApiResponse({ status: 201, description: 'Партнер успешно создан' })
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
  @ApiOperation({ summary: 'Получить партнера по ID' })
  @ApiParam({ name: 'id', description: 'ID партнера', example: 1 })
  @ApiResponse({ status: 200, description: 'Партнер успешно получен' })
  async getPartnerById(@Param('id', ParseIntPipe) id: number) {
    return this.partnersService.getPartnerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить партнера по ID' })
  @ApiParam({ name: 'id', description: 'ID партнера', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePartnerDto })
  @ApiResponse({ status: 200, description: 'Партнер успешно обновлен' })
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
  @ApiOperation({ summary: 'Удалить партнера по ID' })
  @ApiParam({ name: 'id', description: 'ID партнера', example: 1 })
  @ApiResponse({ status: 200, description: 'Партнер успешно удален' })
  async deletePartner(@Param('id', ParseIntPipe) id: number) {
    await this.partnersService.deletePartner(id);
    return { message: 'Партнер успешно удален' };
  }
}
