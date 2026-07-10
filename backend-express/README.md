# Backend — LAZO

API REST para el **Compliance Obligations Tracker**. Setup full-stack: [README.md](../README.md). Decisiones: [DECISIONS.md](../DECISIONS.md).

## Stack

Express · TypeScript (`tsx`) · Sequelize · PostgreSQL · Zod · Vitest · Supertest

## Arranque (desarrollo)

```bash
cp .env.example .env
npm install
docker compose -f ../database/compose.yml up -d   # desde la raíz del repo
npm run seed
npm run dev    # http://localhost:5000/api/v1
```

### Produccion

```bash
npm run build
npm start      # node dist/server.js
```

Requiere `.env` y Postgres (igual que desarrollo). Usar `NODE_ENV=production`.

### Variables de entorno (`.env`)

| Variable | Descripción |
|----------|-------------|
| `DB_HOST` | Host Postgres |
| `DB_PORT` | Puerto Postgres |
| `DB_USERNAME` | Usuario |
| `DB_PASSWORD` | Contraseña |
| `DB_DATABASE` | Nombre de la base |
| `BACKEND_PORT` | Puerto HTTP (default `5000`) |
| `CORS_ORIGINS` | Orígenes permitidos, separados por coma |

## Scripts

| Comando | Uso |
|---------|-----|
| `npm run dev` | Servidor con recarga (`tsx src/server.ts`) |
| `npm run seed` | Carga datos mock en Postgres |
| `npm run test` | Vitest en modo watch |
| `npm run test:run` | Vitest una sola pasada |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Servidor de produccion (`node dist/server.js`; correr `build` antes) |

## Estructura

```
src/
├── api/              # Dominio: Obligation, ObligationLogic, Dashboard, ObligationAudit
├── routes/           # HTTP: /dashboard, /obligations
├── models/           # Sequelize (Obligation, ObligationAudit)
├── schemas/          # Zod — contrato de la API
├── middleware/       # asyncHandler, errorHandler
├── lib/              # orm, errors, logging
├── data/             # Mockups para el seeder
├── app.ts            # Express sin listen (tests con supertest)
├── server.ts         # Arranque del puerto
└── seeder.ts
```

- **ESM:** `"type": "module"` en `package.json`; imports con extensión `.js`.
- **Alias `@/`:** resuelto en runtime por `tsx` (`tsconfig.json` → `src/*`).

## API (`/api/v1`)

### Dashboard

| Método | Ruta | Respuesta |
|--------|------|-----------|
| `GET` | `/dashboard/summary` | KPIs + hasta 10 próximos vencimientos (`DashboardSchema`) |

### Obligations

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/obligations` | Lista pública (`ObligationPublicSchema[]`) |
| `GET` | `/obligations/:id` | Detalle público |
| `POST` | `/obligations` | Crear → `{ obligationId }` |
| `PATCH` | `/obligations/:id` | Actualización parcial |
| `DELETE` | `/obligations/:id` | Eliminar (204) |
| `POST` | `/obligations/:id/transitions` | Cambio de estado `{ state }` |
| `GET` | `/obligations/:id/audit` | Historial por campo (JSON array) |

**Query params en listado** (schema `ObligationSearch`, preparado pero hoy devuelve todas):

- `search`, `order` (`createdAt` \| `updatedAt` \| `dueDate`), `direction` (`ASC` \| `DEC`)

### Lectura pública (`ObligationPublicSchema`)

- Campo **`state`** (no `status`).
- `companyTaxId` enmascarado (`••••1234`).
- `createdAt`, `updatedAt`, `overdue` (calculado con `ObligationLogic.isOverdue()`).

### Audit (`GET .../audit`)

Array JSON de entradas validadas con `ObligationAuditPublicSchema` (`field`, `from`, `to`, `date`). Los cambios de `companyTaxId` se devuelven enmascarados.

## Dominio (`ObligationLogic` + clase `Obligation`)

### Máquina de estados

```
pending → in_progress → submitted → done
              ↑    ↓         ↑    ↓
              └────┘         └────┘ (rework / reopen)
```

| Desde | Hacia |
|-------|-------|
| `pending` | `in_progress` |
| `in_progress` | `submitted`, `pending` |
| `submitted` | `done`, `in_progress` |
| `done` | `in_progress` |

- Transición inválida → `400 InvalidCall`.

### Invariante doc-gated

No se puede pasar al estado `submitted` si `requiresDocument: true` y no se cargó ningún documento. Para preservar la invariante, una vez que el documento se encuentra `submitted` o `done`, no es posible cambiar `requiresDocument` o `documentUrl`.

### Overdue

Derivado en lectura: vencido si la fecha de vencimiento es anterior a hoy y el estado no es `submitted` ni `done`.

### Audit trail

- Un registro por campo modificado en cada update.
- Registro de `state` en cada transición.
- Update + audit en la **misma transacción** Sequelize.

### Optimistic locking

Columna `version` en `obligations`. Conflicto de concurrencia → `409 SynchError` (`OptimisticLockError` de Sequelize).

## Errores HTTP

Middleware centralizado en `middleware/errorMiddleware.ts`. Las rutas delegan con `asyncHandler` + `next(error)`.

| Clase | HTTP |
|-------|------|
| `InvalidCall` | 400 |
| `NotFoundError` | 404 |
| `SynchError` | 409 |
| Otros / Sequelize | 500 |

Respuesta JSON: `{ message, stack? }` (`stack` solo fuera de producción).

## Testing

Detalle de archivos y E2E frontend: [README.md § Testing](../README.md#testing).

```bash
npm run test:run
npm run test    # watch
```

Integración HTTP requiere Postgres + seed (`describe.skipIf` si no hay conexión). `src/app.ts` exporta la app sin `listen` para supertest.

## Frontend

Consume esta API vía Server Actions → `HttpObligationsClient`. Ver [frontend/README.md](../frontend/README.md).
