import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubcategoryDto } from './create-subcategory.dto';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryname: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubcategoryDto)
  subcategories?: CreateSubcategoryDto[];
}
