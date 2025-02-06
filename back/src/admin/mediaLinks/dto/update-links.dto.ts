import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLinkDto {
  @ApiPropertyOptional({ description: 'Путь к файлу', example: 'uploads/links/new_image.png' })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiPropertyOptional({ description: 'Название ссылки', example: 'Updated Link' })
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @IsString()
  title_en?: string;

  @ApiPropertyOptional({ description: 'URL ссылки', example: 'https://updated-example.com' })
  @IsString()
  @IsOptional()
  url?: string;
}
