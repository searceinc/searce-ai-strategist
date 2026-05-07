import { migrateIndustryCode } from "./legacy-codes.js";

const METRICS: Record<string, string[]> = {
	TTL: [
		"According to Gartner, 78% of logistics companies investing in cloud analytics see 25%+ improvement in route optimization",
		"IDC reports that travel companies using AI-powered personalization achieve 40% higher conversion rates",
		"Industry Standard: McKinsey shows transportation companies with real-time visibility reduce operational costs by 15-20%",
	],
	TSS: [
		"Gartner indicates 85% of tech companies prioritizing platform engineering report 50% faster deployment cycles",
		"IDC research shows software companies on modern cloud infrastructure reduce operational costs by 35%",
		"Industry Standard: Forrester reports SaaS companies with mature DevOps practices achieve 3x faster time-to-market",
	],
	MCM: [
		"According to McKinsey, manufacturers adopting IoT and cloud analytics see 20-25% production efficiency gains",
		"IDC reports construction firms using cloud collaboration tools complete projects 18% faster",
		"Industry Standard: Gartner shows smart factory implementations reduce unplanned downtime by 45%",
	],
	HLS: [
		"HIMSS research indicates healthcare organizations leveraging cloud achieve 30% faster clinical decision support",
		"Gartner reports life sciences companies using AI/ML reduce drug discovery timelines by 25%",
		"Industry Standard: IDC shows healthcare data platforms improve regulatory compliance reporting by 40%",
	],
	FSI: [
		"McKinsey shows financial institutions on cloud infrastructure reduce fraud detection time by 70%",
		"Gartner indicates banks using real-time analytics improve customer retention by 35%",
		"Industry Standard: Forrester reports fintech companies with modern data platforms achieve 50% faster credit decisioning",
	],
	RCE: [
		"IDC reports retailers using AI-powered demand forecasting reduce inventory costs by 30%",
		"Gartner shows e-commerce platforms on modern cloud achieve 99.95% uptime during peak seasons",
		"Industry Standard: McKinsey indicates personalization engines drive 10-15% revenue increase for retailers",
	],
	PSE: [
		"Gartner indicates government agencies modernizing to cloud reduce IT operational costs by 40%",
		"IDC shows educational institutions using cloud LMS improve student engagement by 35%",
		"Industry Standard: Forrester reports public sector cloud adoption improves citizen service delivery by 25%",
	],
	EUP: [
		"McKinsey reports energy companies using predictive analytics reduce equipment failures by 35%",
		"IDC shows utilities leveraging IoT and cloud achieve 25% improvement in grid efficiency",
		"Industry Standard: Gartner indicates renewable energy companies with cloud analytics optimize output by 20%",
	],
	TMEG: [
		"Gartner indicates media companies on cloud streaming infrastructure achieve 99.99% content availability",
		"IDC reports telecom operators using AI reduce network incidents by 45%",
		"Industry Standard: McKinsey shows gaming companies with cloud-native architecture reduce latency by 60%",
	],
	MISC: [
		"Gartner research shows organizations adopting cloud-first strategies achieve 30% faster time-to-market",
		"IDC indicates companies with mature cloud operations reduce IT costs by 25-40%",
		"Industry Standard: McKinsey reports digital transformation initiatives deliver 3x ROI within 18 months",
	],
};

export function getIndustryMetrics(industryCode: string): string[] {
	const canonical = migrateIndustryCode(industryCode);
	return METRICS[canonical] ?? METRICS.MISC!;
}
