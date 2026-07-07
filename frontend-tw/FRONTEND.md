# Frontend Tailwind — `frontend-tw/`

Versión del frontend con **Tailwind CSS** (sin react-bootstrap). Vive en carpeta separada de `frontend/` (Bootstrap).

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 App Router |
| UI | React 19 + TypeScript strict |
| Estilos | **Tailwind CSS** + componentes propios mínimos |
| Iconos | lucide-react |
| Datos | **Server Actions** (`src/actions/obligations.ts`) |
| Estado UI global | Redux Toolkit (búsqueda + orden) |
| i18n | react-i18next (es/en) |
| Errores | react-toastify |

## Sin capa API en el cliente

Toda la comunicación con backend/mock ocurre en el servidor:

```
Server Action → obligations-repository (server-only) → backend HTTP o mock
```

Acciones disponibles:
- `getDashboardSummary()`
- `getObligations()`
- `getObligationById(id)`
- `deleteObligation(id)`
- `transitionObligation(id, status)`

## Variables de entorno (`.env`)

```env
API_URL=http://localhost:8000/api/v1
USE_MOCK_DATA=true
NEXT_PUBLIC_DEFAULT_LOCALE=es
```

Variables **solo servidor** (`API_URL`, `USE_MOCK_DATA`) — no se exponen al browser.

## Pantallas

Igual que la versión Bootstrap:
- **Dashboard** — KPIs en 2 filas + tabla próximos 10 vencimientos
- **Obligaciones** — tabla, buscador, orden, colores success/warning/danger
- **Detalle** — tipo, título, estado flotante, datos, audit trail, acciones

## Componentes UI (Tailwind)

Primitivos propios en `src/components/ui/`:
- `Button`, `Badge`, `Card`, `StatCard`, `LoadingSpinner`
- `StatusBadge`, `DueDateBadge`

Layout: `Header`, `Footer`, `MainLayout`

## Lo que no usa Server Actions (y por qué)

| Funcionalidad | Motivo |
|---------------|--------|
| Búsqueda y orden (Redux) | Estado efímero del cliente; cambia en cada tecla sin round-trip |
| react-toastify | Solo corre en browser; se dispara después de `await` una Server Action |
| react-i18next | Requiere Client Components y hooks |
| `router.push` / `router.refresh` | Navegación cliente post-mutación |

## Cómo levantar

```bash
cd frontend-tw
npm install
npm run dev
```

## Diferencias vs `frontend/`

| | `frontend/` | `frontend-tw/` |
|---|-------------|----------------|
| Componentes | react-bootstrap | Tailwind + primitivos propios |
| Datos | Capa `lib/api` + fetch cliente | Server Actions |
| Env | `NEXT_PUBLIC_*` | `API_URL` / `USE_MOCK_DATA` server-side |

## Pendiente

- Formularios crear/editar obligación
- Tests de comportamiento
- Selector de idioma en UI
