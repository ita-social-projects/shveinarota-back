import { join } from 'path';

export const uploadConfig = {
  baseDir: join(__dirname, '../uploads'),
  paths: {
    cards: join(__dirname, '../uploads/cards'),
  },
};
