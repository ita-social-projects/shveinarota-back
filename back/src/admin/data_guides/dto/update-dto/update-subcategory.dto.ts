import { IsOptional, IsString } from 'class-validator';

export class UpdateSubcategoryDto {
  @IsOptional()
  @IsString()
  subcategory_name?: string;
}
