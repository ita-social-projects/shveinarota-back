import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetailDto } from './create-detail.dto';

export class CreateSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested()
  @Type(() => CreateDetailDto)
  @IsOptional()
  detail?: CreateDetailDto;
}
