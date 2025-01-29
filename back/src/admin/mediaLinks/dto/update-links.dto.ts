import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLinkDto {
  @ApiPropertyOptional({ description: 'Шлях до файлу', example: 'uploads/links/new_image.png' })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiPropertyOptional({ description: 'Назва посилання', example: 'Оновлене посилання' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'URL посилання', example: 'https://updated-example.com' })
  @IsString()
  @IsOptional()
  url?: string;
}
