import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { Obligation } from "../api/obligation.js";
import {
    ObligationCreate,
    ObligationId,
    ObligationSearch,
    ObligationState,
    ObligationUpdate,
} from "@/schemas/obligationSchema.js";
import { InvalidCall } from "@/lib/errors.js";

const router = express.Router();

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const attributes = ObligationSearch.safeParse({
            search: req.query.search ?? "",
            order: req.query.order ?? "dueDate",
            direction: req.query.direction ?? "ASC",
        });
        // if (!attributes.success) {
        //     throw new InvalidCall("Invalid search");
        // }
        // res.json(await Obligation.search(attributes.data));
        // get all obligations for now
        res.json(await Obligation.search());
    }),
);

router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = ObligationId.safeParse(req.params.id);
        if (!id.success) {
            throw new InvalidCall("Invalid id");
        }
        const obligation = await Obligation.init(id.data);
        res.json(obligation.read());
    }),
);

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const schema = ObligationCreate.safeParse(req.body);
        if (!schema.success) {
            throw new InvalidCall("Invalid mutation");
        }
        const obligationId = await Obligation.create(schema.data);
        res.json({ obligationId });
    }),
);

router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = ObligationId.safeParse(req.params.id);
        const schema = ObligationUpdate.safeParse(req.body);
        if (!schema.success || !id.success) {
            throw new InvalidCall("Invalid mutation");
        }
        const obligation = await Obligation.init(id.data);
        await obligation.update(schema.data);
        res.json(obligation.read());
    }),
);

router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = ObligationId.safeParse(req.params.id);
        if (!id.success) {
            throw new InvalidCall("Invalid id");
        }
        const obligation = await Obligation.init(id.data);
        await obligation.delete();
        res.status(204).send();
    }),
);

router.post(
    "/:id/transitions",
    asyncHandler(async (req, res) => {
        const id = ObligationId.safeParse(req.params.id);
        const to = ObligationState.safeParse(req.body.state);
        if (!to.success || !id.success) {
            throw new InvalidCall("Invalid state");
        }
        const obligation = await Obligation.init(id.data);
        await obligation.transitionState(to.data);
        res.json(obligation.read());
    }),
);

router.get(
    "/:id/audit",
    asyncHandler(async (req, res) => {
        const id = ObligationId.safeParse(req.params.id);
        if (!id.success) {
            throw new InvalidCall("Invalid state");
        }
        const obligation = await Obligation.init(id.data);
        const auditTrail = await obligation.getAuditTrail();
        res.json(auditTrail);
    }),
)
export default router;
