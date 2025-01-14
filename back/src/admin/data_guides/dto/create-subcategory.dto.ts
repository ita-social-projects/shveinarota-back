import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDetailDto } from './create-detail.dto';

export class CreateSubcategoryDto {
  @ApiProperty({ description: 'Название подкатегории', example: 'Рубашки' })
  @IsString()
  @IsNotEmpty()
  subcategory_name: string;

  @ApiProperty({ description: 'Детали подкатегории', type: CreateDetailDto, required: false })
  @ValidateNested()
  @Type(() => CreateDetailDto)
  @IsOptional()
  detail?: CreateDetailDto;
}
