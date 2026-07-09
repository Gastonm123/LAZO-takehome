import z from "zod";
import { ObligationAuditSchema } from "../schemas/obligationAuditSchema.js";
import ObligationAuditModel from "../models/obligationAudit.js";
import { ObligationId } from "@/schemas/obligationSchema.js";
import type { Transaction } from "sequelize";

type ObligationAuditInput = z.infer<typeof ObligationAuditSchema>;
type ObligationIdType = z.infer<typeof ObligationId>;

class ObligationAudit {
    static async create(
        obligationId: ObligationIdType,
        audit: ObligationAuditInput,
        transaction?: Transaction,
    ) {
        await ObligationAuditModel.create(
            { obligationId, ...audit },
            { transaction },
        );
    }
}

export { ObligationAudit };
