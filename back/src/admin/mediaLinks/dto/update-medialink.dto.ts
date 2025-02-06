import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMediaLinkDto {
  @ApiPropertyOptional({ description: 'Оновлений шлях до файлу', example: 'uploads/links/new_image.png' })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiPropertyOptional({ description: 'Оновлена назва посилання (українською)', example: 'Оновлене посилання' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Оновлена назва посилання (англійською)', example: 'Updated Link' })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiPropertyOptional({ description: 'Оновлена URL-адреса посилання', example: 'https://updated-example.com' })
  @IsString()
  @IsOptional()
  url?: string;
}
