import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    description: 'Название карточки',
    example: 'My New Card',
  })
  @IsString()
  @IsNotEmpty({ message: 'Название карточки (title) не может быть пустым' })
  title: string; // Название карточки

  @ApiProperty({
    description: 'Описание карточки',
    example: 'This is a detailed description of the card.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string; // Описание карточки (опционально)

  @ApiProperty({
    description: 'Путь к файлу изображения',
    example: '/uploads/cards/card-image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  path?: string; // Путь к файлу изображения (опционально)
}
