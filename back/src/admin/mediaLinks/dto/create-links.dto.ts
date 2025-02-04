import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatelinkDto {
  @ApiPropertyOptional({ description: 'Путь к файлу', example: 'uploads/links/image.png' })
  @IsString()
  @IsOptional()
  path: string;

  @ApiPropertyOptional({ description: 'Название ссылки', example: 'My Link' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional({ description: 'URL ссылки', example: 'https://example.com' })
  @IsString()
  @IsNotEmpty()
  url: string;
}
