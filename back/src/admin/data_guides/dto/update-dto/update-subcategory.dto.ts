import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDetailDto } from './update-detail.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubcategoryDto {
  @ApiProperty({
    description: 'Название подкатегории',
    example: 'Рубашки',
    required: false,
  })
  @IsString()
  @IsOptional()
  category_name?: string;

  @ApiProperty({
    description: 'Заголовок подкатегории',
    example: 'Детали рубашки',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Деталь подкатегории',
    type: UpdateDetailDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => UpdateDetailDto)
  @IsOptional()
  detail?: UpdateDetailDto;
}
