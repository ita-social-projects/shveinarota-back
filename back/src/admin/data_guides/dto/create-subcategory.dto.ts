import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class LekalaDto {
  @ApiProperty({ description: 'Шлях до файлу', example: '/lekala1.pdf' })
  @IsString()
  path: string;

  @ApiProperty({ description: 'Текст українською', example: 'Лекало 1' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Текст англійською', example: 'Pattern 1' })
  @IsString()
  text_en: string;
}

export class CreateSubcategoryDto {
  @ApiProperty({ description: 'Назва підкатегорії українською мовою', example: 'Швейні машини' })
  @IsString()
  @IsNotEmpty()
  subcategory: string;

  @ApiProperty({ description: 'Назва підкатегорії англійською мовою', example: 'Sewing Machines' })
  @IsString()
  @IsNotEmpty()
  subcategory_en: string;

  @ApiProperty({ description: 'Деталі підкатегорії українською мовою', example: 'Опис особливостей швейних машин' })
  @IsString()
  @IsNotEmpty()
  details: string;

  @ApiProperty({ description: 'Деталі підкатегорії англійською мовою', example: 'Description of sewing machines features' })
  @IsString()
  @IsNotEmpty()
  details_en: string;

  @ApiProperty({ description: 'Короткий опис підкатегорії українською мовою', example: 'Коротка інформація про швейні машини' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ description: 'Короткий опис підкатегорії англійською мовою', example: 'Brief information about sewing machines' })
  @IsString()
  @IsNotEmpty()
  summary_en: string;

  @ApiProperty({ description: 'URL сторінки підкатегорії', example: 'https://example.com/sewing-machines' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'Список авторів українською мовою', example: ['Іван Іванов', 'Марія Петрова'] })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  authors: string[];

  @ApiProperty({ description: 'Список авторів англійською мовою', example: ['Ivan Ivanov', 'Maria Petrova'] })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  authors_en: string[];

  @ApiProperty({
    description: 'Масив об’єктів лекал',
    example: [
      { "path": "/lekala1.pdf", "text": "Лекало 1", "text_en": "Pattern 1" },
      { "path": "/lekala2.pdf", "text": "Лекало 2", "text_en": "Pattern 2" }
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LekalaDto)
  lekala: LekalaDto[];

  @ApiProperty({
    description: 'Приклади використання',
    example: [
      { "path": "/example1.pdf", "text": "Приклад 1", "text_en": "Example 1" },
      { "path": "/example2.pdf", "text": "Приклад 2", "text_en": "Example 2" }
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LekalaDto)
  example: LekalaDto[];

  @ApiProperty({ description: 'Назва категорії українською мовою', example: 'Швейне обладнання' })
  @IsString()
  @IsNotEmpty()
  categoryname: string;

  @ApiProperty({ description: 'Превью', example: 'htttp/img.png' })
  @IsString()
  @IsNotEmpty()
  preview: string;

  @ApiProperty({ description: 'Назва категорії англійською мовою', example: 'Sewing Equipment' })
  @IsString()
  @IsNotEmpty()
  categoryname_en: string;
}
