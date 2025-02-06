import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSlideDto {
  @ApiPropertyOptional({ description: 'Path to the slide image', example: 'uploads/slides/image.png' })
  @IsString()
  @IsOptional()
  path: string; // Path

  @ApiPropertyOptional({ description: 'Title of the slide', example: 'Welcome to our platform!' })
  @IsString()
  @IsOptional()
  title: string; // Title

  @ApiPropertyOptional({ description: 'Title of the slide', example: 'Welcome to our platform!' })
  @IsString()
  @IsOptional()
  title_en: string; // Title


  @ApiPropertyOptional({ description: 'Text content of the slide', example: 'Discover our latest features' })
  @IsString()
  @IsOptional()
  text: string; // Text

  @ApiPropertyOptional({ description: 'Text content of the slide', example: 'Discover our latest features' })
  @IsString()
  @IsOptional()
  text_en: string; // Text
}
