import { z } from "zod";
import { ObligationAuditSchema } from "@/schemas/obligationAuditSchema";
import {
  ObligationCreate,
  ObligationPublicSchema,
  ObligationUpdate,
} from "@/schemas/obligationSchema";
import type {
  Obligation,
  ObligationAudit,
  ObligationFormValues,
  ObligationState,
} from "./types";

export class ObligationLogic {
  isOverdue(obligation: {
    state: ObligationState;
    dueDate: Date | string;
  }): boolean {
    if (obligation.state === "done" || obligation.state === "submitted") {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(obligation.dueDate);
    due.setHours(0, 0, 0, 0);

    return due < today;
  }

  fromPublic(parsed: z.infer<typeof ObligationPublicSchema>): Obligation {
    return {
      id: String(parsed.id),
      state: parsed.state,
      dueDate: parsed.dueDate.toISOString(),
      owner: parsed.owner,
      requiresDocument: parsed.requiresDocument,
      documentUrl: parsed.documentUrl,
      companyTaxId: parsed.companyTaxId,
      title: parsed.title,
      type: parsed.type,
      description: parsed.description ?? "",
      createdAt: parsed.createdAt.toISOString(),
      updatedAt: parsed.updatedAt.toISOString(),
      overdue: this.isOverdue(parsed),
    };
  }

  withOverdue(obligation: Obligation): Obligation {
    return {
      ...obligation,
      overdue: this.isOverdue(obligation),
    };
  }

  parseAudit(body: unknown): ObligationAudit[] {
    const raw: unknown = typeof body === "string" ? JSON.parse(body) : body;

    if (!Array.isArray(raw)) {
      throw new Error("Invalid audit response");
    }

    return raw.map((row) => {
      const parsed = ObligationAuditSchema.parse(row);
      return {
        field: parsed.field,
        from: parsed.from,
        to: parsed.to,
        date: parsed.date.toISOString(),
      };
    });
  }

  buildCreateBody(values: ObligationFormValues) {
    const payload: Record<string, unknown> = {
      type: values.type,
      title: values.title,
      owner: values.owner,
      dueDate: values.dueDate,
      companyTaxId: values.companyTaxId,
      requiresDocument: values.requiresDocument,
      documentUrl: values.requiresDocument ? values.documentUrl : null,
    };

    if (values.description.trim()) {
      payload.description = values.description;
    }

    const parsed = ObligationCreate.safeParse(payload);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return parsed.data;
  }

  buildUpdateBody(values: ObligationFormValues) {
    const payload: Record<string, unknown> = {
      type: values.type,
      title: values.title,
      owner: values.owner,
      dueDate: values.dueDate,
      requiresDocument: values.requiresDocument,
      documentUrl: values.requiresDocument ? values.documentUrl : null,
    };

    if (values.description.trim()) {
      payload.description = values.description;
    }

    if (values.companyTaxId.trim()) {
      payload.companyTaxId = values.companyTaxId;
    }

    const parsed = ObligationUpdate.safeParse(payload);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }
    return parsed.data;
  }
}
