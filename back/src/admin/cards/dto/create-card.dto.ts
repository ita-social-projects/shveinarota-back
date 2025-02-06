import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    description: 'Название карточки',
    example: 'My New Card',
  })
  @IsString()
  @IsNotEmpty({ message: 'Название карточки (title) не может быть пустым' })
  title: string;

  @ApiProperty({
    description: 'Название карточки на английском',
    example: 'My New Card',
  })
  @IsString()
  @IsNotEmpty({ message: 'Название карточки (title_en) не может быть пустым' })
  title_en: string;

  @ApiProperty({
    description: 'Описание карточки',
    example: 'This is a detailed description of the card.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Описание карточки (description) не может быть пустым' })
  description: string;

  @ApiProperty({
    description: 'Описание карточки на английском',
    example: 'This is a detailed description of the card.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Описание карточки (description_en) не может быть пустым' })
  description_en: string;

  @ApiProperty({
    description: 'Путь к файлу изображения',
    example: '/uploads/cards/card-image.jpg',
  })
  @IsString()
  @IsNotEmpty({ message: 'Путь к изображению обязателен' })
  path: string;
}
