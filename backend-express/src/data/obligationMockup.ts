type ObligationState = "pending" | "in_progress" | "submitted" | "done";

export type ObligationSeed = {
    id: number;
    type: string;
    title: string;
    description: string;
    state: ObligationState;
    dueDate: string;
    owner: string;
    requiresDocument: boolean;
    documentUrl: string | null;
    companyTaxId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
};

const obligations: ObligationSeed[] = [
    {
        id: 1,
        type: "annual_report",
        title: "Annual Report 2025",
        description: "File the annual report with the state registry.",
        state: "pending",
        dueDate: "2026-07-09T00:00:00.000Z",
        owner: "Alice Johnson",
        requiresDocument: true,
        documentUrl: null,
        companyTaxId: "12-3456789",
        createdAt: "2026-06-16T10:00:00.000Z",
        updatedAt: "2026-07-04T14:30:00.000Z",
        version: 1,
    },
    {
        id: 2,
        type: "franchise_tax",
        title: "Franchise Tax Payment",
        description: "Quarterly franchise tax submission.",
        state: "in_progress",
        dueDate: "2026-07-14T00:00:00.000Z",
        owner: "Bob Smith",
        requiresDocument: false,
        documentUrl: null,
        companyTaxId: "23-4564321",
        createdAt: "2026-06-21T09:15:00.000Z",
        updatedAt: "2026-07-05T11:00:00.000Z",
        version: 1,
    },
    {
        id: 3,
        type: "boi_report",
        title: "BOI Report Filing",
        description: "Beneficial ownership information report.",
        state: "submitted",
        dueDate: "2026-07-21T00:00:00.000Z",
        owner: "Carol Lee",
        requiresDocument: true,
        documentUrl: "/mock/boi-report.pdf",
        companyTaxId: "34-5679012",
        createdAt: "2026-06-06T08:00:00.000Z",
        updatedAt: "2026-07-03T16:45:00.000Z",
        version: 1,
    },
    {
        id: 4,
        type: "registered_agent_renewal",
        title: "Registered Agent Renewal",
        description: "Renew registered agent service for the entity.",
        state: "done",
        dueDate: "2026-07-01T00:00:00.000Z",
        owner: "David Kim",
        requiresDocument: false,
        documentUrl: null,
        companyTaxId: "45-6783456",
        createdAt: "2026-05-22T12:00:00.000Z",
        updatedAt: "2026-06-30T09:20:00.000Z",
        version: 1,
    },
    {
        id: 5,
        type: "annual_report",
        title: "Annual Report Amendment",
        description: "Amend previously filed annual report.",
        state: "pending",
        dueDate: "2026-07-04T00:00:00.000Z",
        owner: "Eve Martinez",
        requiresDocument: true,
        documentUrl: null,
        companyTaxId: "56-7897890",
        createdAt: "2026-06-26T15:30:00.000Z",
        updatedAt: "2026-07-05T08:10:00.000Z",
        version: 1,
    },
    {
        id: 6,
        type: "franchise_tax",
        title: "Franchise Tax Q2",
        description: "Second quarter franchise tax.",
        state: "in_progress",
        dueDate: "2026-07-31T00:00:00.000Z",
        owner: "Frank Wright",
        requiresDocument: false,
        documentUrl: null,
        companyTaxId: "67-8901122",
        createdAt: "2026-06-28T10:00:00.000Z",
        updatedAt: "2026-07-06T07:00:00.000Z",
        version: 1,
    },
    {
        id: 7,
        type: "boi_report",
        title: "BOI Update",
        description: "Update beneficial ownership details.",
        state: "pending",
        dueDate: "2026-07-07T00:00:00.000Z",
        owner: "Grace Hall",
        requiresDocument: true,
        documentUrl: null,
        companyTaxId: "78-9013344",
        createdAt: "2026-07-01T13:00:00.000Z",
        updatedAt: "2026-07-06T06:30:00.000Z",
        version: 1,
    },
    {
        id: 8,
        type: "registered_agent_renewal",
        title: "Agent Service Change",
        description: "Change registered agent provider.",
        state: "submitted",
        dueDate: "2026-07-18T00:00:00.000Z",
        owner: "Henry Clark",
        requiresDocument: true,
        documentUrl: "/mock/agent-change.pdf",
        companyTaxId: "89-0125566",
        createdAt: "2026-06-24T11:20:00.000Z",
        updatedAt: "2026-07-04T17:00:00.000Z",
        version: 1,
    },
];

export { obligations };
