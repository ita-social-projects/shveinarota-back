import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Link{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  path: string; // Путь

  @Column({ type: 'varchar', length: 255 })
  title: string; // Путь

  @Column({ type: 'varchar', length: 255 })
  url: string; // Путь
}
