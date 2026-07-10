import ObligationModel from "../models/obligation.js";
import ObligationAuditModel from "../models/obligationAudit.js";
import { sequelize } from "../lib/orm.js";
import {
    ObligationId,
    ObligationState,
    ObligationSearch,
    MaskedTaxId,
    ObligationPublicSchema,
    ObligationCreate,
    ObligationUpdate,
} from "../schemas/obligationSchema.js";
import { ObligationAuditPublicSchema, ObligationAuditSchema } from "../schemas/obligationAuditSchema.js";
import z from "zod";
import { OptimisticLockError, ValidationError } from "sequelize";
import { logger } from "../lib/logging.js";
import { InvalidCall, NotFoundError, SynchError } from "../lib/errors.js";
import { ObligationAudit } from "./obligationAudit.js";

type ObligationStateType = z.infer<typeof ObligationState>;
type ObligationCreateType = z.infer<typeof ObligationCreate>;
type ObligationUpdateType = z.infer<typeof ObligationUpdate>;
// type ObligationSearchType = z.infer<typeof ObligationSearch>;
type MaskedTaxIdType = z.infer<typeof MaskedTaxId>;
type ObligationPublicSchemaType = z.infer<typeof ObligationPublicSchema>;
type ObligationIdType = z.infer<typeof ObligationId>;
type ObligationAuditPublicSchemaType = z.infer<typeof ObligationAuditPublicSchema>;

const ALLOWED_TRANSITIONS: Record<
    ObligationStateType,
    readonly ObligationStateType[]
> = {
    pending: ["in_progress"],
    in_progress: ["submitted", "pending"],
    submitted: ["done", "in_progress"],
    done: ["in_progress"],
};

function maskTaxId(value: string): MaskedTaxIdType {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 4) {
        return MaskedTaxId.parse(value);
    }
    return MaskedTaxId.parse(`••••${digits.slice(-4)}`);
}

function serializeAuditValue(value: unknown): string {
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (value === null || value === undefined) {
        return "";
    }
    return String(value);
}

function fieldChanged(before: unknown, after: unknown): boolean {
    if (before instanceof Date && after instanceof Date) {
        return before.getTime() !== after.getTime();
    }
    return before !== after;
}

class Obligation {
    declare private obligation: ObligationModel;
    declare private obligationId: ObligationIdType;

    static async init(obligationId: ObligationIdType): Promise<Obligation> {
        const obj = new Obligation();
        const row = await ObligationModel.findByPk(obligationId);
        if (row === null) {
            throw new NotFoundError(
                `No se encontro la obligacion ${obligationId}`,
            );
        }
        obj.obligation = row;
        obj.obligationId = obligationId;
        return obj;
    }

    read(): ObligationPublicSchemaType {
        // console.log(this.obligation);
        const publicSchema = Obligation.toPublicSchema(this.obligation);
        if (publicSchema === null) {
            logger.error(`API: error leyendo la obligacion ${this.obligationId}`)
            throw new Error(
                `No es posible leer la obligacion ${this.obligationId}`,
            );
        }
        return publicSchema;
    }

    async update(attributes: ObligationUpdateType): Promise<void> {
        if (!ObligationLogic.validateUpdate(this.obligation, attributes)) {
            throw new InvalidCall("Invalid mutation");
        }

        const pre = {...this.obligation.get({ plain: true })} as Record<string, unknown>;

        try {
            await sequelize.transaction(async (transaction) => {
                this.obligation.set({ ...attributes, version: this.obligation.version+1 });
                await this.obligation.save({ transaction });
                const updatedAt = this.obligation.updatedAt!;

                const _attributes = attributes as Record<string,unknown>;
                const changes = Object.keys(_attributes)
                    .map(field => {
                        const value = _attributes[field];
                        if (!fieldChanged(pre[field], value)) {
                            return null;
                        }

                        return {
                            field: field,
                            from: serializeAuditValue(pre[field]),
                            to: serializeAuditValue(value),
                            date: updatedAt
                        };
                    })
                    .filter((change) => (change !== null));

                await ObligationAudit.bulkCreate(this.obligationId, changes, transaction);
            });
        } catch (error) {
            if (error instanceof OptimisticLockError) {
                throw new SynchError("La obligacion esta desincronizada");
            }
            logger.error(`API: error actualizando obligacion ${this.obligationId}`)
            throw error;
        }
    }

    async delete(): Promise<void> {
        await sequelize.transaction(async (transaction) => {
            await ObligationAuditModel.destroy({
                where: { obligationId: this.obligationId },
                transaction,
            });
            await this.obligation.destroy({ transaction });
        });
    }

    async transitionState(state: ObligationStateType): Promise<void> {
        const from = ObligationState.safeParse(this.obligation.state);
        if (!from.success) {
            logger.error(`API: Error de parseo de la obligacion ${this.obligation.id}`);
            throw from.error;
        }
        if (!ObligationLogic.validateTransition(this.obligation, from.data, state)) {
            throw new InvalidCall("Transicion Invalida");
        }

        const previousState = from.data;

        try {
            await sequelize.transaction(async (transaction) => {
                this.obligation.set({ state });
                await this.obligation.save({ transaction });

                await ObligationAudit.create(
                    this.obligationId,
                    ObligationAuditSchema.parse({
                        field: "state",
                        from: previousState,
                        to: state,
                        date: this.obligation.updatedAt!,
                    }),
                    transaction,
                );
            });
        } catch (error) {
            if (error instanceof OptimisticLockError) {
                throw new SynchError("La obligacion esta desincronizada");
            }
            logger.error(`API: error cambiando estado de obligacion ${this.obligationId}`)
            throw error;
        }
    }

