import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTeamDto {
  @ApiPropertyOptional({
    description: 'Назва картки українською',
    example: 'Оновлена назва картки',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Назва картки англійською',
    example: 'Updated Card Title',
  })
  @IsString()
  @IsOptional()
  status_en?: string;

  @ApiPropertyOptional({
    description: 'Опис картки українською',
    example: 'Оновлений опис картки.',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Опис картки англійською',
    example: 'Updated description for the card.',
  })
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiPropertyOptional({
    description: 'Шлях до файлу зображення',
    example: '/uploads/cards/updated-image.jpg',
  })
  @IsString()
  @IsOptional()
  path?: string;
}
