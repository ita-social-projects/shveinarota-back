import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMarkerDto {
  @ApiProperty({ description: 'Широта', example: '50.4501' })
  @IsString()
  @IsNotEmpty({ message: 'Поле lat не может быть пустым' })
  lat: string;

  @ApiProperty({ description: 'Долгота', example: '30.5234' })
  @IsString()
  @IsNotEmpty({ message: 'Поле lng не может быть пустым' })
  lng: string;

  @ApiProperty({ description: 'Заголовок', example: 'My Marker' })
  @IsString()
  @IsNotEmpty({ message: 'Поле title не может быть пустым' })
  title: string;

  @ApiPropertyOptional({ description: 'Адрес', example: 'ул. Крещатик, 1' })
  @IsString()
  @IsOptional()
  adress?: string;

  @ApiPropertyOptional({ description: 'Телефон', example: '+380123456789' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Путь к файлу', example: 'uploads/markers/image.png' })
  @IsString()
  @IsOptional()
  path?: string;
}
