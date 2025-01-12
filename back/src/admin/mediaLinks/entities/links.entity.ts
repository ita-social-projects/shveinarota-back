import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class link{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  path: string; // Путь

  @Column({ type: 'varchar', length: 255 })
  title: string; // Путь

}
