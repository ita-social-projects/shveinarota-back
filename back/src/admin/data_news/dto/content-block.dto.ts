import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParagraphTextDto {
  @ApiProperty({ description: 'Текстовий фрагмент абзацу' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Жирний шрифт', example: false })
  @IsBoolean()
  bold: boolean;

  @ApiProperty({ description: 'Курсивний шрифт', example: false })
  @IsBoolean()
  italic: boolean;
}

export class ImageBlockDto {
  @ApiProperty({ description: 'Тип блоку', enum: ['image'], example: 'image' })
  @IsIn(['image'])
  type: 'image';

  @ApiProperty({ description: 'URL зображення', example: '/images/news/2.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Альтернативний текст зображення', example: 'Передано бронежилети до зони бойових дій' })
  @IsString()
  alt: string;
}

export class ParagraphBlockDto {
  @ApiProperty({ description: 'Тип блоку', enum: ['paragraph'], example: 'paragraph' })
  @IsIn(['paragraph'])
  type: 'paragraph';

  @ApiProperty({
    description: 'Список текстових фрагментів блоку',
    type: [ParagraphTextDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParagraphTextDto)
  children: ParagraphTextDto[];
}