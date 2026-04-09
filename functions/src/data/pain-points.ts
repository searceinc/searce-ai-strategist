import { INDUSTRY_LABELS } from "./labels.js";

const PAIN_POINTS: Record<string, (industryName: string) => string[]> = {
	cxo: (ind) => [
		`Lack of unified digital transformation strategy across ${ind} business units`,
		"Difficulty quantifying ROI of cloud and AI investments to the board",
		"Siloed technology decisions leading to redundant spend and complexity",
		"Inability to attract and retain top digital talent",
	],
	consulting: (ind) => [
		`Clients in ${ind} demand faster time-to-value from transformation engagements`,
		"Difficulty differentiating advisory services with tangible tech outcomes",
		"Lack of access to proven implementation frameworks and case studies",
	],
	data: (ind) => [
		`Data silos across ${ind} preventing unified analytics and decision-making`,
		"Legacy data warehouses unable to handle real-time processing demands",
		"Lack of data governance and quality frameworks slowing AI adoption",
		"Difficulty scaling data pipelines to meet growing business needs",
	],
	engineering: (ind) => [
		`Managing legacy infrastructure that can't scale to meet ${ind} demands`,
		"Struggling with multi-cloud complexity and lack of unified visibility",
		"High operational overhead from managing on-premise data centers",
		"Slow release cycles due to lack of modern CI/CD and platform engineering",
	],
	entrepreneurship: (ind) => [
		"Need to build scalable cloud infrastructure from day one without overspending",
		"Difficulty choosing the right cloud architecture for rapid growth",
		`Finding the right technology partner who understands ${ind} startup challenges`,
	],
	sales: (ind) => [
		`Difficulty accessing real-time prospect intelligence for ${ind} accounts`,
		"Lack of data-driven insights to personalize outreach at scale",
		"Long sales cycles due to inability to demonstrate clear ROI quickly",
		"Siloed CRM data preventing unified view of customer journey",
	],
	marketing: (ind) => [
		"Inability to measure true campaign ROI across digital channels",
		"Fragmented marketing tech stack limiting personalization capabilities",
		`Challenge reaching ${ind} decision-makers with relevant messaging`,
		"Lack of AI-powered attribution modeling for accurate budget allocation",
	],
	it: (ind) => [
		`Managing legacy infrastructure that can't scale to meet ${ind} demands`,
		"Struggling with multi-cloud complexity and lack of unified visibility",
		"Security vulnerabilities from outdated systems and manual patching processes",
		"High operational overhead from managing on-premise data centers",
	],
	finance: () => [
		"Manual financial processes limiting real-time visibility and forecasting",
		"Compliance burden from fragmented data across legacy systems",
		"Inability to optimize cloud spending and demonstrate IT ROI",
		"Slow month-end close processes due to data reconciliation challenges",
	],
	legal: (ind) => [
		"Difficulty ensuring compliance with evolving data privacy regulations",
		"Manual contract review processes slowing deal velocity",
		`Regulatory complexity in ${ind} increasing legal risk exposure`,
	],
	"media-comms": (ind) => [
		"Fragmented content workflows limiting speed and quality of output",
		"Inability to measure content performance across channels in real-time",
		`Difficulty maintaining consistent messaging across ${ind} campaigns`,
	],
	"military-protective": () => [
		"Legacy security systems unable to detect modern cyber threats",
		"Need for real-time threat intelligence and automated response capabilities",
		"Compliance requirements demanding continuous monitoring and audit trails",
	],
	operations: (ind) => [
		`Operational inefficiencies costing ${ind} organizations millions annually`,
		"Lack of real-time visibility across supply chain and logistics",
		"Manual processes preventing scale and agility",
		"Difficulty predicting demand and optimizing resource allocation",
	],
	"product-management": (ind) => [
		"Lack of data-driven insights to prioritize product roadmap decisions",
		"Slow feedback loops between customer usage data and product iterations",
		`Difficulty scaling product infrastructure to meet ${ind} growth demands`,
	],
	"program-project-mgmt": () => [
		"Lack of real-time visibility into project health and resource utilization",
		"Manual reporting processes consuming valuable project management time",
		"Difficulty managing cross-functional dependencies in cloud transformation programs",
	],
	purchasing: () => [
		"Fragmented vendor landscape making cloud procurement decisions complex",
		"Inability to benchmark cloud spending against industry standards",
		"Manual procurement workflows slowing technology acquisition",
	],
	"quality-assurance": () => [
		"Manual testing processes unable to keep pace with rapid release cycles",
		"Lack of automated quality gates in CI/CD pipelines",
		"Difficulty ensuring performance and reliability at scale",
	],
	research: (ind) => [
		"Slow access to compute resources limiting research iteration speed",
		"Data silos preventing cross-functional research collaboration",
		`Need for scalable ML infrastructure to accelerate ${ind} innovation`,
	],
	hr: () => [
		"Challenge attracting top talent due to outdated technology perception",
		"Manual onboarding processes reducing new hire productivity",
		"Lack of data-driven insights for workforce planning",
		"Difficulty measuring employee engagement and retention drivers",
	],
	"customer-success": () => [
		"Reactive customer support instead of proactive engagement",
		"Inability to predict churn and take preventive action",
		"Siloed customer data preventing unified service experience",
		"Manual processes limiting ability to scale support operations",
	],
};

export function getFunctionPainPoints(
	personaFunction: string,
	_subFunction: string,
	industryCode: string,
): string[] {
	const industryName = INDUSTRY_LABELS[industryCode] ?? "your industry";
	const builder = PAIN_POINTS[personaFunction] ?? PAIN_POINTS.it!;
	return builder(industryName);
}
