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
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer-options';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Partners') // Group under 'Partners' in Swagger UI
@Controller('partners')
export class PartnersController {
  constructor(private readonly PartnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all partners' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all partners' })
  async getAllPartners() {
    return this.PartnersService.getAllPartners();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePartnerDto })
  @ApiResponse({ status: 201, description: 'Partner created successfully' })
  @UseInterceptors(FileInterceptor('path', multerOptions('partners')))
  async createPartner(
    @Body() createPartnerDto: CreatePartnerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createPartnerDto.path = file.path.replace(/\\/g, '/'); // Normalize file path
    }
    return this.PartnersService.createPartner(createPartnerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the partner' })
  async getPartnerById(@Param('id') id: number) {
    return this.PartnersService.getPartnerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner ID', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePartnerDto })
  @ApiResponse({ status: 200, description: 'Partner updated successfully' })
  @UseInterceptors(FileInterceptor('path', multerOptions('partners')))
  async updatePartner(
    @Param('id') id: number,
    @Body() updatePartnerDto: UpdatePartnerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updatePartnerDto.path = file.path.replace(/\\/g, '/'); // Normalize file path
    }

    const updatedPartner = await this.PartnersService.updatePartner(id, updatePartnerDto);
    return {
      message: 'Partner updated successfully',
      data: updatedPartner,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Partner deleted successfully' })
  async deletePartner(@Param('id') id: number) {
    await this.PartnersService.deletePartner(id);
    return { message: 'Partner deleted successfully' };
  }
}
