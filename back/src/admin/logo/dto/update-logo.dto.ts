import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLogoDto {
  @ApiPropertyOptional({ description: 'Оновлений шлях до логотипу партнера', example: 'uploads/partners/new_logo.png' })
  @IsString()
  @IsOptional()
  path1: string; // Шлях до логотипу

  @ApiPropertyOptional({ description: 'Оновлений шлях до логотипу партнера', example: 'uploads/partners/new_logo.png' })
  @IsString()
  @IsOptional()
  path2: string; // Шлях до логотипу
}
