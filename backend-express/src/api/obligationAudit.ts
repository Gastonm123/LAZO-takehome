import z from "zod";
import { ObligationAuditSchema } from "../schemas/obligationAuditSchema.js";
import ObligationAuditModel from "../models/obligationAudit.js";
import { ObligationId } from "@/schemas/obligationSchema.js";
import type { Transaction } from "sequelize";

type ObligationAuditType = z.infer<typeof ObligationAuditSchema>;
type ObligationIdType = z.infer<typeof ObligationId>;

class ObligationAudit {
    static async create(
        obligationId: ObligationIdType,
        audit: ObligationAuditType,
        transaction?: Transaction,
    ) {
        await ObligationAuditModel.create(
            { obligationId, ...audit },
            { transaction },
        );
    }

    static async bulkCreate(
        obligationId: ObligationIdType,
        changes: Array<ObligationAuditType>,
        transaction?: Transaction
    ) {
        await ObligationAuditModel.bulkCreate(
            changes.map(change => ({ obligationId, ...change })),
            { transaction }
        );
    }
}

export { ObligationAudit };
