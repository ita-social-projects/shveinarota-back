import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Назва категорії', example: 'Текстиль' })
  @IsNotEmpty({ message: 'Поле "category" обов’язкове для заповнення' })
  @IsString({ message: 'Поле "category" має бути рядком' })
  category: string;

  @ApiProperty({ description: 'Назва категорії', example: 'Текстиль' })
  @IsNotEmpty({ message: 'Поле "category" обов’язкове для заповнення' })
  @IsString({ message: 'Поле "category" має бути рядком' })
  category_en: string;
}
