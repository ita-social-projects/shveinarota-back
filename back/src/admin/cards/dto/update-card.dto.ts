import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Название карточки (title) не может быть пустым' })
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  path?: string;
}
