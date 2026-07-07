import "server-only";
import type {
  DashboardSummary,
  Obligation,
  ObligationDetail,
  ObligationStatus,
} from "@/lib/types/obligation";

const now = new Date();

function daysFromNow(days: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function daysAgo(days: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

const mockObligations: Obligation[] = [
  {
    id: "1",
    type: "annual_report",
    title: "Annual Report 2025",
    description: "File the annual report with the state registry.",
    status: "pending",
    dueDate: daysFromNow(3),
    owner: "Alice Johnson",
    requiresDocument: true,
    documentUrl: null,
    companyTaxId: "••••6789",
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2),
    overdue: false,
  },
  {
    id: "2",
    type: "franchise_tax",
    title: "Franchise Tax Payment",
    description: "Quarterly franchise tax submission.",
    status: "in_progress",
    dueDate: daysFromNow(8),
    owner: "Bob Smith",
    requiresDocument: false,
    documentUrl: null,
    companyTaxId: "••••4321",
    createdAt: daysAgo(15),
    updatedAt: daysAgo(1),
    overdue: false,
  },
  {
    id: "3",
    type: "boi_report",
    title: "BOI Report Filing",
    description: "Beneficial ownership information report.",
    status: "submitted",
    dueDate: daysFromNow(15),
    owner: "Carol Lee",
    requiresDocument: true,
    documentUrl: "/mock/boi-report.pdf",
    companyTaxId: "••••9012",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(3),
    overdue: false,
  },
  {
    id: "4",
    type: "registered_agent_renewal",
    title: "Registered Agent Renewal",
    description: "Renew registered agent service for the entity.",
    status: "done",
    dueDate: daysAgo(5),
    owner: "David Kim",
    requiresDocument: false,
    documentUrl: null,
    companyTaxId: "••••3456",
    createdAt: daysAgo(45),
    updatedAt: daysAgo(6),
    overdue: false,
  },
  {
    id: "5",
    type: "annual_report",
    title: "Annual Report Amendment",
    description: "Amend previously filed annual report.",
    status: "pending",
    dueDate: daysAgo(2),
    owner: "Eve Martinez",
    requiresDocument: true,
    documentUrl: null,
    companyTaxId: "••••7890",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
    overdue: true,
  },
  {
    id: "6",
    type: "franchise_tax",
    title: "Franchise Tax Q2",
    description: "Second quarter franchise tax.",
    status: "in_progress",
    dueDate: daysFromNow(25),
    owner: "Frank Wright",
    requiresDocument: false,
    documentUrl: null,
    companyTaxId: "••••1122",
    createdAt: daysAgo(8),
    updatedAt: daysAgo(0),
    overdue: false,
  },
  {
    id: "7",
    type: "boi_report",
    title: "BOI Update",
    description: "Update beneficial ownership details.",
    status: "pending",
    dueDate: daysFromNow(1),
    owner: "Grace Hall",
    requiresDocument: true,
    documentUrl: null,
    companyTaxId: "••••3344",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(0),
    overdue: false,
  },
  {
    id: "8",
    type: "registered_agent_renewal",
    title: "Agent Service Change",
    description: "Change registered agent provider.",
    status: "submitted",
    dueDate: daysFromNow(12),
    owner: "Henry Clark",
    requiresDocument: true,
    documentUrl: "/mock/agent-change.pdf",
    companyTaxId: "••••5566",
    createdAt: daysAgo(12),
    updatedAt: daysAgo(2),
    overdue: false,
  },
  {
    id: "9",
    type: "annual_report",
    title: "Annual Report Extension",
    description: "Request extension for annual report filing.",
    status: "done",
    dueDate: daysFromNow(40),
    owner: "Ivy Nguyen",
    requiresDocument: false,
    documentUrl: null,
    companyTaxId: "••••7788",
    createdAt: daysAgo(60),
    updatedAt: daysAgo(10),
    overdue: false,
  },
  {
    id: "10",
    type: "franchise_tax",
    title: "Franchise Tax Late Filing",
    description: "Late filing for previous quarter.",
    status: "pending",
    dueDate: daysFromNow(6),
    owner: "Jack Brown",
    requiresDocument: true,
    documentUrl: null,
    companyTaxId: "••••9900",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    overdue: false,
  },
  {
    id: "11",
    type: "boi_report",
    title: "BOI Compliance Review",
    description: "Internal review before BOI submission.",
    status: "in_progress",
    dueDate: daysFromNow(18),
    owner: "Kate Wilson",
    requiresDocument: false,
    documentUrl: null,
    companyTaxId: "••••1212",
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
    overdue: false,
  },
  {
    id: "12",
    type: "registered_agent_renewal",
    title: "Multi-State Agent Renewal",
    description: "Renew agents across multiple states.",
    status: "pending",
    dueDate: daysFromNow(30),
    owner: "Leo Garcia",
    requiresDocument: true,
    documentUrl: null,
    companyTaxId: "••••3434",
    createdAt: daysAgo(14),
    updatedAt: daysAgo(4),
    overdue: false,
  },
];

const transitionMap: Record<ObligationStatus, ObligationStatus[]> = {
  pending: ["in_progress"],
  in_progress: ["submitted", "pending"],
  submitted: ["done", "in_progress"],
  done: ["in_progress"],
};

export function getMockDashboardSummary(): DashboardSummary {
  const upcomingDue = [...mockObligations]
    .filter((o) => !["submitted", "done"].includes(o.status))
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 10);

  const upcomingWindow = new Date(now);
  upcomingWindow.setDate(upcomingWindow.getDate() + 30);

  return {
    total: mockObligations.length,
    overdue: mockObligations.filter((o) => o.overdue).length,
    upcoming: mockObligations.filter((o) => {
      const due = new Date(o.dueDate);
      return due >= now && due <= upcomingWindow && !o.overdue;
    }).length,
    pending: mockObligations.filter((o) => o.status === "pending").length,
    inProgress: mockObligations.filter((o) => o.status === "in_progress")
      .length,
    submitted: mockObligations.filter((o) => o.status === "submitted").length,
    done: mockObligations.filter((o) => o.status === "done").length,
    upcomingDue,
  };
}

export function getMockObligationDetail(id: string): ObligationDetail | null {
  const obligation = mockObligations.find((item) => item.id === id);
  if (!obligation) {
    return null;
  }

  return {
    ...obligation,
    auditTrail: [
      { from: "pending", to: "in_progress", at: daysAgo(4) },
      { from: "in_progress", to: obligation.status, at: daysAgo(1) },
    ],
    allowedTransitions: transitionMap[obligation.status] ?? [],
  };
}

export function getMockObligations(): Obligation[] {
  return mockObligations;
}
