import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
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
    description: 'Описание карточки',
    example: 'This is a detailed description of the card.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Путь к файлу изображения',
    example: '/uploads/cards/card-image.jpg',
    required: true, // Теперь обязательное поле
  })
  @IsString()
  @IsNotEmpty({ message: 'Путь к изображению обязателен' })
  path: string; // Поле сделано обязательным
}
