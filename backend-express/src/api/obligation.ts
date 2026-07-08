import { init } from "../lib/orm.js";
import ObligationModel from "../models/obligation.js";
import {
  ObligationId,
  ObligationBasicMutation,
  ObligationState,
  ObligationSearch,
  MaskedTaxId,
  ObligationPublicSchema,
  ObligationSchema
} from "../schemas/obligationSchema.js";
import {
    ObligationAuditSchema
} from "../schemas/obligationAuditSchema.js";
import z from "zod";
import { OptimisticLockError } from "sequelize";
import { logger } from "../lib/logging.js";
import { InvalidCall, NotFoundError, SynchError } from "../lib/errors.js";
import ObligationAudit from "../models/obligationAudit.js";

type ObligationState = z.infer<typeof ObligationState>;
type ObligationBasicMutation = z.infer<typeof ObligationBasicMutation>;
type ObligationSearch = z.infer<typeof ObligationSearch>;
type MaskedTaxId = z.infer<typeof MaskedTaxId>;
type ObligationPublicSchema = z.infer<typeof ObligationPublicSchema>;
type ObligationAuditSchema = z.infer<typeof ObligationAuditSchema>;
type ObligationSchema = z.infer<typeof ObligationSchema>;
type ObligationId = z.infer<typeof ObligationId>;

const ALLOWED_TRANSITIONS : Record<
    ObligationState,
    readonly ObligationState[]> =
{
    pending: ["in_progress"],
    in_progress: ["submitted", "pending"],
    submitted: ["done", "in_progress"],
    done: ["in_progress"]
}


function maskTaxId(value:string): MaskedTaxId {
    // borrar todo lo que no sea digitos
    const digits = value.replace(/\D/g, "");
    if (digits.length < 4) {
        return MaskedTaxId.parse(value);
    }
    return MaskedTaxId.parse(`••••${digits.slice(-4)}`);
}


class Obligation {
    declare private obligation: ObligationModel
    declare private obligationId: ObligationId

    static async init(obligationId : ObligationId): Promise<Obligation> {
        const obj = new Obligation();
        const row = await ObligationModel.findByPk(obligationId);
        if (row === null) {
            throw new NotFoundError(`No se encontro la obligacion ${obligationId}`);
        }
        obj.obligation = row;
        obj.obligationId = obligationId;
        return obj;
    }

    read(): ObligationPublicSchema {
        const publicSchema = Obligation.toPublicSchema(this.obligation);
        if (publicSchema === null)
            throw new Error(`No es posible leer la obligacion ${this.obligationId}`)
        return publicSchema;
    }

    async update(attributes: ObligationBasicMutation) {
        try {
            const pre = this.obligation.get({plain:true});
            this.obligation.set(attributes);
            const row = await this.obligation.save({returning:["updatedAt"]});
            for (const [field, value] of Object.entries(attributes)) {
                if (value !== pre[field]) {
                    await ObligationAudit.create(
                        ObligationId.parse(row.id), 
                        ObligationAuditSchema.parse({
                            field,
                            from:String(pre[field]),
                            to:String(value),
                            date:row.updatedAt,
                        }))
                }
            }
        } catch (error) {
            if (error instanceof OptimisticLockError) {
                throw new SynchError(`La obligacion esta desincronizada`);
            } else {
                throw error;
            }
        }
    }

    async delete() {
        return this.obligation.destroy();
    }

    async transitionState(state: ObligationState) {
        const from = ObligationState.safeParse(this.obligation.state);
        if (!from.success)
            throw from.error;
        if (!ObligationLogic.validateTransition(this.obligation, from.data, state))
            throw new InvalidCall("Transicion Invalida");
        
        try {
            this.obligation.set({state})
            await this.obligation.save();
        } catch (error) {
            if (error instanceof OptimisticLockError) {
                throw new SynchError(`La obligacion esta desincronizada`);
            } else {
                throw error;
            }
        }
    }

    async getAuditTrail(): Promise<ObligationAuditSchema[]> {
        const audits = await ObligationAudit.findAll({ where: { obligationId: this.obligationId } })

        return audits.map((audit) => {
            const parsed = ObligationAuditSchema.safeParse(audit);
            // if it's not possible to return all dont return any
            if (!parsed.success) {
                throw parsed.error;
            }
            return parsed.data;
        });
    }

    static async create(attributes: ObligationBasicMutation): Promise<Number> {
        let obligationId = null;
        try {
            const row = await ObligationModel.create({
                ...attributes,
                state: "pending"
            }, {returning:["id", "updatedAt"]});
            for (const [field, value] of Object.entries(attributes)) {
                if (value !== "" && value != null) {
                    await ObligationAudit.create(
                        ObligationId.parse(row.id), 
                        ObligationAuditSchema.parse({
                            field,
                            from:"",
                            to:value,
                            date:row.updatedAt,
                        }))
                }
            }
            obligationId = row.id;
        } catch (error) {
            throw error;
        }
        return obligationId;
    }

    static async search(attributes: ObligationSearch): Promise<Array<ObligationPublicSchema>> {
        // for now return all obligations
        const obligations = await ObligationModel.findAll();
        const publicObligations = obligations
            .map(ob => Obligation.toPublicSchema(ob))
            .filter(ob => ob !== null)
        return publicObligations;
    }

    static toPublicSchema(obligation: ObligationModel): ObligationPublicSchema | null {
        const ob = {...obligation, companyTaxId: maskTaxId(obligation.companyTaxId)};
        const parsed = ObligationPublicSchema.safeParse(ob);
        if (!parsed.success) {
            logger.error(`API: Error de parseo de la obligacion ${ob.id}`);
            return null;
        }
        return parsed.data;
    }
};


/* Clase de logicca separada de la base de datos y HTTP
 */
class ObligationLogic {
    static validateTransition(obligation: ObligationModel, from: ObligationState, to: ObligationState): boolean {
        if (!ALLOWED_TRANSITIONS[from].includes(to))
            return false;

        if (to === "submitted" &&
            obligation.requiresDocument &&
            obligation.documentUrl == null)
        {
            return false;
        }

        return true;
    }

    static isOverdue(obligation:ObligationModel): boolean {
        if (obligation.state === "done" || obligation.state === "submitted") {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = obligation.dueDate;
        due.setHours(0, 0, 0, 0);

        return due < today;
    }

    static isUpcomingDue(obligation:ObligationModel): boolean {
        if (obligation.state === "done" || obligation.state === "submitted") {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 8);

        const due = obligation.dueDate;
        due.setHours(0, 0, 0, 0);

        return due >= today && due < nextWeek;
    }
}

export { Obligation, ObligationLogic };