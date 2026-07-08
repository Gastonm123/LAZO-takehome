import z from "zod";
import { ObligationAuditSchema } from "../schemas/obligationAuditSchema.js";
import ObligationAuditModel from "../models/obligationAudit.js";
import { ObligationId } from "@/schemas/obligationSchema.js";

type ObligationAuditSchema = z.infer<typeof ObligationAuditSchema>;
type ObligationId = z.infer<typeof ObligationId>;

class ObligationAudit {
    static async create(obligationId:ObligationId, audit:ObligationAuditSchema) {
        await ObligationAuditModel.create({obligationId, ...audit})
    }
}