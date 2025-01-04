import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSlideDto {
  @IsString()
  @IsOptional() // Путь будет задаваться автоматически
  path: string; // Путь

  @IsString()
  @IsOptional() // Путь будет задаваться автоматически
  title: string; // Путь

  @IsString()
  @IsOptional() // Путь будет задаваться автоматически
  text: string; // Путь
}
