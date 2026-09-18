# Contract.md

Источник контракта: `book.yaml`, OpenAPI 3.0.3, API `/api/v1`.

## Endpoint-группы

- `POST /auth/login` — JWT авторизация.
- `GET/POST /books`, `GET/PUT/PATCH/DELETE /books/{id}` — каталог и CRUD книг.
- `GET/POST /authors`, `GET/PUT/DELETE /authors/{id}` — авторы и CRUD авторов.
- `GET /reports/top-authors?year=YYYY` — публичный TOP-10.

Публичные GET-методы доступны гостю. Mutating-методы требуют Bearer JWT.

## API gap

OpenAPI 1.0.0 не содержит endpoint для:

- создания подписки;
- удаления подписки;
- проверки подписки.

На фронтенде подписка реализована демонстрационной заглушкой: нажатие открывает модальное окно «Вы подписаны» и не выполняет сетевой запрос.

Для книги используется `POST/PUT multipart/form-data` с `cover`. Редактирование без новой обложки выполняется через доступный `PATCH application/json`.
