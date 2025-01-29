import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCardDto {
  @ApiPropertyOptional({
    description: 'Назва картки',
    example: 'Оновлена назва картки',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Назва картки (title) не може бути порожньою' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Опис картки',
    example: 'Оновлений опис картки.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Додайте URL фото',
    example: '/uploads/cards/updated-image.jpg',
  })
  @IsString()
  @IsOptional()
  path?: string;
}
