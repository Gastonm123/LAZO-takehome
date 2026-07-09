# Frontend — TODOs

## Completado

- [x] `ObligationsClient` en `src/lib/logic/obligation/` (clases + instancias HTTP/mock)
- [x] Schemas Zod copiados del backend en `src/schemas/`
- [x] Eliminar `lib/types/obligation.ts`, `obligations-repository.ts`, `mock-data.ts`, `lib/utils/obligation.ts`
- [x] Renombrar `status` → `state`, `StatusBadge` → `StateBadge`
- [x] Tabla estática `NEXT_STATES` + `TRANSITION_ACTIONS` (sin validación de documento)
- [x] Audit agrupado por ISO idéntico, más reciente arriba, campos/estados traducidos
- [x] Formulario: omitir `companyTaxId` y `description` vacíos; tax id como placeholder en edición
- [x] `safeParse` Zod al submit (create/update) en el client
- [x] `isOverdue` detrás de `ObligationsClient` (lógica del backend)
- [x] Switch ES/EN en footer + KPIs traducidos
- [x] Tipos opacos sin traducir en UI

## Pendiente

- [ ] Búsqueda/orden server-side con skeleton optimista (Redux se mantiene)
- [ ] Feedback de errores de formulario más detallado (toast parseado del backend)
- [ ] Cuando el backend exponga `overdue` en `read()`, leerlo del API y eliminar `isOverdue` local
- [ ] Tests de comportamiento frontend
- [ ] Actualizar o eliminar `FRONTEND.md` (no es fuente de verdad)
