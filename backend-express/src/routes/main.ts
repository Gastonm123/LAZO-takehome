import express from "express";
import dashboardRoute from "./dashboardRoute.js";
import obligationsRoute from "./obligationsRoute.js";

const router = express.Router();

router.use("/dashboard", dashboardRoute);
router.use("/obligations", obligationsRoute);

export default router;
