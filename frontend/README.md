# Frontend — LAZO

Resumen del frontend activo. Detalle completo en [README.md](../README.md) y decisiones en [DECISIONS.md](../DECISIONS.md).

## Stack

Next.js 15 · React 19 · Tailwind · Redux (search/sort) · Server Actions · Zod · i18n ES/EN

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
getObligationClient()
        ↓
┌───────────────────────┬────────────────────────┐
│ HttpObligationsClient │ MockObligationsClient    │
└───────────┬───────────┴────────────┬─────────────┘
            └──────── ObligationLogic ─┘
                      (overdue, Zod, audit)
```

- **Schemas:** `src/schemas/` (copia del backend)
- **Dominio / API:** `src/lib/logic/obligation/`
- **UI:** `src/components/`, `src/app/`
- **Sin** capa repository ni `fetch` en el cliente

## Rutas

| Ruta | Contenido |
|------|-----------|
| `/` | Dashboard |
| `/obligations` | Listado + búsqueda/orden |
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
- Audit agrupado por fecha; descripción como textarea (solo lectura) en detalle
- Tipo editable como texto libre en formulario
- Tax ID: placeholder enmascarado en edición; valor vacío no se envía en PATCH

## Pendiente

Ver [TODOS.md](./TODOS.md).

## Testing

Vitest + Testing Library. Detalle en [README.md § Testing](../README.md#testing).

```bash
npm run test:run
npm run test    # watch
```

| Archivo | Cubre |
|---------|--------|
| `ObligationLogic.test.ts` | Overdue, audit, payloads Zod |
| `MockObligationsClient.test.ts` | CRUD mock sin red |
| `transitionActions.test.ts` | Botones de transición |
| `StateBadge.test.tsx` | Badge + i18n mock |

Importar clases concretas en tests, no `lib/logic/obligation/index.ts` (`server-only`).

---
