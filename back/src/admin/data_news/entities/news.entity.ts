import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type ParagraphText = {
  text: string;
  bold: boolean;
  italic: boolean;
};

export type ContentBlock =
  | { type: 'image'; url: string; alt: string }
  | { type: 'paragraph'; children: ParagraphText[] };

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  // Ukrainian tags
  @Column('simple-array')
  tagsUk: string[];

  // English tags
  @Column('simple-array', { nullable: true })
  tagsEn?: string[];

  // Ukrainian title
  @Column()
  titleUk: string;

  // English title
  @Column({ nullable: true })
  titleEn?: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  // Ukrainian content blocks
  @Column('json')
  contentUk: ContentBlock[];

  // English content blocks
  @Column('json', { nullable: true })
  contentEn?: ContentBlock[];
}
