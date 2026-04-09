import type {
	ContentFormat,
	EmailSequenceLength,
	LinkedinInmailVariation,
	NurtureTemplate,
	SearceService,
	StrategicAngle,
} from "@/lib/types";

// ─── Industries ─────────────────────────────────────────────────────────────

export const INDUSTRIES = [
	{ value: "TTL", label: "Travel, Transport & Logistics" },
	{ value: "TSS", label: "Technology, Software & SaaS" },
	{ value: "MIC", label: "Manufacturing, Industrial & Construction" },
	{ value: "HLS", label: "Healthcare & Life Sciences" },
	{ value: "FSI", label: "Financial Services & Insurance" },
	{ value: "RCE", label: "Retail, CPG & E-commerce" },
	{ value: "PSE", label: "Public Sector & Education" },
	{ value: "NEU", label: "Energy & Utilities" },
	{ value: "TMEG", label: "Telecom, Media & Gaming" },
	{ value: "MISC", label: "Other Industries" },
] as const;

export const INDUSTRY_LABELS: Record<string, string> = Object.fromEntries(
	INDUSTRIES.map((i) => [i.value, i.label]),
);

// ─── Persona Functions & Sub-Functions ──────────────────────────────────────

export const PERSONA_FUNCTIONS = [
	{ value: "cxo", label: "CXO / Executive" },
	{ value: "consulting", label: "Consulting" },
	{ value: "data", label: "Data" },
	{ value: "engineering", label: "Engineering" },
	{ value: "entrepreneurship", label: "Entrepreneurship" },
	{ value: "finance", label: "Finance" },
	{ value: "hr", label: "Human Resources" },
	{ value: "it", label: "Information Technology" },
	{ value: "legal", label: "Legal" },
	{ value: "marketing", label: "Marketing" },
	{ value: "media-comms", label: "Media & Communication" },
	{ value: "military-protective", label: "Military & Protective Services" },
	{ value: "operations", label: "Operations" },
	{ value: "product-management", label: "Product Management" },
	{ value: "program-project-mgmt", label: "Program & Project Management" },
	{ value: "purchasing", label: "Purchasing" },
	{ value: "quality-assurance", label: "Quality Assurance" },
	{ value: "research", label: "Research" },
	{ value: "sales", label: "Sales" },
	{ value: "customer-success", label: "Customer Success" },
] as const;

