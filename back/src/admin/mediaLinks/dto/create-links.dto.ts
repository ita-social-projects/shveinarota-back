import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiPropertyOptional({ description: 'Шлях до файлу', example: 'uploads/links/image.png' })
  @IsString()
  @IsOptional()
  path: string;

  @ApiPropertyOptional({ description: 'Назва посилання', example: 'My Link' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional({ description: 'URL посилання', example: 'https://example.com' })
  @IsString()
  @IsOptional()
  url: string;
}
