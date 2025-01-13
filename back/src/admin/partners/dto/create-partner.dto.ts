import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartnerDto {
  @ApiPropertyOptional({ description: 'Path to the partner logo', example: 'uploads/partners/logo.png' })
  @IsString()
  @IsOptional()
  path: string; // Path
}
