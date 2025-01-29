import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSlideDto {
  @ApiPropertyOptional({ description: 'Шлях до зображення слайду', example: 'uploads/slides/image.png' })
  @IsString()
  @IsOptional()
  path: string; // Шлях

  @ApiPropertyOptional({ description: 'Заголовок слайду', example: 'Ласкаво просимо на нашу платформу!' })
  @IsString()
  @IsOptional()
  title: string; // Заголовок

  @ApiPropertyOptional({ description: 'Текстовий вміст слайду', example: 'Дізнайтеся про наші останні функції' })
  @IsString()
  @IsOptional()
  text: string; // Текст
}
