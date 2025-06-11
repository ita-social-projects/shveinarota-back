import { IsArray, ArrayNotEmpty, ArrayUnique, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderPartnersDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  ids: number[];
}
