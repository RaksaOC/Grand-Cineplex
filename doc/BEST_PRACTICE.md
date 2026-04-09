# Best Practices Guide

A brief reference for maintaining consistency, readability, and scalability throughout the project.

---

## File & Folder Structure

- **Follow the given structure** (e.g., `components/`, `pages/`, `services/`, etc.).
- Group related files together by feature or function.
- **Keep components small and focused**. One component = one job.
- **Backend:** Use an `app/` folder under `src/` to separate role-based modules (customer, cashier, manager) from shared code.

---

## Abstraction & Independence

- **Route Registration:**
  - Register only base role prefixes (e.g., `/customer`, `/cashier`, `/manager`) in `app.ts`.
  - Each role's `routes/index.ts` should handle its own subroutes (e.g., `/movies`, `/bookings`).
  - This keeps the main app entry clean and each module independent and maintainable.

---

## Naming Conventions

### General

- Use **kebab-case** for folders: `movie-list`, `user-profile`
- Use **PascalCase** for React components: `MovieCard.tsx`, `UserForm.tsx`
- Use **camelCase** for variables and functions: `handleSubmit`, `fetchData`
- Use **UPPER_SNAKE_CASE** for constants: `MAX_RETRIES`, `API_URL`

### Backend

- **Schema/Model Files:** Use singular form + `.ts` (e.g., `Movie.ts`, `Theater.ts`)
- **File naming style:** Prefer `user.controller.ts`, `user.service.ts`, `user.routes.ts` for clarity.
  (`[entity].[layer].ts`)
- **Middleware:** Name based on action, e.g., `authMiddleware.ts`, `errorHandler.ts`

### Database (Sequelize & Drizzle)

- **Table Names:** Use plural, snake_case: `movies`, `movie_screenings`
- **Column Names:** Use snake_case: `created_at`, `updated_at`
- **Foreign Keys:** Use `entity_id` format: `movie_id`, `theater_id`
- **Enums:** Use singular form: `payment_type`, `booking_status`

---

## Module Imports

- Use **ES6 imports** (`import` / `export`) across frontend and backend.
  Yes: `import express from 'express'`
  No: `const express = require('express')`

- Avoid deep relative imports (like `../../../utils`). Use aliases or structure well.

- For Sequelize models, import from the models index file if available.
- For Drizzle schemas (legacy), import from the index file:
  Yes: `import { movies, theaters } from '../db'`
  No: `import { movies } from '../db/schema/movies'`

---

## Commenting Guidelines

- Use comments sparingly but clearly:

  - `// TODO:` – For incomplete features or pending logic
  - `// FIXME:` – For known bugs or technical debt
  - `// NOTE:` – For clarifying why something is done a specific way
  - `// HACK:` – Temporary workaround

Example:

```js
// TODO: Replace with actual validation logic
// FIXME: This throws on empty input sometimes
```

---

## API Layer (Frontend)

- Centralize API calls (e.g., in `api/[api].ts`) to avoid scattered logic.
- **Prefer utility functions** for each endpoint (not classes), e.g.:
  ```ts
  // api/customer.ts
  export async function getMovies() { ... }
  export async function bookTicket(payload) { ... }
  ```
- Centralize the API base URL (e.g., `API_BASE_URL` from `.env`).
- Use meaningful names like `getUserData()` or `submitBooking()`.
- Handle errors in the API layer or propagate them consistently.

---

## Components

- Use `components/common/` for shared elements like `Button`, `Modal`, `Input`.
- Use subfolders in `components/` to group page-specific components.
- Keep presentational and logic code cleanly separated if possible.

---

## Database (Sequelize & Drizzle)

- **Sequelize (current):**

  - Define each model in its own file under `db/models/`.
  - Use TypeScript for type safety.
  - Define associations in model files or a central index.
  - Use migrations for schema changes.

- **Drizzle (legacy, for reference):**

  - Keep each table in its own file under `db/schema/`
  - Use TypeScript for type safety
  - Define relationships explicitly

- **Query Best Practices**

  - Use prepared statements (ORM handles this)
  - Keep queries simple and focused
  - Use transactions for multiple operations
  - Handle errors appropriately

- **Type Safety**
  - Use ORM-generated types
  - Define custom types in `shared/types.ts`
  - Use enums for fixed sets of values

---

## Testing & Debugging

- Write minimal unit tests where critical (if applicable).
- Use clear console logs (remove before production).

```js
console.log("[User Fetch]", userData); // DEBUG:
```

---

## Git & Version Control

## Other Notes

- Always keep `.env` for secrets — never commit `.env` or `node_modules`.
- Prefer `.tsx` for React files and `.ts` for logic/backend.
- Write clean, predictable functions — avoid side effects.
- Use Sequelize for all new database work; Drizzle files are kept for reference only.
