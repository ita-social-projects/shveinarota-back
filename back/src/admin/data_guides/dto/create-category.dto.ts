import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Назва категорії',
    example: 'Швейне обладнання',
  })
  @IsNotEmpty({ message: 'Поле "category" є обовʼязковим для заповнення' })
  @IsString({ message: 'Поле "category" повинно бути рядком' })
  category: string;
}
