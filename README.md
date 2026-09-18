# Лист — каталог книг

Vue 3 + TypeScript + Vite + Tailwind CSS + Pinia. Реализованы публичный каталог, авторы, отчёт, JWT-вход и CRUD.

## Запуск

```bash
npm install
npm run dev
```

Скопируйте `.env.example` в `.env`. По умолчанию используется mock API. Для backend задайте `VITE_USE_MOCK=false` и `VITE_API_URL`.

Демо-вход: `reader` / `booklover`.

## Проверки

```bash
npm run build
npm run test
```

Подписка на автора — UI-заглушка, потому что endpoint отсутствует в `book.yaml`.
