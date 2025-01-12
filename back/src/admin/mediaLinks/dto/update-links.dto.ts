import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdatelinkDto {
  
  @IsString()
  @IsOptional() // Путь может быть необязательным
  path?: string;

  @IsString()
  @IsOptional() // Путь может быть необязательным
  title?: string;

  @IsString()
  @IsOptional() // Путь может быть необязательным
  url?: string;

}
