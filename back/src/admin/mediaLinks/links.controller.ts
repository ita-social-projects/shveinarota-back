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
import { linksService } from './links.service';
import { CreatelinkDto } from './dto/create-links.dto';
import { UpdatelinkDto } from './dto/update-links.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';

@Controller('medialinks')
export class linksController {
  constructor(private readonly linksService: linksService) {}

  @Get()
  async getAlllinks() {
    return this.linksService.getAlllinks();
  }

  @Post()
  @UseInterceptors(FileInterceptor('path', multerOptions("links"))) // Указываем 'path' как имя файла
  async createlink(
    @Body() createlinkDto: CreatelinkDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createlinkDto.path = file.path.replace(/\\/g, '/'); // Универсальный вид пути
    } 

    
    return this.linksService.createlink(createlinkDto);
  }
  

  @Get(':id')
  async getlinkById(@Param('id') id: number) {
    return this.linksService.getlinkById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('path', multerOptions("links")))
  async updatelink(
    @Param('id') id: number,
    @Body() UpdatelinkDto: UpdatelinkDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      UpdatelinkDto.path = file.path.replace(/\\/g, '/'); // Устанавливаем новый путь к картинке
    }

    const updatedlink = await this.linksService.updatelink(id, UpdatelinkDto);

    // Явно формируем ответ
    return {
      message: 'link updated successfully',
      data: updatedlink,
    };
  }


  @Delete(':id')
  async deletelink(@Param('id') id: number) {
    await this.linksService.deletelink(id);
    return { message: 'link deleted successfully' };
  }
}
