import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMarkerDto {
  @IsString()
  @IsNotEmpty({ message: 'Поле lat не може бути пустим' })
  lat: string; // Широта

  @IsString()
  @IsNotEmpty({ message: 'Поле lng не може бути пустим' })
  lng: string; // Долгота

  @IsString()
  @IsNotEmpty({ message: 'Поле title не може бути пустим' })
  title: string; // Заголовок

  @IsString()
  @IsOptional() // Адрес может быть необязательным
  adress?: string; // Адрес

  @IsString()
  @IsOptional() // Телефон может быть необязательным
  phone?: string; // Номер телефона

  @IsString()
  @IsOptional() // Путь будет задаваться автоматически
  path?: string; // Путь
}