export const SUB_FUNCTIONS: Record<string, { value: string; label: string }[]> = {
	cxo: [
		{ value: "ceo", label: "CEO / Managing Director" },
		{ value: "cto", label: "CTO / VP Engineering" },
		{ value: "cio", label: "CIO / Chief Digital Officer" },
		{ value: "cfo", label: "CFO / Finance Director" },
		{ value: "cdo", label: "Chief Data Officer" },
	],
	consulting: [
		{ value: "strategy-consulting", label: "Strategy Consulting" },
		{ value: "tech-consulting", label: "Technology Consulting" },
		{ value: "management-consulting", label: "Management Consulting" },
	],
	data: [
		{ value: "data-engineering", label: "Data Engineering" },
		{ value: "data-science", label: "Data Science" },
		{ value: "data-analytics", label: "Data Analytics" },
		{ value: "data-governance", label: "Data Governance" },
	],
	engineering: [
		{ value: "cloud-ops", label: "Cloud Operations" },
		{ value: "app-dev", label: "Application Development" },
		{ value: "infrastructure", label: "Infrastructure" },
		{ value: "devops", label: "DevOps / SRE" },
		{ value: "platform-eng", label: "Platform Engineering" },
	],
	entrepreneurship: [
		{ value: "founder", label: "Founder / Co-Founder" },
		{ value: "startup-ops", label: "Startup Operations" },
	],
	finance: [
		{ value: "fp-and-a", label: "FP&A" },
		{ value: "accounting", label: "Accounting" },
		{ value: "treasury", label: "Treasury" },
		{ value: "finops", label: "FinOps" },
	],
	hr: [
		{ value: "talent-acquisition", label: "Talent Acquisition" },
		{ value: "people-ops", label: "People Operations" },
		{ value: "learning-dev", label: "Learning & Development" },
	],
	it: [
		{ value: "it-infrastructure", label: "IT Infrastructure" },
		{ value: "cyber-security", label: "Cyber Security" },
		{ value: "it-governance", label: "IT Governance" },
		{ value: "enterprise-architecture", label: "Enterprise Architecture" },
	],
	legal: [
		{ value: "compliance", label: "Compliance & Regulatory" },
		{ value: "contracts", label: "Contracts & Procurement" },
		{ value: "ip-law", label: "IP & Technology Law" },
	],
	marketing: [
		{ value: "demand-gen", label: "Demand Generation" },
		{ value: "product-marketing", label: "Product Marketing" },
		{ value: "brand-marketing", label: "Brand & Communications" },
		{ value: "growth", label: "Growth Marketing" },
	],
	"media-comms": [
		{ value: "content-strategy", label: "Content Strategy" },
		{ value: "pr", label: "Public Relations" },
		{ value: "corporate-comms", label: "Corporate Communications" },
	],
	"military-protective": [
		{ value: "security-ops", label: "Security Operations" },
		{ value: "risk-management", label: "Risk Management" },
	],
	operations: [
		{ value: "supply-chain", label: "Supply Chain" },
		{ value: "logistics", label: "Logistics" },
		{ value: "procurement", label: "Procurement" },
		{ value: "business-ops", label: "Business Operations" },
	],
	"product-management": [
		{ value: "product-strategy", label: "Product Strategy" },
		{ value: "product-owner", label: "Product Owner" },
		{ value: "technical-pm", label: "Technical Product Manager" },
	],
	"program-project-mgmt": [
		{ value: "program-mgmt", label: "Program Management" },
		{ value: "project-mgmt", label: "Project Management" },
		{ value: "pmo", label: "PMO" },
	],
	purchasing: [
		{ value: "strategic-sourcing", label: "Strategic Sourcing" },
		{ value: "vendor-mgmt", label: "Vendor Management" },
	],
	"quality-assurance": [
		{ value: "qa-testing", label: "QA & Testing" },
		{ value: "process-quality", label: "Process Quality" },
	],
	research: [
		{ value: "r-and-d", label: "R&D" },
		{ value: "market-research", label: "Market Research" },
		{ value: "innovation", label: "Innovation" },
	],
	sales: [
		{ value: "enterprise-sales", label: "Enterprise Sales" },
		{ value: "inside-sales", label: "Inside Sales" },
		{ value: "sales-ops", label: "Sales Operations" },
		{ value: "account-management", label: "Account Management" },
	],
	"customer-success": [
		{ value: "onboarding", label: "Customer Onboarding" },
		{ value: "support", label: "Customer Support" },
		{ value: "success-management", label: "Success Management" },
	],
};

export const FUNCTION_LABELS: Record<string, string> = Object.fromEntries(
	PERSONA_FUNCTIONS.map((f) => [f.value, f.label]),
);

// ─── Cloud Ecosystems ───────────────────────────────────────────────────────

export const CLOUD_ECOSYSTEMS = [
	{ value: "gcp", label: "Google Cloud", icon: "☁️" },
	{ value: "aws", label: "AWS", icon: "🔶" },
	{ value: "multicloud", label: "Multi-Cloud", icon: "🌐" },
] as const;

// ─── Content Formats ────────────────────────────────────────────────────────

export const CONTENT_FORMATS: { value: ContentFormat; label: string; description: string }[] = [
	{ value: "cold_email", label: "Cold Email", description: "First-touch outbound email" },
	{ value: "sales_email", label: "Sales Email", description: "Solution-oriented sales pitch" },
	{ value: "nurture_email", label: "Nurture Email", description: "Value-driven follow-up" },
	{
		value: "email_sequence",
		label: "Email Sequence",
		description: "Multi-touch cadence (3, 5, or 6 emails)",
	},
	{
		value: "linkedin_inmail",
		label: "LinkedIn InMail",
		description: "Personal, low-pressure outreach",
	},
	{
		value: "linkedin_conversational_ad",
		label: "LinkedIn Conversation Ad",
		description: "Choose-your-own-path Sponsored Messaging flow",
	},
];

