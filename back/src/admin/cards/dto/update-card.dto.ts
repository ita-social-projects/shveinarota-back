import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCardDto {
  @ApiPropertyOptional({
    description: 'Название карточки',
    example: 'Updated Card Title',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Название карточки (title) не может быть пустым' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Описание карточки',
    example: 'Updated description for the card.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Путь к файлу изображения',
    example: '/uploads/cards/updated-image.jpg',
  })
  @IsString()
  @IsOptional()
  path?: string;
}
