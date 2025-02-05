import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogoDto {
  @ApiPropertyOptional({ description: 'Path to the partner logo', example: 'uploads/partners/logo.png' })
  @IsString()
  @IsOptional()
  path1: string; // Path

  @ApiPropertyOptional({ description: 'Path to the partner logo', example: 'uploads/partners/logo.png' })
  @IsString()
  @IsOptional()
  path2: string; // Path
}
