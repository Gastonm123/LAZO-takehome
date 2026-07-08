import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { Dashboard } from "@/api/dashboard.js";

const router = express.Router();

router.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    res.json(Dashboard.summary());
  }),
);

export default router;
