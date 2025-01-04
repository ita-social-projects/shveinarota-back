import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateMarkerDto {
  @IsString()
  @IsOptional() // Широта может быть необязательной
  lat?: string;

  @IsString()
  @IsOptional() // Долгота может быть необязательной
  lng?: string;

  @IsString()
  @IsOptional() // Заголовок может быть необязательным
  title?: string;

  @IsString()
  @IsOptional() // Адрес может быть необязательным
  adress?: string;

  @IsString()
  @IsOptional() // Телефон может быть необязательным
  phone?: string;

  @IsString()
  @IsOptional() // Путь может быть необязательным
  path?: string;
}
