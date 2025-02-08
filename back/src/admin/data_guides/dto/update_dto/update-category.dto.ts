import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Назва категорії українською', example: 'Текстиль' })
  @IsOptional()
  @IsString({ message: 'Поле "category" має бути рядком' })
  category?: string;

  @ApiProperty({ description: 'Назва категорії англійською', example: 'Textile' })
  @IsOptional()
  @IsString({ message: 'Поле "category_en" має бути рядком' })
  category_en?: string;
}
