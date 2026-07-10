# Frontend — TODOs

## Completado

- [x] `ObligationsClient` (HTTP + mock) en `src/lib/logic/obligation/`
- [x] Schemas Zod wire + capa UI (`*UiSchema`, `*FromFormSchema`) — sin `ObligationLogic` frontend
- [x] Audit como array JSON directo (`ObligationAuditListSchema`)
- [x] Eliminar capa repository, tipos manuales y utilidades duplicadas
- [x] `state` / `StateBadge`, `NEXT_STATES`, audit agrupado, formularios con Zod
- [x] i18n ES/EN, `overdue` desde backend
- [x] Tests unitarios/componentes y E2E Playwright — ver [README § Testing](../README.md#testing)

## Pendiente

- [ ] Búsqueda/orden server-side con skeleton optimista (Redux se mantiene)
- [ ] Feedback de errores de formulario más detallado (toast parseado del backend)
