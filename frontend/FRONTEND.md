# Frontend — LAZO Compliance Obligations Tracker

Documentación del frontend activo en **`frontend-tw/`** (Tailwind + Server Actions). Alineado con `zzz/SPEC.pdf` y las instrucciones del proyecto.

> Existe una primera iteración con react-bootstrap en `frontend/` (descartada como versión principal).

## Objetivo

Interfaz del **Compliance Obligations Tracker**: dashboard de KPIs, listado con búsqueda/orden, detalle con transiciones de estado provistas por el backend, y formularios de crear/editar.

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript strict |
| Estilos | **Tailwind CSS** + componentes propios mínimos |
| Iconos | lucide-react |
| Estado global UI | Redux Toolkit (`searchQuery`, `sortField`, `sortDirection`) |
| i18n | react-i18next (es/en) |
| Notificaciones | react-toastify |
| Mutaciones / datos | **Server Actions** (`src/actions/obligations.ts`) |

## Instrucciones implementadas (pedido original)

### Layout y componentes reutilizables
- **Header**: logo mock, links Dashboard y Obligaciones a la izquierda, icono de usuario + "User" a la derecha, fondo claro y borde fino.
- **Footer**: copyright con padding y separación visual.
- **LoadingSpinner**: spinner reutilizable en pantallas con carga.
- **AppProviders**: Redux, i18n, layout y `ToastContainer`.

### Dashboard (`/`)
- KPIs en dos filas:
  - Fila 1: Total, Vencidos, Próximos vencimientos
  - Fila 2: Pending, In progress, Submitted, Done
- Tabla de solo lectura con los **próximos 10 vencimientos** (clickeables → detalle).
- Animación hover suave en las stat cards.

### Obligaciones (`/obligations`)
- Botón **crear** arriba a la derecha.
- Tabla con click a detalle.
- Buscador y selector de orden (Redux global): creación, última edición, vencimiento.
- Variantes por cercanía de vencimiento:
  - `success`: más de 10 días
  - `warning`: 10 días o menos
  - `danger`: 1 día o menos, o vencido

### Detalle (`/obligations/[id]`)
- Tipo arriba (chico), título como encabezado, estado flotando arriba a la derecha.
- Fechas, owner, taxId enmascarado, documento, audit trail.
- Controles: eliminar, transiciones válidas, editar.
- Ejemplo `submitted`: **Mark as done** y **Rework**.
- `Submit` bloqueado si `requiresDocument` y no hay documento.

### Crear / editar
- `/obligations/new` — formulario de alta.
- `/obligations/[id]/edit` — formulario de edición.

## Sin capa API en el cliente

```
Server Action → obligations-repository (server-only) → backend HTTP o mock
```

Acciones:
- `getDashboardSummary()`
- `getObligations()`
- `getObligationById(id)`
- `deleteObligation(id)`
- `transitionObligation(id, status)`
- crear / actualizar obligación

Variables **solo servidor** en `.env`:

```env
API_URL=http://localhost:8000/api/v1
USE_MOCK_DATA=true
NEXT_PUBLIC_DEFAULT_LOCALE=es
```

`USE_MOCK_DATA=true` permite desarrollar sin backend.

## Lo que no usa Server Actions (y por qué)

| Funcionalidad | Motivo |
|---------------|--------|
| Búsqueda y orden (Redux) | Estado efímero del cliente |
| react-toastify | Solo corre en browser |
| react-i18next | Requiere Client Components |
| `router.push` / `router.refresh` | Navegación cliente post-mutación |

## Contrato API asumido

- `GET /dashboard/summary`
- `GET /obligations`
- `GET /obligations/:id`
- `POST /obligations`
- `PATCH /obligations/:id`
- `DELETE /obligations/:id`
- `POST /obligations/:id/transitions` con `{ state }`

El frontend **no duplica dominio**: transiciones y reglas vienen del backend.

## Estructura principal

```
frontend-tw/
├── .env
├── package.json
└── src/
    ├── actions/obligations.ts
    ├── app/
    ├── components/
    │   ├── dashboard/
    │   ├── detail/
    │   ├── layout/
    │   ├── obligations/
    │   ├── providers/
    │   └── ui/
    ├── i18n/
    ├── lib/server/
    ├── lib/types/
    ├── lib/utils/
    └── store/
```

## Cómo levantar

```bash
cd frontend-tw
npm install
npm run dev
```

App en `http://localhost:3000`.

## Spec respetada en frontend

- Transiciones válidas desde el backend; no inventa estados.
- Tax ID enmascarado en lecturas.
- `overdue` derivado — usa flag del backend para colorear vencimientos.
- Spinners + toastify para carga y errores.
- i18n es/en.

## Pendiente

- Tests de comportamiento frontend.
- Selector visual de idioma en UI (locale por env hoy).
