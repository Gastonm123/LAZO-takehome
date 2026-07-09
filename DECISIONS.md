# Decisiones — LAZO

Decisiones de diseño e implementación. El trabajo se realizó de forma **manual**, con ayuda de IA para explorar opciones y redactar código.

---

## Manejo centralizado de errores en la API

**Decisión:** atrapar todos los errores de la API en un **middleware** de Express (`errorHandler`), en lugar de manejar respuestas de error ad hoc en cada ruta o controlador.

**Motivo:**
- Respuestas JSON consistentes (`message`, `stack` solo en desarrollo).
- Las rutas async delegan fallos con `next(error)` vía `asyncHandler`, sin repetir try/catch.
- Un solo lugar para mapear status codes (404 en `notFound`, 400/409/etc. según `err.statusCode`).

**Implementación:** `backend-express/src/middleware/errorMiddleware.js` + `asyncHandler.js`, registrados al final de la cadena en `server.ts`.

---

## Dominio en el backend, presentación en el frontend

**Decisión:** la máquina de estados, validación de transiciones (documento requerido, etc.) y generación de audit viven **solo en el backend** (`ObligationLogic`).

**Motivo:** una sola fuente de verdad; el frontend no debe duplicar reglas que pueden cambiar.

**En el frontend:** tabla estática `NEXT_STATES` únicamente para **mostrar botones** de transición. Los botones no se deshabilitan por reglas de negocio; si la acción es inválida, el backend responde error.

---

## Arquitectura del frontend por capas intercambiables

**Decisión:** acceso a datos mediante **clases** en `frontend/src/lib/logic/obligation/`, no funciones sueltas ni “repository”.

```
getObligationClient()
  → new HttpObligationsClient(apiUrl, logic)
  → new MockObligationsClient(logic)     // USE_MOCK_DATA=true
```

**Motivo (criterio del autor):** clasificar piezas por probabilidad de cambio y **ocultar detalles** detrás de una interfaz clara. Cambiar mock ↔ HTTP implica instanciar otra clase; el resto de la app no conoce `fetch`, URLs ni doble-encoding del audit.

| Clase | Responsabilidad |
|-------|-----------------|
| `ObligationsClient` | Contrato abstracto (list, getById, create, …) |
| `ObligationLogic` | `isOverdue`, parseo Zod, serialización, payloads de formulario |
| `HttpObligationsClient` | HTTP + parseo de respuestas |
| `MockObligationsClient` | Store en memoria para desarrollo |

**Server Actions** (`src/actions/obligations.ts`) solo orquestan: llaman al client y `revalidatePath`.

---

## Schemas Zod compartidos (copiados)

**Decisión:** copiar literalmente los schemas del backend a `frontend/src/schemas/` y usarlos para parsear respuestas HTTP y validar formularios (`safeParse` al submit).

**Motivo:** un solo contrato de datos; los tipos se infieren con `z.infer` en lugar de duplicar interfaces manuales en `lib/types/`.

**Formularios:** validación mínima en UI (sin `required` HTML); primer filtro Zod al enviar; feedback al usuario vía toast con errores del servidor (mejorable).

---

## Nomenclatura `state` (no `status`)

**Decisión:** alinear el frontend al backend usando **`state`** en tipos, props y componentes (`StateBadge`).

---

## `overdue` en la respuesta pública

**Decisión:** el backend incluye `overdue: boolean` en `ObligationPublicSchema`, calculado con `ObligationLogic.isOverdue()` en `toPublicSchema`. El frontend lo lee tal cual vía `ObligationLogic.fromPublic()`.

---

## Audit trail en UI

**Decisión:**
- Agrupar entradas con el mismo `date` (ISO idéntico) en un `<details>` dropdown.
- Orden: más reciente arriba.
- Traducir nombres de campo (`fields.*`) y valores de `state`; formatear fechas y booleanos.
- Tipos de obligación (`annual_report`, …): **valores opacos**, sin traducir.

---

## Redux solo para UI efímera

**Decisión:** Redux Toolkit guarda `searchQuery`, `sortField`, `sortDirection` en el listado.

**Motivo:** estado de presentación que debe persistir al navegar entre obligaciones sin perder el filtro. La búsqueda server-side con skeleton optimista quedó documentada como mejora futura sin sacar Redux.

---

## Server Actions sin capa API en el cliente

**Decisión:** no exponer `fetch` al browser; mutaciones y lecturas iniciales vían Server Actions → `ObligationsClient` (`server-only`).

**Excepciones en cliente:** Redux, i18n, toastify, navegación post-mutación.

---

## i18n

**Decisión:** react-i18next con locales `es` / `en`; switch en el footer; preferencia en `localStorage`.

Estados y KPIs traducidos; tipos de obligación no.

---

## Optimistic locking

**Decisión:** el **optimistic locking** es el enfoque más adecuado para este dominio.

**Motivo:**
- Las **lecturas son mucho más frecuentes** que las escrituras (listados, detalle, dashboard).
- Con **lock pesimista**, habría que bloquear el acceso a una obligación mientras otro usuario la está mirando, lo que sería una **experiencia de usuario muy pobre**.
- El optimistic locking permite lecturas concurrentes sin bloqueos; solo detecta conflictos en el momento de escribir (campo `version` → `409 SynchError` si la obligación cambió entre lectura y update).
- Las operaciones críticas **ya corren en transacción** (update + audit en la misma transacción Sequelize).

---

## Testing

**Stack:** Vitest (backend + frontend), supertest (HTTP backend), Testing Library + jsdom (frontend).

**Decisión:** separar tres capas:
1. **Unit sin DB** — dominio (`ObligationLogic`) y schemas Zod.
2. **Integración HTTP** — supertest contra `createApp()`; se salta si Postgres no responde.
3. **Frontend sin red** — `ObligationLogic`, `MockObligationsClient`, componentes con i18n mockeado.

**Scripts:** `npm run test:run` y `npm run test` (watch) en `backend-express/` y `frontend/`.

**Arquitectura relevante:** `backend-express/src/app.ts` exporta Express sin listener para no ocupar puerto en tests.

**Regla frontend:** no importar `lib/logic/obligation/index.ts` en tests (`server-only`); usar archivos concretos de la carpeta.

**Pendiente:** Playwright E2E; `HttpObligationsClient` con fetch mock; RTL para formulario y audit trail; 409 en supertest.

Detalle de archivos y troubleshooting: [README.md § Testing](./README.md#testing).

---

## Documentación

- **Fuente de verdad del contrato funcional:** código + schemas Zod + este archivo.
- `frontend/FRONTEND.md` (iteración anterior) **no** es fuente de verdad; usar `frontend/README.md`.
