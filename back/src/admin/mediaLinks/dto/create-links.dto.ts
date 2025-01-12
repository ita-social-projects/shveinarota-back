import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatelinkDto {
  @IsString()
  @IsOptional() // Путь будет задаваться автоматически
  path: string; // Путь

  @IsString()
  @IsOptional() // Путь будет задаваться автоматически
  title: string; // Путь

  @IsString()
  @IsOptional() // Путь будет задаваться автоматически
  url: string; // Путь
}
