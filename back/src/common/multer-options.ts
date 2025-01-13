import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

export const multerOptions = (destinationFolder: string) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `./uploads/${destinationFolder}`; // Путь к папке назначения

      // Проверяем существование папки
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true }); // Создаем папку, если она отсутствует
      }

      cb(null, uploadPath); // Сохраняем файлы в указанную папку
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // Получаем расширение файла
      const filename = `${uuidv4()}${ext}`; // Генерируем уникальное имя файла
      cb(null, filename); // Устанавливаем имя файла
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // Допустимые типы файлов
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Разрешаем загрузку файла
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed!'), false); // Отклоняем файл
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Ограничение размера файла: 5 MB
  },
});