    async getAuditTrail(): Promise<ObligationAuditPublicSchemaType[]> {
        const audits = await ObligationAuditModel.findAll({
            where: { obligationId: this.obligationId },
            order: [["date", "ASC"]],
        });

        return audits.map((audit) => {
            const publicAudit = 
                audit.field !== "companyTaxId" ? audit :
                {   field: "companyTaxId",
                    from: maskTaxId(audit.from),
                    to: maskTaxId(audit.to),
                    date: audit.date
                }
            const parsed = ObligationAuditPublicSchema.safeParse(publicAudit);
            if (!parsed.success) {
                console.error(`API: error parseando audit:\n${audit.get({ plain: true })}`)
                throw parsed.error;
            }
            return parsed.data;
        });
    }

    static async create(
        attributes: ObligationCreateType,
    ): Promise<number> {
        console.log(attributes)
        try {
            return sequelize.transaction(async (transaction) => {
                const row = await ObligationModel.create(
                    {
                        dueDate: attributes.dueDate,
                        owner: attributes.owner,
                        requiresDocument: attributes.requiresDocument,
                        documentUrl: attributes.documentUrl ?? null,
                        description: attributes.description ?? null,
                        companyTaxId: attributes.companyTaxId,
                        title: attributes.title,
                        type: attributes.type,
                        state: "pending",
                        version: 1,
                    },
                    { transaction },
                );

                const _attributes = attributes as Record<string,unknown>;
                const changes = Object.keys(_attributes)
                    .map(field => {
                        const sanitized = serializeAuditValue(_attributes[field]);
                        if (sanitized === "") {
                            return null;
                        }

                        return {
                            field: field,
                            from: "",
                            to: sanitized,
                            date: row.updatedAt!,
                        };
                    })
                    .filter((change) => (change !== null));

                const obligationId = ObligationId.parse(row.id);
                await ObligationAudit.bulkCreate(obligationId, changes, transaction);

                return ObligationId.parse(row.id);
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                logger.error("API: error de validacion")
                error.errors.forEach(e => logger.error(e))
            }
            // console.log(error);
            // console.log(attributes);
            // console.log(`API: error de creacion: ${error.name}`)
            throw error;
        }
    }

    // attributes: ObligationSearchType,
    static async search(
    ): Promise<Array<ObligationPublicSchemaType>> {
        const obligations = await ObligationModel.findAll();
        return obligations
            .map((ob) => Obligation.toPublicSchema(ob))
            .filter((ob): ob is ObligationPublicSchemaType => ob !== null);
    }

    static toPublicSchema(
        obligation: ObligationModel,
    ): ObligationPublicSchemaType | null {
        const ob = {
            ...obligation.get({ plain: true }),
            companyTaxId: maskTaxId(obligation.companyTaxId),
            overdue: ObligationLogic.isOverdue(obligation),
        };
        const parsed = ObligationPublicSchema.safeParse(ob);
        if (!parsed.success) {
            logger.error(`API: Error de parseo de la obligacion ${obligation.id}`);
            return null;
        }
        return parsed.data;
    }
}

/* Clase de logicca separada de la base de datos y HTTP
 */
class ObligationLogic {
    static validateUpdate(
        obligation: ObligationModel,
        attributes: ObligationCreateType | ObligationUpdateType,
    ): boolean {
        if (obligation.state === "done" || obligation.state === "submitted") {
            const requiresDocument =
                attributes.requiresDocument ?? obligation.requiresDocument;
            const documentUrl =
                attributes.documentUrl ?? obligation.documentUrl;
            if (fieldChanged(requiresDocument, obligation.requiresDocument) ||
                fieldChanged(documentUrl, obligation.documentUrl)) {
                return false;
            }
        }

        return true;
    }

    static validateTransition(
        obligation: ObligationModel,
        from: ObligationStateType,
        to: ObligationStateType,
    ): boolean {
        if (!ALLOWED_TRANSITIONS[from].includes(to)) {
            return false;
        }

        if (
            to === "submitted" &&
            obligation.requiresDocument &&
            (obligation.documentUrl === null || obligation.documentUrl === undefined || obligation.documentUrl === "")
        ) {
            return false;
        }

        return true;
    }

    static isOverdue(obligation: ObligationModel): boolean {
        if (obligation.state === "done" || obligation.state === "submitted") {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(obligation.dueDate);
        due.setHours(0, 0, 0, 0);

        return due < today;
    }

    static isUpcomingDue(obligation: ObligationModel): boolean {
        if (obligation.state === "done" || obligation.state === "submitted") {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 8);

        const due = new Date(obligation.dueDate);
        due.setHours(0, 0, 0, 0);

        return due >= today && due < nextWeek;
    }
}

export { Obligation, ObligationLogic };
