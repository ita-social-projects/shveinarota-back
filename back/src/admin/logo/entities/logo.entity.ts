import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Logo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  path1: string; // Путь

  @Column({ type: 'varchar', length: 255 })
  path2: string; // Путь
}
