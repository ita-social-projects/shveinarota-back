import { IsString, IsOptional, IsArray, IsObject, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubcategoryDto {
  @ApiProperty({ description: 'Назва підкатегорії', example: 'Швейне обладнання' })
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiProperty({ description: 'Деталі', example: 'Додаткова інформація про підкатегорію' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({ description: 'Резюме', example: 'Короткий опис підкатегорії' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: 'URL-адреса', example: 'https://example.com' })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'Автори', example: ['Автор 1', 'Автор 2'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  authors?: string[];

  @ApiProperty({ description: 'Лекала', example: [{ path: '/lekala1', text: 'Опис лекала' }] })
  @IsArray()
  @IsOptional()
  @IsObject({ each: true })
  lekala?: { path: string; text: string }[];

  @ApiProperty({ description: 'Приклади', example: ['Приклад 1', 'Приклад 2'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  example?: string[];

  @ApiProperty({ description: 'Назва категорії', example: 'Текстиль' })
  @IsString()
  @IsOptional()
  categoryname?: string;

  @ApiProperty({ description: 'ID категорії для звʼязку', example: 1 })
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
