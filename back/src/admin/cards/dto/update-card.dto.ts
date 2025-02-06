import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCardDto {
  @ApiPropertyOptional({
    description: 'Назва картки українською',
    example: 'Оновлена назва картки',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Назва картки англійською',
    example: 'Updated Card Title',
  })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiPropertyOptional({
    description: 'Опис картки українською',
    example: 'Оновлений опис картки.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Опис картки англійською',
    example: 'Updated description for the card.',
  })
  @IsString()
  @IsOptional()
  description_en?: string;

  @ApiPropertyOptional({
    description: 'Шлях до файлу зображення',
    example: '/uploads/cards/updated-image.jpg',
  })
  @IsString()
  @IsOptional()
  path?: string;
}
