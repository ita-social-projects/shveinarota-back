import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads/cards', // Путь для сохранения файлов
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // Получаем расширение файла
      const filename = `${uuidv4()}${ext}`; // Генерируем уникальное имя
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['path/jpeg', 'path/png', 'path/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
};
