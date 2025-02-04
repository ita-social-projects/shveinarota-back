import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateSubcategoryDto {
  @ApiProperty({ description: 'Назва підкатегорії', example: 'Швейні машини' })
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiProperty({ description: 'Деталі підкатегорії', example: 'Опис особливостей швейних машин' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({ description: 'Короткий опис підкатегорії', example: 'Коротка інформація про швейні машини' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: 'URL сторінки підкатегорії', example: 'https://example.com/sewing-machines' })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'Список авторів', example: ['Іван Іванов', 'Марія Петрова'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  authors?: string[];

  @ApiProperty({
    description: 'Масив об’єктів лекал',
    example: [
      { path: '/lekala1.pdf', text: 'Лекало 1' },
      { path: '/lekala2.pdf', text: 'Лекало 2' },
    ],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Object)
  lekala?: { path: string; text: string }[];

  @ApiProperty({ description: 'Приклади використання', example: ['Приклад 1', 'Приклад 2'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  example?: string[];

  @ApiProperty({ description: 'Назва категорії', example: 'Швейне обладнання' })
  @IsString()
  @IsOptional()
  categoryname?: string;
}
