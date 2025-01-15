# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только файлы package.json и package-lock.json из back
COPY back/package*.json ./

# Устанавливаем все зависимости (включая devDependencies)
RUN npm install

# Копируем весь проект из back в контейнер
COPY back ./

# Сборка TypeScript проекта
RUN npm run build

# Указываем переменную окружения для порта (по умолчанию 3000)
ENV PORT=3000

# Открываем порт приложения
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "run", "start:prod"]
