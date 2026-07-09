import { init } from "./lib/orm.js";
import Obligation from "./models/obligation.js";
import ObligationAudit from "./models/obligationAudit.js";
import { obligations } from "./data/obligationMockup.js";
import { obligationAudits } from "./data/obligationAuditMockup.js";
import { logger } from "./lib/logging.js";
import { ObligationSchema } from "./schemas/obligationSchema.js";

const initDB = async (): Promise<void> => {
    await init();
    await Obligation.sync();
    await ObligationAudit.sync();
};

const seedDB = async (): Promise<void> => {
    await init();
    for (const ob of obligations) {
        const parsed = ObligationSchema.parse(ob);
        const row = Obligation.build({...parsed, version: 1});
        await row.save();
    }
    for (const ob of obligationAudits) {
        const { createdAt, ...rest } = ob;
        await ObligationAudit.create({
            ...rest,
            date: new Date(createdAt),
        });
    }
};

const dropDB = async (): Promise<void> => {
    await init();
    await ObligationAudit.drop();
    await Obligation.drop({ cascade: true });
};

async function main(): Promise<void> {
    if (process.argv[2] === "-D") {
        await dropDB();
    } else {
        await initDB();
        await seedDB();
    }
}

main().catch((error: unknown) => {
    logger.error(error);
    process.exit(1);
});
