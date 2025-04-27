import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Текст платіжної інформації',
    example: 'Оплата за підписку на сервіс',
  })
  @IsString()
  @IsNotEmpty({ message: 'Текст (text) не може бути порожнім' })
  text: string;

  @ApiProperty({
    description: 'URL для переходу на сторінку оплати',
    example: 'https://example.com/payment-link',
  })
  @IsString()
  @IsNotEmpty({ message: 'URL (url) не може бути порожнім' })
  url: string;

  @ApiProperty({
    description: 'Шлях до файлу або ресурсу',
    example: '/uploads/payments/receipt.pdf',
  })
  @IsString()
  @IsNotEmpty({ message: 'Шлях до файлу (path) є обов’язковим' })
  path: string;
}
