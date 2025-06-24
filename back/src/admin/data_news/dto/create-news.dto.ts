import {
  IsArray,
  IsString,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { ImageBlockDto, ParagraphBlockDto } from './content-block.dto';

export type ContentBlockDto = ImageBlockDto | ParagraphBlockDto;

@ApiExtraModels(ImageBlockDto, ParagraphBlockDto)
export class CreateNewsDto {
  @ApiProperty({
    type: [String],
    example: ['Допомога армії', 'Волонтерство'],
    description: 'Теги українською',
  })
  @IsArray()
  @IsString({ each: true })
  tagsUk: string[];

  @ApiProperty({
    type: [String],
    example: ['ArmySupport', 'Volunteering'],
    description: 'Теги англійською',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagsEn?: string[];

  @ApiProperty({ example: 'Передано бронежилети до зони бойових дій', description: 'Заголовок українською' })
  @IsString()
  @IsNotEmpty()
  titleUk: string;

  @ApiProperty({ example: 'Body armor delivered to combat zone', description: 'Заголовок англійською', required: false })
  @IsString()
  @IsOptional()
  titleEn?: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-06-01T00:00:00Z',
    description: 'Дата створення',
  })
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    description: 'Контент українською (зображення та абзаци)',
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(ImageBlockDto) },
        { $ref: getSchemaPath(ParagraphBlockDto) },
      ],
    },
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(
    () => Object,
    {
      discriminator: {
        property: 'type',
        subTypes: [
          { name: 'image', value: ImageBlockDto },
          { name: 'paragraph', value: ParagraphBlockDto },
        ],
      },
      keepDiscriminatorProperty: true,
    },
  )
  contentUk: ContentBlockDto[];

  @ApiProperty({
    description: 'Контент англійською (зображення та абзаци)',
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(ImageBlockDto) },
        { $ref: getSchemaPath(ParagraphBlockDto) },
      ],
    },
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(
    () => Object,
    {
      discriminator: {
        property: 'type',
        subTypes: [
          { name: 'image', value: ImageBlockDto },
          { name: 'paragraph', value: ParagraphBlockDto },
        ],
      },
      keepDiscriminatorProperty: true,
    },
  )
  @IsOptional()
  contentEn?: ContentBlockDto[];
}
