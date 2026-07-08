import { init } from './lib/orm.js';
import Obligation from './models/obligation.js';
import ObligationAudit from './models/obligationAudit.js';
import { obligations } from './data/obligationMockup.js';
import { obligationAudits } from './data/obligationAuditMockup.js';
import { logger } from './lib/logging.js';

const initDB = async () => {
    await init();
    await Obligation.sync();
    await ObligationAudit.sync();
};

const seedDB = async () => {
    await init();
    for (const ob of obligations) {
        const row = Obligation.build(ob);
        await row.save();
    }
    for (const ob of obligationAudits) {
        const row = ObligationAudit.build(ob);
        await row.save();
    }
};

const dropDB = async () => {
    await init();
    await ObligationAudit.drop();
    await Obligation.drop({ cascade: true });
};

async function main() {
    if (process.argv[2] === '-D') {
        await dropDB();
    } else {
        await initDB();
        await seedDB();
    }
}

main().catch(error => {
    logger.error(error);
    process.exit(1);
});
