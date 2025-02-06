import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Назва категорії українською мовою',
    example: 'Швейне обладнання',
    required: true,
  })
  @IsNotEmpty({ message: 'Поле "category" є обовʼязковим для заповнення' })
  @IsString({ message: 'Поле "category" повинно бути рядком' })
  category: string;

  @ApiProperty({
    description: 'Назва категорії англійською мовою',
    example: 'Sewing equipment',
    required: true,
  })
  @IsNotEmpty({ message: 'Поле "category_en" є обовʼязковим для заповнення' })
  @IsString({ message: 'Поле "category_en" повинно бути рядком' })
  category_en: string;
}
