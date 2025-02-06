import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
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
  })
  @IsString()
  @IsNotEmpty({ message: 'Назва картки (title_en) не може бути порожньою' })
  title_en: string;

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
  })
  @IsString()
  @IsNotEmpty({ message: 'Опис картки (description_en) не може бути порожнім' })
  description_en: string;

  @ApiProperty({
    description: 'Шлях до файлу зображення',
    example: '/uploads/cards/card-image.jpg',
  })
  @IsString()
  @IsNotEmpty({ message: 'Шлях до зображення є обов’язковим' })
  path: string;
}
