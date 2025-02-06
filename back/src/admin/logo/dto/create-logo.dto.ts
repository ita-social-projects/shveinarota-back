import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogoDto {
  @ApiPropertyOptional({
    description: 'Шлях до логотипу партнера',
    example: 'uploads/partners/logo.png',
  })
  @IsString()
  @IsOptional()
  path1: string; // Шлях до файлу логотипу

  @ApiPropertyOptional({
    description: 'Шлях до другого логотипу партнера',
    example: 'uploads/partners/logo.png',
  })
  @IsString()
  @IsOptional()
  path2: string; // Шлях до файлу логотипу
}
