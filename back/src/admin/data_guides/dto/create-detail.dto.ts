import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateDetailDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsOptional()
  lekala?: string[]; // Массив строк

  @IsUrl()
  @IsOptional()
  videoUrl?: string; // URL

  @IsArray()
  @IsOptional()
  example?: string[]; // Массив строк

  @IsString()
  @IsOptional()
  details?: string; // Длинный текст

  @IsString()
  @IsOptional()
  summary?: string; // Краткое описание

  @IsArray()
  @IsOptional()
  authors?: string[]; // Массив авторов

  @IsString()
  @IsOptional()
  category?: string; // Категория
}
