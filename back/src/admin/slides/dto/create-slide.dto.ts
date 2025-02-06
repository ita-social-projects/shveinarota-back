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

  @ApiPropertyOptional({ description: 'Заголовок слайду', example: 'Welcome to our platform!' })
  @IsString()
  @IsOptional()
  title_en: string; // Заголовок (англійська)

  @ApiPropertyOptional({ description: 'Текстовий вміст слайду', example: 'Ознайомтесь з нашими останніми функціями' })
  @IsString()
  @IsOptional()
  text: string; // Текст

  @ApiPropertyOptional({ description: 'Текстовий вміст слайду', example: 'Discover our latest features' })
  @IsString()
  @IsOptional()
  text_en: string; // Текст (англійська)
}
