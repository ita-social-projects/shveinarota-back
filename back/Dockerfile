# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем все зависимости (включая devDependencies)
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Сборка TypeScript проекта
RUN npm run build

# Указываем переменную окружения для порта (по умолчанию 3000)
ENV PORT=3000

# Открываем порт приложения
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "run", "start:prod"]
