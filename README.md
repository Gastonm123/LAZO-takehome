# LAZO — Compliance Obligations Tracker

Sistema full-stack para seguir obligaciones de compliance: API Express + PostgreSQL y frontend Next.js.

| Parte | Carpeta | Puerto default |
|-------|---------|----------------|
| Backend | `backend-express/` | `5000` |
| Frontend | `frontend/` | `3000` |
| Base de datos | `database/compose.yml` | Postgres `5432` |

Documentación de decisiones: [DECISIONS.md](DECISIONS.md).  
Resumen del frontend: [frontend/README.md](frontend/README.md).

## Tiempo invertido

Este trabajo se realizó en **8 horas**.

---

## Puesta en marcha (completo)

```bash
# 1. Base de datos
docker compose -f database/compose.yml up -d

# 2. Backend
cd backend-express
cp .env.example .env
npm install
npm run seed
npm run dev          # http://localhost:5000/api/v1

# 3. Frontend (otra terminal)
cd frontend
cp .env.example .env
npm install
npm run dev          # http://localhost:3000
```

Frontend `.env`:

```env
API_URL=http://localhost:5000/api/v1
USE_MOCK_DATA=false
NEXT_PUBLIC_DEFAULT_LOCALE=es
```

Con `USE_MOCK_DATA=true` el frontend usa datos en memoria sin backend.

---

## Backend (`backend-express/`)

### Stack

- **Express** + **TypeScript** (`tsx`)
- **Sequelize** + **PostgreSQL**
- **Zod** en el límite HTTP
- Capas: rutas → API de dominio (`Obligation`, `ObligationLogic`) → modelos ORM

### Estructura

```
backend-express/src/
├── api/              # dominio: obligation, obligationAudit, dashboard
├── routes/           # HTTP: /dashboard, /obligations
├── models/           # Sequelize
├── schemas/          # Zod (contrato API)
├── middleware/       # asyncHandler, errorHandler
├── lib/              # orm, errors, logging
├── data/             # mockups para seeder
├── seeder.ts
└── server.ts
```

Imports ESM con extensión `.js`. Alias `@/` resuelto por `tsx`.

### API (`/api/v1`)

#### Dashboard

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/dashboard/summary` | KPIs + hasta 10 próximos vencimientos |

#### Obligations

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/obligations` | Lista (`search`, `order`, `direction`) |
| `GET` | `/obligations/:id` | Detalle (`ObligationPublicSchema`) |
| `POST` | `/obligations` | Crear → `{ obligationId }` |
| `PATCH` | `/obligations/:id` | Actualización parcial |
| `DELETE` | `/obligations/:id` | Eliminar (204) |
| `POST` | `/obligations/:id/transitions` | Cambio de estado `{ state }` |
| `GET` | `/obligations/:id/audit` | Historial por campo |

**Lectura pública:** campo `state` (no `status`), `companyTaxId` enmascarado, `createdAt` / `updatedAt` incluidos, `overdue` calculado.

**Quirk conocido:** `GET .../audit` responde con `JSON.stringify(array)`; el frontend hace doble parse.

### Reglas de dominio (`ObligationLogic`)

- Máquina de estados en el backend; transiciones inválidas → `400`
- `submitted` con `requiresDocument` exige `documentUrl`
- `overdue` derivado (no persistido)
- Audit por cada campo cambiado + transiciones de `state`
- Operaciones críticas en transacción Sequelize
- Optimistic locking (`version`) → `409 SynchError`

### Errores HTTP

| Clase | HTTP |
|-------|------|
| `InvalidCall` | 400 |
| `NotFoundError` | 404 |
| `SynchError` | 409 |
| `DatabaseError` | 500 |

---

## Frontend (`frontend/`)

### Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS**
- **Redux Toolkit** — búsqueda y orden (estado UI efímero)
- **Server Actions** — mutaciones y lectura inicial
- **react-i18next** — ES / EN (switch en footer)
- **Zod** — schemas copiados del backend

### Arquitectura de datos

```
UI / Server Actions
       ↓
getObligationClient()  →  HttpObligationsClient | MockObligationsClient
       ↓                        ↑
ObligationLogic (isOverdue, parseo Zod, payloads)
       ↓
Backend HTTP  |  Mock en memoria
```

Clases en `src/lib/logic/obligation/`:

