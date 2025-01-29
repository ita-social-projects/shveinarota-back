import { IsString, IsNotEmpty, IsObject, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty({
    description: 'Название подкатегории',
    example: 'Швейные машины',
  })
  @IsString()
  @IsNotEmpty()
  subcategory: string;

  @ApiProperty({
    description: 'Детали подкатегории',
    example: 'Описание особенностей швейных машин',
  })
  @IsString()
  @IsNotEmpty()
  details: string;

  @ApiProperty({
    description: 'Краткое описание подкатегории',
    example: 'Краткая информация о швейных машинах',
  })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({
    description: 'URL страницы подкатегории',
    example: 'https://example.com/sewing-machines',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Список авторов',
    example: ['Иван Иванов', 'Мария Петрова'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  authors: string[];

  @ApiProperty({
    description: 'Массив объектов лекал',
    example: [
      { path: '/lekala1.pdf', text: 'Лекало 1' },
      { path: '/lekala2.pdf', text: 'Лекало 2' },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        path: { type: 'string', example: '/lekala1.pdf' },
        text: { type: 'string', example: 'Лекало 1' },
      },
    },
  })
  @IsArray()
  @IsNotEmpty()
  @IsObject({ each: true })
  lekala: { path: string; text: string }[];

  @ApiProperty({
    description: 'Примеры использования',
    example: ['Пример 1', 'Пример 2'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  example: string[];

  @ApiProperty({
    description: 'Название категории',
    example: 'Швейное оборудование',
  })
  @IsString()
  @IsNotEmpty()
  categoryname: string;

  @ApiProperty({
    description: 'ID категории, к которой относится подкатегория',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
