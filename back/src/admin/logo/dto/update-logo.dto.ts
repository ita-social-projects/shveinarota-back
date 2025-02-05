import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLogoDto {
  @ApiPropertyOptional({ description: 'Updated path to the partner logo', example: 'uploads/partners/new_logo.png' })
  @IsString()
  @IsOptional()
  path1: string; // Path

  @ApiPropertyOptional({ description: 'Updated path to the partner logo', example: 'uploads/partners/new_logo.png' })
  @IsString()
  @IsOptional()
  path2: string; // Path
}
