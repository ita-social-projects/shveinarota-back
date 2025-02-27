import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlotDto {
  @ApiPropertyOptional({ description: 'Шлях до зображення слайду', example: 'uploads/slides/image.png' })
  @IsString()
  @IsOptional()
  path: string; 

  @ApiPropertyOptional({ description: 'Заголовок слайду', example: 'Ласкаво просимо на нашу платформу!' })
  @IsString()
  @IsOptional()
  title: string; 

  @ApiPropertyOptional({ description: 'Заголовок слайду', example: 'Welcome to our platform!' })
  @IsString()
  @IsOptional()
  title_en?: string | null = null;


  @ApiPropertyOptional({ description: 'Текстовий вміст слайду', example: 'Discover our latest features' })
  @IsString()
  @IsOptional()
  url: string; 
}
