

## Почему именно так

### Почему Book и Author — entities?

Оба проходят все критерии:
- **Собственные types:** `Book`, `BookShort`, `BookInput`, `Author`, `AuthorShort`, `AuthorInput`
- **Собственный API:** 5 endpoints каждый (CRUD + list)
- **Собственный UI:** `BookCard`, `AuthorCard`
- **Несколько consumers:** Book используется в CatalogPage, BookDetailsPage, BookEditPage, AuthorDetailsPage. Author — в AuthorsPage, AuthorDetailsPage, CatalogPage (фильтр), BookEditPage (форма)
- **Связи:** many-to-many через author_ids

### Почему Reports co-located с page?

Reports **не проходит** критерии entity:
- Один endpoint (`getTopAuthors`)
- Один composable (`useTopAuthors`) — 15 строк
- Один UI компонент (`ReportsTable`)
- Read-only (нет CRUD)
- Используется **только** в ReportsPage

Co-location = discoverability для маленького domain. Reports не является самостоятельной domain-сущностью — это просто «запрос + таблица».

**Migration trigger:** если `TopAuthor` появится на Dashboard или появится второй endpoint — тогда выделять в `entities/report/`.

### Почему Auth в `app/`, а не в `features/`?

Auth — это **application-level state**, а не конкретная feature:
- Используется в AppHeader, LoginPage, AuthorsPage, BookDetailsPage
- Это infrastructure, которая apply ко всему приложению
- Не является пользовательским сценарием (в отличие от «create book» или «view report»)

### Почему `shared/` теперь чистый?

Раньше shared содержал:
- Book/Author composables → вынесены в entities
- Book/Author API → вынесены в entities
- Auth store → вынесен в app
- BookCard/AuthorCard → вынесены в entities
- Reports → co-located с page

Теперь shared содержит только **genuinely generic** код:
- `httpClient.ts` — HTTP-клиент без domain-specific логики
- `types/` — ApiError, Pagination, ListResponse (общие для любого API)
- `ui/` — BaseButton, BaseInput, BaseSelect, BaseTextarea, Modal (generic UI)

### Почему token-guard не в shared?

`isTokenExpired()`, `saveTokenExpiry()`, `clearTokenExpiry()` — всё это **authentication domain**. Чистая функция не равна generic. «Чистота функции» отвечает на вопрос «composable or utility?», но не на вопрос «shared or domain?».

Токен expiry знает о конкретном способе аутентификации приложения → `app/lib/token-guard.ts`.

### Почему API-модули — plain functions, а не factories?

`useBooksApi()` возвращал объект с методами без причин. API-модуль не использует Vue-реактивность, не имеет state — factory-обёртка бессмысленна.

```typescript
// Было (бессмысленная factory):
export const useBooksApi = () => ({
  getBooks: (q) => request<...>(...),
})

// Стало (plain functions):
export function getBooks(q: BookQuery) { ... }
```

### Почему composable-тесты переписаны?

Старые тесты тестировали **mock-ветку** (когда `VITE_USE_MOCK=true`). После удаления mock эти тесты стали бессмысленными.

Новые тесты мокают **API layer** и тестируют реальную логику:
- Успешный fetch
- API error → error state
- Loading state transitions

---

## Файловая структура

```
src/
├── app/                            # Application-level infrastructure
│   ├── api/auth-api.ts             # Auth API (login)
│   ├── lib/token-guard.ts          # Token expiry utilities
│   ├── model/auth-store.ts         # Pinia auth store
│   ├── router/index.ts             # Router + auth guard
│   ├── App.vue                     # Root component
│   ├── main.ts                     # Entry point
│   └── styles/index.css            # Global styles
│
├── pages/                          # Route-level components
│   ├── catalog/CatalogPage.vue
│   ├── book-details/BookDetailsPage.vue
│   ├── book-edit/BookEditPage.vue
│   ├── authors/AuthorsPage.vue
│   ├── author-details/AuthorDetailsPage.vue
│   ├── login/LoginPage.vue
│   └── reports/
│       ├── ReportsPage.vue         # Co-located with small domain
│       ├── reports-api.ts          # TopAuthor API
│       ├── use-top-authors.ts      # TopAuthor composable
│       └── ui/ReportsTable.vue     # TopAuthor UI
│
├── widgets/                        # Reusable UI blocks
│   └── app-header/AppHeader.vue
│
├── entities/                       # Domain objects
│   ├── book/
│   │   ├── api/books-api.ts        # Book API (plain functions)
│   │   ├── model/
│   │   │   ├── types.ts            # Book, BookShort, BookInput
│   │   │   ├── use-book-list.ts    # List composable
│   │   │   ├── use-book-item.ts    # Item composable
│   │   │   └── use-book-mutations.ts
│   │   └── ui/BookCard.vue         # Domain-specific UI
│   │
│   └── author/
│       ├── api/authors-api.ts      # Author API (plain functions)
│       ├── model/
│       │   ├── types.ts            # Author, AuthorShort, AuthorInput
│       │   ├── use-author-list.ts
│       │   ├── use-author-item.ts
│       │   └── use-author-mutations.ts
│       └── ui/AuthorCard.vue       # Domain-specific UI
│
└── shared/                         # Domain-agnostic infrastructure
    ├── api/httpClient.ts           # Generic HTTP client
    ├── types/index.ts              # ApiError, Pagination, ListResponse, User, TopAuthor
    └── ui/                         # Generic UI components
        ├── BaseButton.vue
        ├── BaseInput.vue
        ├── BaseSelect.vue
        ├── BaseTextarea.vue
        └── Modal.vue
```
