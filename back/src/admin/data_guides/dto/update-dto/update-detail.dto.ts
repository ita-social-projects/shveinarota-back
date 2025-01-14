import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDetailDto {
  @ApiProperty({
    description: 'Название детали',
    example: 'Деталь рукава',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Описание детали',
    example: 'Описание детали',
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({
    description: 'Краткое описание',
    example: 'Краткое описание детали',
    required: false,
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({
    description: 'Ссылка на видеоурок',
    example: 'https://example.com/video',
    required: false,
  })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    description: 'Массив авторов',
    example: ['Автор 1', 'Автор 2'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  authors?: string[];

  @ApiProperty({
    description: 'Категория детали',
    example: 'Категория А',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Массив файлов лекал',
    example: ['lekala1.jpg', 'lekala2.jpg'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  lekala?: string[];

  @ApiProperty({
    description: 'Массив примеров',
    example: ['example1.jpg', 'example2.jpg'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  example?: string[];
}
