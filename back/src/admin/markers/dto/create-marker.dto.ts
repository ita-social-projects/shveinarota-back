import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMarkerDto {
  @ApiProperty({ description: 'Широта', example: 50.4501 })
  @Transform(({ value }) => parseFloat(value)) // Конвертация из строки в число
  @IsNumber()
  @IsNotEmpty({ message: 'Поле lat не може бути порожнім' })
  lat: number;

  @ApiProperty({ description: 'Довгота', example: 30.5234 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty({ message: 'Поле lng не може бути порожнім' })
  lng: number;

  @ApiProperty({ description: 'Заголовок', example: 'My Marker' })
  @IsString()
  @IsNotEmpty({ message: 'Поле title не може бути порожнім' })
  title: string;


  @ApiPropertyOptional({ description: 'Телефон', example: '+380123456789' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Шлях до файлу', example: 'uploads/markers/image.png' })
  @IsString()
  @IsOptional()
  path?: string;
}
