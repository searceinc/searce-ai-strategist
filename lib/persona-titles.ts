/**
 * Master persona title list ("3. target_personas - target personas.pdf" in
 * files_usecase_ref/). Fixed vocabulary of (functional category, title) pairs
 * used to populate the Persona Identity "Title" dropdown in persona mode.
 *
 * This is a UI convenience only — GenerationInput.targetPersonaJobTitle stays
 * a free string server-side, so a rep can still type a custom title outside
 * this list (see the "Custom title" fallback in ConfigPanel).
 */

export interface PersonaTitleOption {
	category: string;
	title: string;
}

export const PERSONA_TITLES: PersonaTitleOption[] = [
	{ category: "Information Technology", title: "CIO" },
	{ category: "Information Technology", title: "CTO" },
	{ category: "Information Technology", title: "Head/VP/Director – IT" },
	{ category: "Information Technology", title: "Head/VP/Director – Technology" },
	{ category: "Engineering & Product", title: "Head/VP/Director – Engineering" },
	{ category: "Engineering & Product", title: "Engineering Leader" },
	{ category: "Engineering & Product", title: "CPO" },
	{ category: "Engineering & Product", title: "Head/VP/Director – Product" },
	{ category: "Data & Analytics", title: "Chief Data Officer" },
	{ category: "Data & Analytics", title: "Head/VP/Director – Data" },
	{ category: "Data & Analytics", title: "Head/VP/Director – Analytics" },
	{ category: "AI/ML", title: "Head/VP/Director – Data Science" },
	{ category: "AI/ML", title: "Head/VP/Director – AI/ML" },
	{ category: "AI/ML", title: "Data Scientist" },
	{ category: "Digital", title: "CDO" },
	{ category: "Digital", title: "Head/VP/Director – Digital" },
	{ category: "Digital", title: "Head/VP/Director – Innovation" },
	{ category: "Digital", title: "Head/VP/Director – Strategy" },
	{ category: "Digital", title: "Head/VP/Director – Growth" },
	{ category: "Infra & Security", title: "Head/VP/Director – Infra" },
	{ category: "Infra & Security", title: "Head/VP/Director – Security" },
	{ category: "Infra & Security", title: "CISO" },
	{ category: "Owner", title: "CEO" },
	{ category: "Owner", title: "Founder/Co-founder" },
	{ category: "Owner", title: "Managing Director" },
	{ category: "Operations", title: "COO" },
	{ category: "Operations", title: "Head/VP/Director – Operations" },
	{ category: "CCAI", title: "Head/VP/Director – Customer Care" },
	{ category: "CCAI", title: "Head/VP/Director – Contact Center" },
	{ category: "CCAI", title: "Head/VP/Director – Customer Experience" },
	{ category: "Marketing", title: "CMO/CGO" },
	{ category: "Marketing", title: "Head/VP/Director – Marketing" },
	{ category: "Marketing", title: "Head/VP/Director – Growth" },
	{ category: "Others", title: "Head/VP/Director – Supply Chain" },
	{ category: "Others", title: "Head/VP/Director – Ecommerce" },
	{ category: "Others", title: "Head/VP/Director – Digital Banking" },
	{ category: "Others", title: "Chief Merchandising Officer" },
	{ category: "Others", title: "Head/VP/Director – Merchandising" },
	{ category: "Others", title: "Head/VP/Director – Merchandise Planning" },
];

export const PERSONA_TITLE_CATEGORIES: string[] = Array.from(
	new Set(PERSONA_TITLES.map((t) => t.category)),
);

export function personaTitlesByCategory(category: string): PersonaTitleOption[] {
	return PERSONA_TITLES.filter((t) => t.category === category);
}

export const PERSONA_TYPE_OPTIONS: { value: string; label: string; description: string }[] = [
	{
		value: "champion",
		label: "Champion / Coach",
		description: "Internal advocate who wants this to happen and can guide the deal.",
	},
	{
		value: "economic_buyer",
		label: "Economic Buyer",
		description: "Controls budget; cares about cost, risk, and ROI.",
	},
	{
		value: "influencer_user",
		label: "Influencer / User",
		description: "Hands-on user or technical evaluator; cares about fit and workflow.",
	},
	{
		value: "blocker",
		label: "Blocker",
		description: "Skeptical or has competing priorities; needs risk/status-quo addressed.",
	},
];

export const PERSONA_ENTRANCE_PATH_OPTIONS: { value: string; label: string }[] = [
	{ value: "bottoms_up", label: "Bottoms-up (practitioner in)" },
	{ value: "top_down", label: "Top-down (executive in)" },
	{ value: "middle_out", label: "Middle-out (manager/director in)" },
];
