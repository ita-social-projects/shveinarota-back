import { IsString, IsNotEmpty, ValidateNested, IsOptional, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Название категории', example: 'Женская одежда' })
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @ApiProperty({
    description: 'Массив подкатегорий',
    type: [CreateSubcategoryDto],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateSubcategoryDto)
  @IsOptional()
  subcategories?: CreateSubcategoryDto[];
}