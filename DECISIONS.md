# Decisiones — LAZO

Decisiones de diseño e implementación. El trabajo se realizó de forma **manual**, con ayuda de IA para explorar opciones y redactar código.

---

## Manejo centralizado de errores en la API

**Decisión:** atrapar todos los errores de la API en un **middleware** de Express (`errorHandler`), en lugar de manejar respuestas de error ad hoc en cada ruta o controlador.

**Motivo:**
- Respuestas JSON consistentes (`message`, `stack` solo en desarrollo).
- Las rutas async delegan fallos con `next(error)` vía `asyncHandler`, sin repetir try/catch.
- Un solo lugar para mapear status codes (404 en `notFound`, 400/409/etc. según `err.statusCode`).

**Implementación:** `backend-express/src/middleware/errorMiddleware.ts` + `asyncHandler.ts`, registrados al final de la cadena en `app.ts`.

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
  → new HttpObligationsClient(httpClient)
  → new MockObligationsClient()     // USE_MOCK_DATA=true
```

**Motivo:** ocultar detalles detrás de una interfaz clara. Cambiar mock ↔ HTTP implica instanciar otra clase; el resto de la app no conoce `fetch` ni URLs del backend. El singleton vive en `globalThis` para persistir el mock entre requests en dev/E2E.

| Clase | Responsabilidad |
|-------|-----------------|
| `ObligationsClient` | Contrato abstracto (list, getById, create, …) |
| `HttpObligationsClient` | HTTP + parseo Zod |
| `MockObligationsClient` | Store en memoria para desarrollo |

**Server Actions** (`src/actions/obligations.ts`) solo orquestan: llaman al client y `revalidatePath`.

---

## Schemas Zod: wire (copiados) + capa UI

**Decisión:** dos niveles de schemas en `frontend/src/schemas/`:

| Nivel | Archivos | Uso |
|-------|----------|-----|
| **Wire** | `obligationSchema.ts`, `obligationAuditSchema.ts`, `dashboardSchema.ts` (parte pública) | Copia del contrato backend; parseo de JSON HTTP |
| **UI** | `obligationUiSchema.ts`, transforms en `dashboardSchema.ts` | Normalización para componentes (`id` string, fechas ISO, `description` default `""`) |
| **Formularios** | `*FromFormSchema`, `ObligationFormValuesSchema` | `safeParse` al submit; `trimmedEmptyToNull`; omite campos vacíos en PATCH |

**Motivo:** un contrato alineado con el backend sin duplicar interfaces manuales (`z.infer` en `types.ts`). La capa UI concentra transforms que antes vivían en una clase `ObligationLogic` del frontend (eliminada).

**Audit:** `GET .../audit` devuelve un array JSON; el frontend parsea con `ObligationAuditListSchema` (sin doble `JSON.parse`).

**Formularios:** validación mínima en HTML; primer filtro Zod al enviar; feedback vía toast con errores del servidor (mejorable).

---

## Nomenclatura `state` (no `status`)

**Decisión:** alinear el frontend al backend usando **`state`** en tipos, props y componentes (`StateBadge`).

---

## `overdue` en la respuesta pública

**Decisión:** el backend incluye `overdue: boolean` en `ObligationPublicSchema`, calculado con `ObligationLogic.isOverdue()` en `toPublicSchema`. El frontend lo expone vía `ObligationUiSchema`.

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

**Decisión:** no exponer `fetch` al browser; mutaciones y lecturas iniciales vía Server Actions → `ObligationsClient` (`server-only`).

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

**Stack:** Vitest (backend + frontend), supertest (HTTP backend), Testing Library + jsdom (frontend), Playwright E2E (frontend UX).

**Decisión:** cuatro capas separadas:
1. **Unit sin DB** — dominio backend (`ObligationLogic`) y schemas Zod (backend + UI frontend).
2. **Integración HTTP** — supertest contra `createApp()`; se salta si Postgres no responde.
3. **Frontend sin red** — schemas UI, `MockObligationsClient`, componentes con i18n mockeado.
4. **E2E UX** — Playwright contra `next dev` con mock in-memory; flujo completo de navegación, CRUD y transiciones.

**Scripts:** `npm run test:run` / `npm run test` en `backend-express/` y `frontend/`; `npm run test:e2e` en `frontend/`.

**Regla frontend:** no importar `lib/logic/obligation/index.ts` en tests (`server-only`).

Detalle de archivos, comandos y troubleshooting: [README.md § Testing](./README.md#testing).

---

## Documentación

- **Fuente de verdad:** código + schemas Zod + este archivo.
- README raíz: setup full-stack y testing consolidado.
- `backend-express/README.md` y `frontend/README.md`: detalle por capa sin duplicar la tabla de tests.
