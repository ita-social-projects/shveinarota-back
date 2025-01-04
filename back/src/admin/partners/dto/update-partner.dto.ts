import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdatePartnerDto {
  
  @IsString()
  @IsOptional() // Путь может быть необязательным
  path: string;
}
