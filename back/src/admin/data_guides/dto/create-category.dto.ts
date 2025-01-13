import { IsString, IsNotEmpty, ValidateNested, IsOptional, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubcategoryDto } from './create-subcategory.dto';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSubcategoryDto)
  @IsOptional()
  subcategories?: CreateSubcategoryDto[];
}
