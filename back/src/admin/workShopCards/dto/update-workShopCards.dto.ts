import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateWorkShopCardsDto {
  @ApiPropertyOptional({
    description: 'Назва картки українською',
    example: 'Оновлена назва картки',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Назва картки англійською',
    example: 'Updated Card Title',
  })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiPropertyOptional({
    description: 'Опис картки українською',
    example: 'Оновлений опис картки.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Опис картки англійською',
    example: 'Updated description for the card.',
  })
  @IsString()
  @IsOptional()
  description_en?: string;

  @ApiPropertyOptional({
    description: 'Розклад (масив рядків)',
    example: ['Ср 12:00–14:00', 'Чт 16:00–18:00'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty({
    message: 'При оновленні schedule не може бути порожнім масивом',
  })
  @IsString({ each: true, message: 'Кожен елемент schedule має бути рядком' })
  @IsOptional()
  schedule?: string[];

  @ApiPropertyOptional({
    description: 'Посилання (масив рядків)',
    example: ['https://…', 'https://…'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty({
    message: 'При оновленні link не може бути порожнім масивом',
  })
  @IsString({ each: true, message: 'Кожен елемент link має бути рядком' })
  @IsOptional()
  link?: string[];
}
