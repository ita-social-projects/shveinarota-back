import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMediaLinkDto {
  @ApiPropertyOptional({ description: 'Шлях до файлу', example: 'uploads/links/image.png' })
  @IsString()
  @IsOptional()
  path: string;

  @ApiPropertyOptional({ description: 'Назва посилання (українською)', example: 'Моє посилання' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional({ description: 'Назва посилання (англійською)', example: 'My Link' })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiPropertyOptional({ description: 'URL-адреса посилання', example: 'https://example.com' })
  @IsString()
  @IsNotEmpty()
  url: string;
}
