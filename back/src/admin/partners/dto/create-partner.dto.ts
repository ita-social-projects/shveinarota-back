import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsOptional() // Путь будет задаваться автоматически
  path: string; // Путь
}
