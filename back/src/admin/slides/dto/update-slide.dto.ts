import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSlideDto {
  @ApiPropertyOptional({ description: 'Updated path to the slide image', example: 'uploads/slides/new_image.png' })
  @IsString()
  @IsOptional()
  path?: string; // Path

  @ApiPropertyOptional({ description: 'Updated title of the slide', example: 'Explore new updates!' })
  @IsString()
  @IsOptional()
  title?: string; // Title

  @ApiPropertyOptional({ description: 'Updated title of the slide', example: 'Explore new updates!' })
  @IsString()
  @IsOptional()
  title_en?: string; // Title

  @ApiPropertyOptional({ description: 'Updated text content of the slide', example: 'Learn more about our services' })
  @IsString()
  @IsOptional()
  text?: string; // Text

  @ApiPropertyOptional({ description: 'Updated text content of the slide', example: 'Learn more about our services' })
  @IsString()
  @IsOptional()
  text_en?: string; // Text
}
