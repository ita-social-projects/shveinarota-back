import { IsString, IsNotEmpty, ValidateNested, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Название категории',
    example: 'Женская одежда',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  categoryname: string;

  @ApiProperty({
    description: 'Массив подкатегорий',
    type: [CreateSubcategoryDto],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateSubcategoryDto)
  @IsOptional()
  @IsArray()
  subcategories?: CreateSubcategoryDto[];
}
