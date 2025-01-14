import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetailDto } from './create-detail.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty({ description: 'Название подкатегории', example: 'Рубашки' })
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @ApiProperty({ description: 'Заголовок подкатегории', example: 'Детали рубашки' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Деталь подкатегории', type: CreateDetailDto, required: false })
  @ValidateNested()
  @Type(() => CreateDetailDto)
  @IsOptional()
  detail?: CreateDetailDto;
}