export const NURTURE_TEMPLATE_OPTIONS: {
	value: NurtureTemplate;
	label: string;
	description: string;
}[] = [
	{
		value: "1",
		label: "Template 1 — Introduction",
		description: "Dear [Name] intro, role relevance, proof line, 15-min ask",
	},
	{
		value: "2",
		label: "Template 2 — Post-call / capabilities",
		description: "Thank-you opener, service pillars, 30-min + contact CTA",
	},
	{
		value: "3",
		label: "Template 3 — Industry provocation",
		description: "Short strategic hook, sector proof, 10-min ask",
	},
];

export const EMAIL_SEQUENCE_LENGTH_OPTIONS: {
	value: EmailSequenceLength;
	label: string;
}[] = [
	{ value: 3, label: "3 emails (open → proof → closer)" },
	{ value: 5, label: "5 emails (full arc)" },
	{ value: 6, label: "6 emails (+ strategic check-in)" },
];

export const LINKEDIN_INMAIL_VARIATION_OPTIONS: {
	value: LinkedinInmailVariation;
	label: string;
	description: string;
}[] = [
	{
		value: "1",
		label: "Variation 1 — Leadership / role",
		description: "AI-native angle, event/booth hooks, bullet value props",
	},
	{
		value: "2",
		label: "Variation 2 — VIP / 1:1",
		description: "Quiet space, company-specific session, checklist + book CTA",
	},
];

// ─── Searce Services ────────────────────────────────────────────────────────

export const SEARCE_SERVICES: { value: SearceService; label: string; description: string }[] = [
	{
		value: "cloud_modernization",
		label: "Cloud Modernisation",
		description: "Migration, infra modernization, multi-cloud",
	},
	{
		value: "data_analytics",
		label: "Data & Analytics",
		description: "Data platform, BI, lakehouse, streaming",
	},
	{
		value: "ai_automation",
		label: "Applied AI (GenAI/ML)",
		description: "Gen AI, ML ops, intelligent automation",
	},
	{
		value: "location_intelligence",
		label: "Location Intelligence",
		description: "Geospatial analytics, maps, fleet management",
	},
	{
		value: "devops_platform_engineering",
		label: "Software Engineering",
		description: "CI/CD, Kubernetes, platform as a product",
	},
	{
		value: "finops_cost_optimization",
		label: "Managed Services",
		description: "Cloud cost management, SRE, monitoring",
	},
	{
		value: "enterprise_transformation",
		label: "Future of Work",
		description: "Workspace, app modernization, change management",
	},
];

// ─── Regions ────────────────────────────────────────────────────────────────

export const REGIONS = [
	{ value: "AMER", label: "Americas" },
	{ value: "APAC", label: "Asia Pacific" },
	{ value: "EMEA", label: "Europe, Middle East & Africa" },
	{ value: "India", label: "India" },
] as const;

export const REGION_LABELS: Record<string, string> = Object.fromEntries(
	REGIONS.map((r) => [r.value, r.label]),
);

// ─── Confidence Thresholds ──────────────────────────────────────────────────

export const CONFIDENCE = {
	HIGH: 0.8,
	MEDIUM: 0.5,
	LOW: 0.3,
} as const;

export function confidenceLabel(score: number): "High" | "Medium" | "Low" {
	if (score >= CONFIDENCE.HIGH) return "High";
	if (score >= CONFIDENCE.MEDIUM) return "Medium";
	return "Low";
}

export function confidenceColor(score: number): string {
	if (score >= CONFIDENCE.HIGH) return "text-green-600 dark:text-green-400";
	if (score >= CONFIDENCE.MEDIUM) return "text-yellow-600 dark:text-yellow-400";
	return "text-red-500 dark:text-red-400";
}

// ─── Strategic Angles ───────────────────────────────────────────────────────

export const STRATEGIC_ANGLES: { value: StrategicAngle; label: string; description: string }[] = [
	{ value: "pain_point", label: "Pain Point", description: "Empathetic problem-first approach" },
	{ value: "roi_metrics", label: "ROI / Metrics", description: "Data-driven value narrative" },
	{ value: "social_proof", label: "Social Proof", description: "Case study-led storytelling" },
	{
		value: "direct_pitch",
		label: "Direct Pitch",
		description: "Confident, solution-first pitch",
	},
];
