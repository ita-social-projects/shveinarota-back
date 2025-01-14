import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetailDto {
  @ApiProperty({ description: 'Название детали', example: 'Деталь рукава' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Массив файлов лекал', example: ['lekala1.jpg', 'lekala2.jpg'], required: false })
  @IsArray()
  @IsOptional()
  lekala?: string[];

  @ApiProperty({ description: 'Ссылка на видеоурок', example: 'https://example.com/video', required: false })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({ description: 'Массив файлов с примерами', example: ['example1.jpg', 'example2.jpg'], required: false })
  @IsArray()
  @IsOptional()
  example?: string[];

  @ApiProperty({ description: 'Детали описания', example: 'Описание детали', required: false })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({ description: 'Краткое описание', example: 'Краткое описание детали', required: false })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: 'Массив авторов', example: ['Автор 1', 'Автор 2'], required: false })
  @IsArray()
  @IsOptional()
  authors?: string[];

  @ApiProperty({ description: 'Категория детали', example: 'Категория А', required: false })
  @IsString()
  @IsOptional()
  category?: string;
}
