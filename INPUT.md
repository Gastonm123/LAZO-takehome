# INPUT — Instrucciones del proyecto

Registro cronológico de **pedidos funcionales y decisiones** sobre LAZO. No incluye consultas de aprendizaje ni troubleshooting puntual.

---

## 1. Setup del proyecto

> Copiar Personal/LAZO desde OneDrive (Windows) al home en WSL.

> Crear carpeta `LAZO`, copiar `SPEC.pdf` y analizarlo; esperar más instrucciones.

> Estructura inicial: backend Python (FastAPI) y Express en carpetas separadas.

---

## 2. Frontend Bootstrap (`frontend/` — iteración descartada)

> Frontend dedicado con react-bootstrap, Redux (búsqueda/orden), `.env`, spinners, header/footer, dashboard KPIs, listado de obligaciones, detalle con transiciones, tema celeste/azul, react-toastify.

> Sin capa API en el cliente: Server Actions salvo donde no sea posible (documentar excepciones).

---

## 3. Frontend Tailwind (`frontend-tw/` → `frontend/`)

> Rehacer con Tailwind en otra carpeta.

> Pantallas crear y editar; botón “Nueva obligación” arriba a la derecha del listado.

> Dashboard: próximos 10 vencimientos clickeables al detalle.

> Animación sutil en hover de las stats del dashboard (ajustada a “menos” tras feedback).

---

## 4. Backend — inicio y datos

> Limpiar `backend-express/` dejando solo configuración inicial (package.json, etc.).

> Audit por cambio de campo; mock en `data/obligation.js` y `data/obligationAudit.js` (`field`, `from`, `to`, `createdAt`).

> Alinear mockups con modelos Sequelize: tax ids completos, audit sin id propio, campo `version` en audit mock.

---

## 5. Backend — configuración

> Alias `@/` en backend; módulos ES (`"type": "module"`), ejecución con `tsx` (seeder incluido).

> Notas de setup unificadas en README (antes `REMAINDERS.md`).

---

## 6. Backend — dominio, tipos y Zod

> Zod + tipos en backend; actualizar `DECISIONS.md` (trabajo manual con ayuda de IA).

> Renombrar schemas plurales → singulares (`ObligationPublicSchema`, etc.).

> Modelos Sequelize tipados; sin archivos `index.ts` en modelos.

> Rutas mock en `backend/src/routes`; middleware centralizado de errores.

> README raíz: tiempo invertido (~8 h) y decisiones de diseño.

---

## 7. Backend — correcciones y documentación

> Refactor tipado (rutas, server, middleware) respetando estructura y estilo existentes.

> Documentar backend en README; tipar seeder y data; mover doc frontend a `frontend-tw/`.

> ESLint + `tsconfig` en backend.

---

## 8. Frontend — consolidación Tailwind

> Renombrar `frontend-tw` → `frontend`; eliminar versión Bootstrap; replicar crear/editar.

> Layout formulario en dos columnas (crear y editar): tipo/responsable, título, descripción, tax id/fecha, documento.

---

## 9. Frontend — integración con backend

> Integrar sin tocar backend; diseño actual como contrato visual.

> Audit en detalle: campo, valor anterior, valor siguiente, fecha.

> Formularios: tipos correctos, estado inicial en edición, Server Actions hacia la API.

---

## 10. Frontend — arquitectura

> Refactor por encapsulación: clients intercambiables (`Http` / `Mock`) detrás de `ObligationsClient`.

> Reglas acordadas:
> - Audit agrupado por fecha ISO idéntica; más reciente arriba; `state` traducido.
> - Omitir `companyTaxId` y `description` vacíos en PATCH.
> - Tipos de obligación opacos (sin traducir).
> - Módulo de datos parte de `ObligationsClient`; schemas en `src/schemas/`.
> - Redux para búsqueda/orden al navegar entre obligaciones.
> - Validación con Zod (`safeParse`) al submit; tipos inferidos.

> Implementación con **clases** e instancias en `src/lib/logic/obligation/`.

> Loaders en rutas y submit de formulario; descripción como textarea; tipo editable.

---

## 11. Documentación y testing

> Documentar en `README.md`, `DECISIONS.md` y resumen en `frontend/README.md`.

> Tests: Vitest backend + frontend; documentación en README raíz (sin archivo aparte).

> Campo `overdue` calculado en backend (`ObligationLogic`) y expuesto en schema público; badge en frontend.

> `DECISIONS.md`: optimistic locking adecuado para lecturas frecuentes vs escrituras.

---

## 12. E2E Playwright

> Flujo UX completo con mock (`USE_MOCK_DATA=true`): dashboard, listado, detalle, transición, alta, edición, i18n.

> Configuración en puerto 3001; iteración de selectores y helpers para evitar strict-mode y datos efímeros.

---

## 13. Audit y documentación backend

> Audit como array JSON (sin `JSON.stringify`); frontend parsea directo.

> `backend-express/README.md` + referencia en README raíz.

> `ObligationAuditPublicSchema` enmascara `companyTaxId`; frontend alineado. Parse fallido en detalle → 404; mutaciones → toast.

---

## 14. Refactor frontend — schemas Zod UI

> Mover normalización y validación de formularios a schemas Zod (`transform`, `trimmedEmptyToNull`).

> Eliminar `ObligationLogic` del frontend; renombrar capa interna `Model` → `Ui` (`*UiSchema`, `*FromFormSchema`).

---

## 15. Documentación — limpieza

> Revisar docs: quitar redundancias post-refactor; aclarar wire vs UI, audit JSON, testing consolidado.

---

## Referencia: SPEC.pdf

Prueba técnica **Compliance Obligations Tracker** (fullstack, 6–8 h efectivas).

- **Dominio:** máquina de estados, documento para `submitted`, `overdue` derivado, tax ID enmascarado, audit trail, concurrencia.
- **Stack (spec):** backend FastAPI+Pydantic+Postgres; frontend Next.js+TS+Tailwind+Server Actions.
- **Entregables:** repo, README, DECISIONS.md, tests.

---

## Estado actual

| Área | Decisión vigente |
|------|------------------|
| Frontend activo | `frontend/` (Tailwind; Bootstrap descartado) |
| Datos | `HttpObligationsClient` / `MockObligationsClient`; singleton en `globalThis` |
| Schemas | Wire (copia backend) + capa UI (`*UiSchema`, `*FromFormSchema`, `trimmedEmptyToNull`) |
| Dominio | Solo backend (`ObligationLogic`) |
| Audit API | Array JSON; `companyTaxId` enmascarado en audit |
| Tests | Vitest (back/front) + Playwright E2E (mock, puerto 3001) |
| Docs | README raíz, `backend-express/README.md`, `frontend/README.md`, `DECISIONS.md` |
