import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status_en?: string;

  @Column({ type: 'text', nullable: true})
  name: string;

  @Column({ type: 'text', nullable: true })
  name_en?: string;

  @Column({ type: 'varchar', length: 255 })
  path: string;
}