import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateWorkShopCardsDto {
  @ApiProperty({
    description: 'Назва картки українською',
    example: 'Моя нова картка',
  })
  @IsString()
  @IsNotEmpty({ message: 'Назва картки (title) не може бути порожньою' })
  title: string;

  @ApiProperty({
    description: 'Назва картки англійською',
    example: 'My New Card',
    required: false,
  })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiProperty({
    description: 'Опис картки українською',
    example: 'Це детальний опис картки.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Опис картки (description) не може бути порожнім' })
  description: string;

  @ApiProperty({
    description: 'Опис картки англійською',
    example: 'This is a detailed description of the card.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description_en?: string;

  @ApiProperty({
    description: 'Розклад (масив рядків)',
    example: ['Пн 10:00–12:00', 'Вт 14:00–16:00'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Schedule не може бути порожнім масивом' })
  @IsString({ each: true, message: 'Кожен елемент schedule має бути рядком' })
  schedule: string[];

  @ApiProperty({
    description: 'Посилання (масив рядків)',
    example: ['https://…', 'https://…'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Link не може бути порожнім масивом' })
  @IsString({ each: true, message: 'Кожен елемент link має бути рядком' })
  link: string[];
}
