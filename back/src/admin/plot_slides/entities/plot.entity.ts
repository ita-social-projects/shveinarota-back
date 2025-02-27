import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  path: string; // Путь

  @Column({ type: 'varchar', length: 255 })
  title: string; // Путь

  @Column({ type: 'varchar', length: 255, nullable: true })
  title_en: string; // Путь

  @Column({ type: 'varchar', length: 2000 })
  url: string; // Путь

}
