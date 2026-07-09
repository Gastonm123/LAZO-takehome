# LAZO Backend (Express)

API REST para el Compliance Obligations Tracker.

## Inicio rápido

```bash
cp .env.example .env
npm install
docker compose -f ../database/compose.yml up -d   # desde la raíz del repo
npm run seed
npm start
```

API en `http://localhost:<BACKEND_PORT>/api/v1` (puerto por defecto en `.env.example`: **5000**).

## Documentación completa

La documentación detallada del backend (endpoints, dominio, errores, estructura) está en el README de la raíz del repositorio:

**[../README.md](../README.md#backend-backend-express)**

Otros documentos útiles:

- [../DECISIONS.md](../DECISIONS.md) — decisiones de diseño
- [../frontend-tw/FRONTEND.md](../frontend-tw/FRONTEND.md) — frontend y contrato con la API
