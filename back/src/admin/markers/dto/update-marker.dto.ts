import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateMarkerDto {
  @ApiPropertyOptional({ description: 'Широта місця розташування', example: 50.4501, type: Number })
  @Transform(({ value }) => parseFloat(value)) // Конвертація рядка в число
  @IsNumber()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional({ description: 'Довгота місця розташування', example: 30.5234, type: Number })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  lng?: number;

  @ApiPropertyOptional({ description: 'Назва мітки', example: 'Оновлена мітка' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Назва мітки англійською', example: 'Updated Marker' })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiPropertyOptional({ description: 'Контактний телефон', example: '+380987654321' })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({ description: 'Шлях до оновленого зображення', example: 'uploads/markers/new_image.png' })
  @IsString()
  @IsOptional()
  path?: string;
}
