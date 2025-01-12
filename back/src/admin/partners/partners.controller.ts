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
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';

@Controller('partners')
export class PartnersController {
  constructor(private readonly PartnersService: PartnersService) {}

  @Get()
  async getAllPartners() {
    return this.PartnersService.getAllPartners();
  }

  @Post()
  @UseInterceptors(FileInterceptor('path', multerOptions)) // Указываем 'path' как имя файла
  async createPartner(
    @Body() createPartnerDto: CreatePartnerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createPartnerDto.path = file.path.replace(/\\/g, '/'); // Универсальный вид пути
    } 

    
    return this.PartnersService.createPartner(createPartnerDto);
  }
  

  @Get(':id')
  async getPartnerById(@Param('id') id: number) {
    return this.PartnersService.getPartnerById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('path', multerOptions))
  async updatePartner(
    @Param('id') id: number,
    @Body() UpdatePartnerDto: UpdatePartnerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      UpdatePartnerDto.path = file.path.replace(/\\/g, '/'); // Устанавливаем новый путь к картинке
    }

    const updatedPartner = await this.PartnersService.updatePartner(id, UpdatePartnerDto);

    // Явно формируем ответ
    return {
      message: 'Partner updated successfully',
      data: updatedPartner,
    };
  }


  @Delete(':id')
  async deletePartner(@Param('id') id: number) {
    await this.PartnersService.deletePartner(id);
    return { message: 'Partner deleted successfully' };
  }
}
