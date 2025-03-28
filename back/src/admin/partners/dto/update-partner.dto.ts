import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePartnerDto {
  @ApiPropertyOptional({ description: 'Оновлений шлях до логотипу партнера', example: 'uploads/partners/new_logo.png' })
  @IsString()
  @IsOptional()
  path: string; // Оновлений шлях до файлу
  @ApiPropertyOptional({ description: 'Оновлений link до логотипу партнера', example: 'uploads/partners/new_logo.png' })
  @IsString()
  @IsOptional()
  link: string; // Оновлений шлях до файлу
}
