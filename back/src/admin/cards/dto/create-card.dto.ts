import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty({ message: 'Название карточки (title) не может быть пустым' })
  title: string; // Название карточки

  @IsString()
  @IsOptional()
  description?: string; // Описание карточки (опционально)

  @IsString()
  @IsOptional()
  path?: string; // Путь к файлу изображения, теперь опциональный
}