import { ApiProperty } from '@nestjs/swagger';
import { CreateDetailDto } from '../create-detail.dto';

export class SubcategoryResponseDto {
  @ApiProperty({ description: 'ID подкатегории', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название подкатегории', example: 'Рубашки' })
  subcategory_name: string;

  @ApiProperty({ description: 'Детали подкатегории', type: CreateDetailDto })
  detail: CreateDetailDto;
}
