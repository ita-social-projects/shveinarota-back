import { IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateSubcategoryDto } from './update-subcategory.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Название категории',
    example: 'Женская одежда',
    required: false,
  })
  @IsString()
  @IsOptional()
  category_name?: string;

  @ApiProperty({
    description: 'Массив подкатегорий',
    type: [UpdateSubcategoryDto],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateSubcategoryDto)
  @IsOptional()
  @IsArray()
  subcategories?: UpdateSubcategoryDto[];
}