| Clase | Rol |
|-------|-----|
| `ObligationLogic` | Parseo audit, `safeParse` de formularios |
| `HttpObligationsClient` | `fetch` al backend |
| `MockObligationsClient` | Datos locales para desarrollo |
| `ObligationsClient` | Clase abstracta — contrato único |

Los schemas Zod viven en `src/schemas/` (copia del backend). No hay capa “repository”.

### Pantallas

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard (KPIs + tabla próximos vencimientos) |
| `/obligations` | Listado, búsqueda, orden, botón crear |
| `/obligations/new` | Alta |
| `/obligations/[id]` | Detalle, audit agrupado, transiciones, eliminar |
| `/obligations/[id]/edit` | Edición |

### Contrato UI ↔ API

- Frontend usa **`state`** (alineado al backend)
- Botones de transición: tabla estática `NEXT_STATES` + labels `TRANSITION_ACTIONS` (solo presentación; validación en backend)
- Audit: agrupado por `date` ISO idéntico, más reciente arriba; campos traducidos, estados/fechas/booleanos formateados
- Formularios: `safeParse` Zod al submit; omite `companyTaxId` y `description` vacíos en PATCH; tax id enmascarado solo como placeholder en edición
- Tipos de obligación: valores opacos (texto libre, sin traducir)
- Loaders: `app/loading.tsx`, `app/obligations/loading.tsx`, submit en `ObligationForm`

---

## Testing

Stack: **Vitest** en backend y frontend. Backend además usa **supertest**; frontend usa **Testing Library** + jsdom.

### Comandos

```bash
cd backend-express && npm install && npm run test:run
cd frontend && npm install && npm run test:run
# watch mode: npm run test
```

### Backend (`backend-express/`)

| Archivo | Tipo | Qué cubre |
|---------|------|-----------|
| `src/api/obligation.logic.test.ts` | Unit | `ObligationLogic`: overdue, transiciones, validateUpdate |
| `src/schemas/obligationSchema.test.ts` | Unit | Zod: estados, tax id enmascarado, coerción de fechas |
| `src/test/api.integration.test.ts` | HTTP | Dashboard, list, detalle enmascarado, 404, transición inválida |

**Config:** `vitest.config.ts`, setup en `src/test/setup.ts`.

**App para tests:** Express vive en `src/app.ts` (sin `listen`); `server.ts` solo arranca el puerto al ejecutarse directo.

**Integración HTTP:** requiere Postgres + seed. Si no hay conexión, el bloque `"API integration"` se salta con `describe.skipIf`. Para correrlo:

```bash
docker compose -f database/compose.yml up -d
cd backend-express && npm run seed && npm run test:run
```

### Frontend (`frontend/`)

| Archivo | Qué cubre |
|---------|-----------|
| `src/lib/logic/obligation/ObligationLogic.test.ts` | Overdue, parseAudit (incl. doble JSON del backend), payloads |
| `src/lib/logic/obligation/MockObligationsClient.test.ts` | list, getById, create, transition (sin red) |
| `src/components/detail/transitionActions.test.ts` | `NEXT_STATES`, `TRANSITION_ACTIONS` |
| `src/components/ui/StateBadge.test.tsx` | Render + i18n mockeado |

**Config:** `vitest.config.ts` (jsdom), setup en `src/test/setup.ts` (jest-dom).

**Nota:** en tests importar clases concretas (`ObligationLogic.ts`, `MockObligationsClient.ts`), no `@/lib/logic/obligation/index.ts` porque tiene `import "server-only"`.

### Pendiente

- E2E con Playwright
- Tests de `HttpObligationsClient` (mock `fetch`)
- RTL para `AuditTrail`, `ObligationForm`
- supertest: conflictos 409 (optimistic lock)

### Problemas frecuentes

- **Integración skipped:** Postgres apagado o `.env` mal configurado.
- **Terminal sin output en Cursor:** ejecutar en WSL/PowerShell externo, p. ej. `wsl -e bash -lc "cd /home/gaston/LAZO/frontend && npm run test:run"`.

---

## Mejoras pendientes

- E2E con Playwright (opcional)
- Búsqueda/orden server-side en frontend con skeleton optimista
- Endpoint audit: responder JSON array directo (sin `JSON.stringify`)
- Feedback de errores de formulario más rico

---

## Otros documentos

- `DECISIONS.md` — decisiones de diseño (incluye testing)
- `frontend/README.md` — resumen del frontend
- `INPUT.md` — historial de instrucciones
