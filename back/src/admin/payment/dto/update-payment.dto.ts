import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    description: 'Текст платіжної інформації',
    example: 'Оплата послуг за підпискою',
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({
    description: 'URL для оплати або інформації',
    example: 'https://example.com/payment',
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: 'Шлях до файлу або ресурсу',
    example: '/uploads/payments/payment-receipt.pdf',
  })
  @IsString()
  @IsOptional()
  path?: string;
}
