import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMarkerDto {
  @ApiPropertyOptional({ description: 'Широта', example: '50.4501' })
  @IsString()
  @IsOptional()
  lat?: string;

  @ApiPropertyOptional({ description: 'Долгота', example: '30.5234' })
  @IsString()
  @IsOptional()
  lng?: string;

  @ApiPropertyOptional({ description: 'Заголовок', example: 'Updated Marker' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Адрес', example: 'ул. Крещатик, 2' })
  @IsString()
  @IsOptional()
  adress?: string;

  @ApiPropertyOptional({ description: 'Телефон', example: '+380987654321' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Путь к файлу', example: 'uploads/markers/new_image.png' })
  @IsString()
  @IsOptional()
  path?: string;
}
