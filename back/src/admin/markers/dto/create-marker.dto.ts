import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMarkerDto {
  @ApiProperty({ description: 'Широта', example: '50.4501' })
  @IsString()
  @IsNotEmpty({ message: 'Поле lat не може бути порожнім' })
  lat: string;

  @ApiProperty({ description: 'Довгота', example: '30.5234' })
  @IsString()
  @IsNotEmpty({ message: 'Поле lng не може бути порожнім' })
  lng: string;

  @ApiProperty({ description: 'Заголовок', example: 'My Marker' })
  @IsString()
  @IsNotEmpty({ message: 'Поле title не може бути порожнім' })
  title: string;

  @ApiPropertyOptional({ description: 'Адреса', example: 'вул. Хрещатик, 1' })
  @IsString()
  @IsOptional()
  adress?: string;

  @ApiPropertyOptional({ description: 'Телефон', example: '+380123456789' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Шлях до файлу', example: 'uploads/markers/image.png' })
  @IsString()
  @IsOptional()
  path?: string;
}
