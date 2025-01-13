import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePartnerDto {
  @ApiPropertyOptional({ description: 'Updated path to the partner logo', example: 'uploads/partners/new_logo.png' })
  @IsString()
  @IsOptional()
  path: string; // Path
}
