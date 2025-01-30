import { IsString, IsNotEmpty, IsObject, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty({
    description: 'Назва підкатегорії',
    example: 'Швейні машини',
  })
  @IsString()
  @IsNotEmpty()
  subcategory: string;

  @ApiProperty({
    description: 'Деталі підкатегорії',
    example: 'Опис особливостей швейних машин',
  })
  @IsString()
  @IsNotEmpty()
  details: string;

  @ApiProperty({
    description: 'Короткий опис підкатегорії',
    example: 'Коротка інформація про швейні машини',
  })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({
    description: 'URL сторінки підкатегорії',
    example: 'https://example.com/sewing-machines',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Список авторів',
    example: ['Іван Іванов', 'Марія Петрова'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  authors: string[];

  @ApiProperty({
    description: 'Масив об’єктів лекал',
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
    description: 'Приклади використання',
    example: ['Приклад 1', 'Приклад 2'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  example: string[];

  @ApiProperty({
    description: 'Назва категорії',
    example: 'Швейне обладнання',
  })
  @IsString()
  @IsNotEmpty()
  categoryname: string;
}
