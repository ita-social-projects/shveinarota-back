import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMarkerDto {
  @ApiPropertyOptional({ description: 'Широта', example: '50.4501' })
  @IsString()
  @IsOptional()
  lat?: string;

  @ApiPropertyOptional({ description: 'Довгота', example: '30.5234' })
  @IsString()
  @IsOptional()
  lng?: string;

  @ApiPropertyOptional({ description: 'Заголовок', example: 'Оновлений маркер' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Адреса', example: 'вул. Хрещатик, 2' })
  @IsString()
  @IsOptional()
  adress?: string;

  @ApiPropertyOptional({ description: 'Телефон', example: '+380987654321' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Шлях до файлу', example: 'uploads/markers/new_image.png' })
  @IsString()
  @IsOptional()
  path?: string;
}
