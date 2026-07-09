import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "@/app.js";
import { sequelize } from "@/lib/orm.js";

const app = createApp();
let dbAvailable = false;

beforeAll(async () => {
    try {
        await sequelize.authenticate();
        dbAvailable = true;
    } catch {
        dbAvailable = false;
    }
});

afterAll(async () => {
    if (dbAvailable) {
        await sequelize.close();
    }
});

describe.skipIf(() => !dbAvailable)("API integration", () => {
    it("GET /api/v1/dashboard/summary returns KPIs", async () => {
        const response = await request(app).get("/api/v1/dashboard/summary");
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            total: expect.any(Number),
            overdue: expect.any(Number),
            upcomingDue: expect.any(Number),
            pending: expect.any(Number),
            inProgress: expect.any(Number),
            submitted: expect.any(Number),
            done: expect.any(Number),
            upcomingObligations: expect.any(Array),
        });
    });

    it("GET /api/v1/obligations returns a list", async () => {
        const response = await request(app).get("/api/v1/obligations");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("GET /api/v1/obligations/:id masks companyTaxId", async () => {
        const list = await request(app).get("/api/v1/obligations");
        const first = list.body[0];
        if (!first) {
            return;
        }

        const response = await request(app).get(`/api/v1/obligations/${first.id}`);
        expect(response.status).toBe(200);
        expect(response.body.companyTaxId).toMatch(/^••••\d{4}$/);
        expect(response.body).toHaveProperty("createdAt");
        expect(response.body).toHaveProperty("updatedAt");
        expect(typeof response.body.overdue).toBe("boolean");
    });

    it("GET /api/v1/obligations/99999 returns 404", async () => {
        const response = await request(app).get("/api/v1/obligations/99999");
        expect(response.status).toBe(404);
    });

    it("POST /api/v1/obligations/:id/transitions rejects invalid state", async () => {
        const list = await request(app).get("/api/v1/obligations");
        const first = list.body[0];
        if (!first) {
            return;
        }

        const response = await request(app)
            .post(`/api/v1/obligations/${first.id}/transitions`)
            .send({ state: "done" });

        expect(response.status).toBe(400);
    });
});
