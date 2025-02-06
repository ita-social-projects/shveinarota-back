import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMarkerDto {
  @ApiProperty({ description: 'Широта місця розташування', example: 50.4501 })
  @Transform(({ value }) => parseFloat(value)) // Конвертація зі строки в число
  @IsNumber()
  @IsNotEmpty({ message: 'Поле lat не може бути порожнім' })
  lat: number;

  @ApiProperty({ description: 'Довгота місця розташування', example: 30.5234 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty({ message: 'Поле lng не може бути порожнім' })
  lng: number;

  @ApiProperty({ description: 'Назва мітки', example: 'Моя мітка' })
  @IsString()
  @IsNotEmpty({ message: 'Поле title не може бути порожнім' })
  title: string;

  @ApiPropertyOptional({ description: 'Назва мітки англійською', example: 'My Marker' })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiPropertyOptional({ description: 'Контактний телефон', example: '+380123456789' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Шлях до зображення', example: 'uploads/markers/image.png' })
  @IsString()
  @IsOptional()
  path?: string;
}
