import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlotDto {
  @ApiPropertyOptional({ description: 'Оновлений шлях до зображення слайду', example: 'uploads/slides/new_image.png' })
  @IsString()
  @IsOptional()
  path?: string; 

  @ApiPropertyOptional({ description: 'Оновлений заголовок слайду', example: 'Досліджуйте нові оновлення!' })
  @IsString()
  @IsOptional()
  title?: string; 

  @ApiPropertyOptional({ description: 'Оновлений заголовок слайду', example: 'Explore new updates!' })
  @IsString()
  @IsOptional()
  title_en?: string; 

  @ApiPropertyOptional({ description: 'Оновлений текстовий вміст слайду', example: 'Learn more about our services' })
  @IsString()
  @IsOptional()
  url?: string; 
}
