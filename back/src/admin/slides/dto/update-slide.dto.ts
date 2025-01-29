import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSlideDto {
  @ApiPropertyOptional({ description: 'Оновлений шлях до зображення слайду', example: 'uploads/slides/new_image.png' })
  @IsString()
  @IsOptional()
  path?: string; // Шлях

  @ApiPropertyOptional({ description: 'Оновлений заголовок слайду', example: 'Досліджуйте нові оновлення!' })
  @IsString()
  @IsOptional()
  title?: string; // Заголовок

  @ApiPropertyOptional({ description: 'Оновлений текстовий вміст слайду', example: 'Дізнайтеся більше про наші послуги' })
  @IsString()
  @IsOptional()
  text?: string; // Текст
}
