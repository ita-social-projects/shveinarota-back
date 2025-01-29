import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    description: 'Назва картки',
    example: 'My New Card',
  })
  @IsString()
  @IsNotEmpty({ message: 'Назва картки (title) не може бути порожньою' })
  title: string;

  @ApiProperty({
    description: 'Опис картки',
    example: 'This is a detailed description of the card.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'URL зображення',
    example: '/uploads/cards/card-image.jpg',
    required: true, // Тепер обов’язкове поле
  })
  @IsString()
  @IsNotEmpty({ message: 'Шлях до зображення є обов’язковим' })
  path: string; // Поле зроблено обов’язковим
}
