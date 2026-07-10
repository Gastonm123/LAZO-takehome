# Frontend — LAZO

Next.js 15 · React 19 · Tailwind · Redux (search/sort) · Server Actions · Zod · i18n ES/EN

Decisiones: [DECISIONS.md](../DECISIONS.md). Setup full-stack y testing: [README.md](../README.md).

## Arranque

```bash
cp .env.example .env
npm install
npm run dev    # http://localhost:3000
```

```env
API_URL=http://localhost:5000/api/v1
USE_MOCK_DATA=false
NEXT_PUBLIC_DEFAULT_LOCALE=es
```

## Arquitectura

```
Server Actions (src/actions/obligations.ts)
        ↓
getObligationClient()   // singleton en globalThis
        ↓
┌───────────────────────┬────────────────────────┐
│ HttpObligationsClient │ MockObligationsClient  │
└───────────┬───────────┴────────────┬───────────┘
            └──── schemas Zod ────────┘
                  wire → UI / form
```

| Capa | Ubicación | Rol |
|------|-----------|-----|
| Wire | `obligationSchema.ts`, `obligationAuditSchema.ts` | Contrato HTTP (copia backend) |
| UI | `obligationUiSchema.ts`, `dashboardSchema.ts` | Normalización post-parse (`*UiSchema`) |
| Formularios | `*FromFormSchema`, `zodUtils.ts` | Validación submit, trim, PATCH parcial |
| Clientes | `src/lib/logic/obligation/` | HTTP o mock; sin lógica de dominio duplicada |
| UI | `src/components/`, `src/app/` | Presentación; sin `fetch` en browser |

No hay capa repository ni clase `ObligationLogic` en el frontend (el dominio vive en el backend).

## Rutas

| Ruta | Contenido |
|------|-----------|
| `/` | Dashboard |
| `/obligations` | Listado + búsqueda/orden (Redux, client-side) |
| `/obligations/new` | Crear |
| `/obligations/[id]` | Detalle + audit + transiciones |
| `/obligations/[id]/edit` | Editar |

## Loaders

| Ubicación | Cuándo |
|-----------|--------|
| `src/app/loading.tsx` | Carga de rutas raíz |
| `src/app/obligations/loading.tsx` | Carga del listado |
| `ObligationForm` | Submit create/edit |

## Reglas UI

- Campo **`state`** (no `status`); botones vía `NEXT_STATES` + `TRANSITION_ACTIONS`
- Validación de negocio en backend; botones siempre habilitados
- Audit: array JSON directo; agrupado por fecha ISO; tax id enmascarado en audit
- Formulario: textarea descripción; tipo texto libre; tax id placeholder en edición; vacíos omitidos en PATCH
- Parse Zod fallido en detalle → `notFound()`; mutaciones → toast con error

## Testing

Comandos y listado de archivos: [README.md § Testing](../README.md#testing).

```bash
npm run test:run
npm run test:e2e          # Playwright, USE_MOCK_DATA=true, puerto 3001
```

## Pendiente

Ver [TODOS.md](./TODOS.md).
