import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Slide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  path: string; // Путь

  @Column({ type: 'varchar', length: 255 })
  title: string; // Путь

  @Column({ type: 'varchar', length: 255 })
  text: string; // Путь
}
