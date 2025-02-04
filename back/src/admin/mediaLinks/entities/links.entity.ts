import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['url']) // Указываем массив полей, которые должны быть уникальными
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  path: string; // Путь

  @Column({ type: 'varchar', length: 255 })
  title: string; // Название

  @Column({ type: 'varchar', length: 255, nullable: false })
  url: string; // URL (уникальное поле)
}
