import { IsArray, ArrayNotEmpty, ArrayUnique, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderTeamsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  ids: number[];
}
