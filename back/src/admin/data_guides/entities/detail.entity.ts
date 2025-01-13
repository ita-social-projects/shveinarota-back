import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Entity('details')
export class Detail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'simple-array', nullable: true })
  lekala: string[]; // Список строк, например ["uploads/lacoloi.png"]

  @Column({ type: 'varchar', length: 500, nullable: true })
  videoUrl: string; // URL на видео

  @Column({ type: 'simple-array', nullable: true })
  example: string[]; // Список примеров, например ["/images/example1.jpg"]

  @Column({ type: 'text', nullable: true })
  details: string; // Описание материалов

  @Column({ type: 'text', nullable: true })
  summary: string; // Краткое описание

  @Column({ type: 'simple-array', nullable: true })
  authors: string[]; // Список авторов, например ["Автор 1", "Автор 2"]

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string; // Категория (например, "КӀеродяг, Бронеодяг")

  @OneToOne(() => Subcategory, (subcategory) => subcategory.detail)
  subcategory: Subcategory; // Связь с подкатегорией
}
