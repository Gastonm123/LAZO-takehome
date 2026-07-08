import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { Obligation } from "../api/obligation.js";
import { ObligationBasicMutation, ObligationId, ObligationState } from "@/schemas/obligationSchema.js";
import { InvalidCall } from "@/lib/errors.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    // for now return all
    res.json(Obligation.search());
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = ObligationId.safeParse(req.params.id);
    if (!id.success) {
      throw new InvalidCall("Invalid id")
    }
    const obligation = await Obligation.init(id.data);
    res.json(obligation.read());
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const schema = ObligationBasicMutation.safeParse(req.body);
    if (!schema.success) {
      throw new InvalidCall("Invalid mutation");
    }
    const obligationId = await Obligation.create(schema.data);
    res.json({obligationId});
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = ObligationId.safeParse(req.params.id);
    const schema = ObligationBasicMutation.safeParse(req.body);
    if (!schema.success || !id.success) {
      throw new InvalidCall("Invalid mutation");
    }
    const obligation = await Obligation.init(id);
    obligation.update(schema);
    res.json(obligation.read());
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    // for now this will fail because the audit would get lost
    const id = ObligationId.safeParse(req.params.id);
    if (!id.success) {
      throw new InvalidCall("Invalid mutation");
    }
    const obligation = await Obligation.init(id);
    await obligation.delete();
  }),
);

router.post(
  "/:id/transitions",
  asyncHandler(async (req, res) => {
    const to = ObligationState.safeParse(req.body)
    const id = ObligationId.safeParse(req.params.id);
    if (!to.success || !id.success) {
      throw new InvalidCall("Invalid state");
    }
    const obligation = await Obligation.init(id);
    await obligation.transitionState(to)
  }),
);

export default router;
