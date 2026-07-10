# LAZO — Compliance Obligations Tracker

Sistema full-stack para seguir obligaciones de compliance: API Express + PostgreSQL y frontend Next.js.

| Parte | Carpeta | Puerto default |
|-------|---------|----------------|
| Backend | `backend-express/` | `5000` |
| Frontend | `frontend/` | `3000` |
| Base de datos | `database/compose.yml` | Postgres `5432` |

| Documento | Contenido |
|-----------|-----------|
| [DECISIONS.md](DECISIONS.md) | Decisiones de diseño |
| [backend-express/README.md](backend-express/README.md) | API, dominio, errores, tests backend |
| [frontend/README.md](frontend/README.md) | Arquitectura UI, rutas, reglas de presentación |

## Tiempo invertido

Este trabajo se realizó en **8 horas**.

---

## Puesta en marcha

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

Con `USE_MOCK_DATA=true` el frontend usa datos en memoria sin backend (útil para desarrollo y E2E).

---

## Backend

Express + Sequelize + PostgreSQL + Zod. Dominio en `ObligationLogic`, API en `/api/v1`.

→ [backend-express/README.md](backend-express/README.md)

---

## Frontend

Next.js 15 (App Router) + Server Actions + Zod. Acceso a datos vía `HttpObligationsClient` / `MockObligationsClient`; validación y normalización en schemas `*UiSchema` y `*FromFormSchema`.

→ [frontend/README.md](frontend/README.md)

---

## Conexion

La conexión entre Front y Back se configura con variables de entorno en `frontend/.env` y `backend-express/.env`. Por defecto Front corre en el puerto 3000 y Back en el puerto 5000.

---

## Testing

Stack: **Vitest** en backend y frontend; **supertest** (HTTP backend); **Testing Library** + jsdom (componentes frontend); **Playwright** (E2E UX con mock).

### Comandos

```bash
cd backend-express && npm run test:run
cd frontend && npm run test:run
cd frontend && npm run test:e2e          # Playwright (primera vez: npx playwright install chromium)
```

Watch mode: `npm run test` en cada carpeta. Playwright interactivo: `npm run test:e2e:ui` en `frontend/`.

**CI:** GitHub Actions (`.github/workflows/ci.yml`) corre backend (Vitest + Postgres), frontend unit y E2E en cada push y pull request.

### Backend

| Archivo | Qué cubre |
|---------|-----------|
| `src/api/obligation.logic.test.ts` | `ObligationLogic`: overdue, transiciones, **invariante doc-gated**, validateUpdate |
| `src/schemas/obligationSchema.test.ts` | Zod: estados, tax id enmascarado, fechas |
| `src/test/api.integration.test.ts` | HTTP: dashboard, list, detalle, 404, transición inválida |

Integración HTTP requiere Postgres + seed; si no hay conexión, el bloque se salta con `describe.skipIf`. App de test: `src/app.ts` (sin `listen`).

### Frontend (unit / componentes)

| Archivo | Qué cubre |
|---------|-----------|
| `src/schemas/obligationUi.test.ts` | Schemas UI, audit, payloads de formulario |
| `src/lib/logic/obligation/MockObligationsClient.test.ts` | CRUD mock sin red |
| `src/components/detail/transitionActions.test.ts` | `NEXT_STATES`, `TRANSITION_ACTIONS` |
| `src/components/ui/StateBadge.test.tsx` | Badge + i18n mockeado |

En tests unitarios importar archivos concretos de `schemas/` o `MockObligationsClient.ts`, no `lib/logic/obligation/index.ts` (`server-only`).

### E2E (frontend)

Playwright levanta `next dev` en puerto **3001** con `USE_MOCK_DATA=true` (no requiere backend ni Postgres). Ver `e2e/ux-flow.spec.ts`.

### Pendiente de cobertura

- `HttpObligationsClient` con `fetch` mockeado
- RTL para `AuditTrail`, `ObligationForm`
- supertest: conflictos 409 (optimistic lock)

### Problemas frecuentes

- **Integración skipped:** Postgres apagado o `.env` mal configurado.

---

## Mejoras pendientes

- Búsqueda/orden server-side en frontend con skeleton optimista
- Feedback de errores de formulario más rico

---

## Otros

- `INPUT.md` — historial de instrucciones del challenge
