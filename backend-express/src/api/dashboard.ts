import z from "zod";
import ObligationModel from '../models/obligation.js';
import { DashboardSchema } from '../schemas/dashboardSchema.js';
import { Op } from "sequelize";
import { Obligation, ObligationLogic } from "./obligation.js";

type DashboardSchema = z.infer<typeof DashboardSchema>;

class Dashboard {
    static async summary(): Promise<DashboardSchema> {
        // Alternative: Use some kind of cache that stores statistics for the day. Then it
        // is posible to maintain the number of overdue obligations consistent with
        // updates and creations
        const all = await ObligationModel.findAll({ attributes: ["id","dueDate","state"] });
        const total = all.length
        const overdue = all.filter((ob) => ObligationLogic.isOverdue(ob)).length
        const upcomingDue = all.filter((ob) => ObligationLogic.isUpcomingDue(ob)).length
        const pending = all.filter((ob) => ob.state === "pending").length
        const inProgress = all.filter((ob) => ob.state === "in_progress").length
        const submitted = all.filter((ob) => ob.state === "submitted").length
        const done = all.filter((ob) => ob.state === "done").length
        const upcomingObligations = all
            .filter((ob) => ObligationLogic.isUpcomingDue(ob))
            .slice(0,10)
            .map((ob) => Obligation.toPublicSchema(ob))
            .filter((ob) => ob !== null)
        return {
            total,
            overdue,
            upcomingDue,
            pending,
            inProgress,
            submitted,
            done,
            upcomingObligations
        }
    }
};

export { Dashboard };