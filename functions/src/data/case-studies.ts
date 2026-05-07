import type { VerifiedCaseStudy } from "../types.js";
import { REGION_FALLBACKS } from "./labels.js";
import { migrateIndustryCode } from "./legacy-codes.js";

/**
 * Verified case studies. The `categories` field uses sheet-driven category
 * slugs (e.g. "banking", "logistics-and-warehousing") so we can match to the
 * configured industry → category combination. The legacy `departments` field
 * has been retired along with persona-function.
 */
export const VERIFIED_CASE_STUDIES: VerifiedCaseStudy[] = [
	{
		id: "cs-rebel-foods",
		title: "Rebel Foods: Cloud-Native Food Tech Transformation",
		client: "Rebel Foods",
		metrics: "60% improvement in delivery accuracy, 40% reduction in order processing time",
		url: "https://www.searce.com/archive/cs-123-detail",
		industries: ["RCE"],
		regions: ["India", "APAC"],
		categories: ["e-commerce-digital-channels", "retail-channels"],
		cloudProvider: "gcp",
		context:
			"See how Searce transformed Rebel Foods' delivery operations with real-time analytics and cloud-native architecture",
	},
	{
		id: "cs-namma-yatri",
		title: "Namma Yatri: Open Mobility Platform",
		client: "Namma Yatri",
		metrics: "Zero commission model enabled, 2M+ rides facilitated",
		url: "https://www.searce.com/archive/cs-139-detail",
		industries: ["TTL", "TSS"],
		regions: ["India"],
		categories: ["passenger-travel", "core-technology-and-software-platforms"],
		cloudProvider: "gcp",
		context:
			"Discover how Searce built a scalable, open-source mobility platform that disrupted the ride-hailing industry",
	},
	{
		id: "cs-usv",
		title: "USV: AWS Data Lake Modernization",
		client: "USV (Pharmaceutical)",
		metrics: "50% faster data processing, unified data platform across business units",
		url: "https://www.searce.com/archive/cs-138-detail",
		industries: ["HLS"],
		regions: ["India", "APAC"],
		categories: ["life-sciences"],
		cloudProvider: "aws",
		context:
			"Learn how Searce implemented a modern data lake on AWS for a leading pharmaceutical company",
	},
	{
		id: "cs-rapido",
		title: "Rapido: Real-Time Routing Optimization",
		client: "Rapido",
		metrics:
			"35% improvement in routing efficiency, 25% reduction in rider wait times, 10x latency reduction",
		url: "https://www.searce.com/archive/cs-127-detail",
		industries: ["TTL"],
		regions: ["India"],
		categories: ["passenger-travel"],
		cloudProvider: "gcp",
		context:
			"See how Searce solved complex routing challenges for India's largest bike-taxi platform",
	},
	{
		id: "cs-goibibo",
		title: "Goibibo: Cloud Infrastructure Modernization",
		client: "Goibibo",
		metrics: "40% cost optimization, 99.99% uptime during peak booking seasons",
		url: "https://www.searce.com/archive/cs-136-detail",
		industries: ["TTL"],
		regions: ["India", "APAC"],
		categories: ["travel-and-logistics-technology", "passenger-travel"],
		cloudProvider: "gcp",
		context:
			"Discover how Searce ensured peak-season reliability for one of India's top travel platforms",
	},
	{
		id: "cs-redbus",
		title: "redBus: Scalable Booking Platform",
		client: "redBus",
		metrics: "3x increase in booking capacity, seamless multi-region deployment",
		url: "https://www.searce.com/archive/cs-139-detail",
		industries: ["TTL"],
		regions: ["India", "APAC", "AMER"],
		categories: ["passenger-travel", "travel-and-logistics-technology"],
		cloudProvider: "gcp",
		context:
			"Learn how Searce enabled redBus to handle massive traffic spikes with cloud-native scaling",
	},
	{
		id: "cs-knolskape",
		title: "KNOLSKAPE: Infrastructure Cost Optimization",
		client: "KNOLSKAPE",
		metrics: "24% reduction in infrastructure costs, improved deployment velocity",
		url: "https://www.searce.com/archive/cs-143-detail",
		industries: ["TSS"],
		regions: ["India", "APAC", "AMER"],
		categories: ["core-technology-and-software-platforms"],
		cloudProvider: "gcp",
		context:
			"See how Searce helped a leading ed-tech platform optimize cloud spend while improving performance",
	},
	{
		id: "cs-colive",
		title: "Colive: Cloud-Native Property Management",
		client: "Colive",
		metrics: "50% faster feature deployment, unified tenant management platform",
		url: "https://www.searce.com/archive/cs-117-detail",
		industries: ["TSS", "MCM"],
		regions: ["India"],
		categories: ["core-technology-and-software-platforms", "construction"],
		cloudProvider: "gcp",
		context:
			"Discover how Searce built a scalable property-tech platform enabling rapid expansion",
	},
	{
		id: "cs-earlysalary",
		title: "EarlySalary: Fintech Data Modernization",
		client: "EarlySalary",
		metrics: "50% faster reporting, real-time credit decisioning",
		url: "https://www.searce.com/archive/cs-147-detail",
		industries: ["FSI"],
		regions: ["India"],
		categories: ["fintech-and-emerging", "payments-and-lending"],
		cloudProvider: "gcp",
		context:
			"Learn how Searce enabled instant loan disbursement through data platform modernization",
	},
	{
		id: "cs-kogta",
		title: "Kogta Finance: Digital Lending Transformation",
		client: "Kogta Finance",
		metrics: "60% reduction in loan processing time, paperless operations",
		url: "https://www.searce.com/archive/cs-142-detail",
		industries: ["FSI"],
		regions: ["India"],
		categories: ["payments-and-lending", "banking"],
		cloudProvider: "gcp",
		context: "See how Searce digitized lending operations for a traditional NBFC",
	},
	{
		id: "cs-location-intelligence",
		title: "Location Intelligence Platform",
		client: "Multiple Clients",
		metrics: "2x improvement in customer engagement, 45% increase in foot traffic attribution",
		url: "https://www.searce.com/archive/cs-139-detail",
		industries: ["RCE", "FSI", "TMEG"],
		regions: ["India", "APAC", "AMER", "EMEA"],
		categories: ["retail-channels", "banking", "media"],
		cloudProvider: "gcp",
		context:
			"Discover how Searce's location intelligence solutions drive measurable marketing ROI",
	},
	{
		id: "cs-data-platform",
		title: "Enterprise Data Platform Modernization",
		client: "Multiple Enterprise Clients",
		metrics: "60% reduction in data processing time, unified analytics across business units",
		url: "https://www.searce.com/insights/case-studies",
		industries: ["TSS", "MCM", "EUP", "MISC"],
		regions: ["India", "APAC", "AMER", "EMEA"],
		categories: [
			"core-technology-and-software-platforms",
			"manufacturing",
			"utilities-and-power",
		],
		cloudProvider: "multicloud",
		context: "See how Searce enables data-driven decision making through modern data platforms",
	},
];

export const VERIFIED_SEARCE_LINKS: Record<
	string,
	{ title: string; url: string; metrics: string }[]
> = {
	RCE: [
		{
			title: "Retail Giant: Centralized Data & 20% Cost Reduction",
			url: "https://www.searce.com/archive/cs-123-detail",
			metrics: "20% cost savings, centralized data platform",
		},
		{
			title: "Omnichannel Retail: Automated Image Metadata with AWS",
			url: "https://www.searce.com/archive/cs-124-detail",
			metrics: "Automated e-commerce metadata generation",
		},
		{
			title: "Tabsquare: 100% Uptime with Google Cloud",
			url: "https://www.searce.com/archive/cs-119-detail",
			metrics: "100% uptime, seamless ordering",
		},
	],
	TTL: [
		{
			title: "Paxel: 20% Efficiency & 99.5% On-Time Delivery",
			url: "https://www.searce.com/archive/cs-127-detail",
			metrics: "20% efficiency, 99.5% on-time delivery",
		},
		{
			title: "AI-Powered Logistics & Supply Chain Analytics",
			url: "https://www.searce.com/archive/cs-136-detail",
			metrics: "AI-powered supply chain optimization",
		},
		{
			title: "Namma Yatri: 10M Users with Google Maps",
			url: "https://www.searce.com/archive/cs-139-detail",
			metrics: "10M+ users, Google Maps integration",
		},
	],
	MCM: [
		{
			title: "Manufacturing Giant: 50% Performance Boost & 30% Cost Savings",
			url: "https://www.searce.com/archive/cs-112-detail",
			metrics: "50% performance boost, 30% cost savings",
		},
		{
			title: "Preventive Maintenance for Global Steel Manufacturer",
			url: "https://www.searce.com/archive/cs-118-detail",
			metrics: "Predictive maintenance enabled",
		},
		{
			title: "Manufacturing Leader: GenAI Customer Query Handling",
			url: "https://www.searce.com/archive/cs-125-detail",
			metrics: "AWS GenAI-powered query handling",
		},
	],
	TSS: [
		{
			title: "Flare: Cloud Integration in 4 Weeks",
			url: "https://www.searce.com/archive/cs-117-detail",
			metrics: "4-week cloud integration",
		},
		{
			title: "Static Media: 3.5x Content Throughput with AI",
			url: "https://www.searce.com/archive/cs-113-detail",
			metrics: "3.5x content throughput",
		},
		{
			title: "B2B Platform: 20% Cost Reduction with AWS Control Tower",
			url: "https://www.searce.com/archive/cs-143-detail",
			metrics: "20% cost reduction, centralized governance",
		},
	],
	FSI: [
		{
			title: "Kogta: Analytics Modernization with AWS",
			url: "https://www.searce.com/archive/cs-142-detail",
			metrics: "Real-time scalable insights",
		},
		{
			title: "Financial Institution: Automated Compliance with AWS Config",
			url: "https://www.searce.com/archive/cs-147-detail",
			metrics: "Automated compliance & governance",
		},
		{
			title: "Wealth Management: Cloud Security & Compliance",
			url: "https://www.searce.com/archive/cs-141-detail",
			metrics: "Enhanced security posture on AWS",
		},
		{
			title: "AI-Powered Document Retrieval for Financial Advisors",
			url: "https://www.searce.com/archive/cs-126-detail",
			metrics: "AI-powered document retrieval",
		},
	],
	HLS: [
		{
			title: "Pharma Giant: Netezza to BigQuery Migration",
			url: "https://www.searce.com/archive/cs-138-detail",
			metrics: "Big savings, bigger scale",
		},
		{
			title: "50% Faster Drug Discovery with Automated Protein Analysis",
			url: "https://www.searce.com/archive/cs-114-detail",
			metrics: "50% faster drug discovery",
		},
		{
			title: "Redcliffe Labs: Cloud Security with GCP",
			url: "https://www.searce.com/archive/cs-131-detail",
			metrics: "Improved cloud security posture",
		},
	],
	TMEG: [
		{
			title: "Enterprise Data Modernization for Telecom Conglomerate",
			url: "https://www.searce.com/archive/cs-122-detail",
			metrics: "Enterprise-scale data modernization on AWS",
		},
		{
			title: "AI-Powered Content Moderation: 70% Faster Review",
			url: "https://www.searce.com/archive/cs-121-detail",
			metrics: "70% faster content review",
		},
		{
			title: "Video Platform: 60% Review Time Reduction",
			url: "https://www.searce.com/archive/cs-116-detail",
			metrics: "60% review time reduction with AI",
		},
	],
	EUP: [
		{
			title: "Pasajob: 62% Cloud Cost Savings with Google Cloud",
			url: "https://www.searce.com/archive/cs-128-detail",
			metrics: "62% cloud cost savings",
		},
	],
	PSE: [
		{
			title: "Workplace Transformation: Content Management & Collaboration",
			url: "https://www.searce.com/archive/cs-137-detail",
			metrics: "Seamless content management",
		},
	],
	MISC: [
		{
			title: "SmartPay: 40% Cloud Cost Reduction",
			url: "https://www.searce.com/archive/cs-133-detail",
			metrics: "40% cloud cost cut with custom billing dashboard",
		},
		{
			title: "RentalMatics: Global Growth with Cloud",
			url: "https://www.searce.com/archive/cs-132-detail",
			metrics: "Global cloud expansion",
		},
		{
			title: "Finclude: 20% Infrastructure Cost Reduction",
			url: "https://www.searce.com/archive/cs-111-detail",
			metrics: "20% cost reduction",
		},
	],
};

interface CaseStudyMatch {
	studies: VerifiedCaseStudy[];
	usedFallback: boolean;
	fallbackRegion?: string;
}

/**
 * Score-based case study matcher.
 *
 * Removed: persona-function dimension (replaced with industry category).
 * The `category` arg is the sheet-driven category slug (e.g. "banking").
 * If empty, only industry + region scoring applies.
 */
export function getVerifiedCaseStudies(
	industryCode: string,
	region: string,
	category: string,
	cloudEcosystem: string,
	useFallback: boolean,
): CaseStudyMatch {
	const canonicalIndustry = migrateIndustryCode(industryCode);
	let scoredStudies = scoreAndFilter(canonicalIndustry, region, category, cloudEcosystem);
	if (scoredStudies.length > 0) {
		return { studies: scoredStudies, usedFallback: false };
	}

	if (useFallback) {
		const fallbackRegion = REGION_FALLBACKS[region];
		if (fallbackRegion) {
			scoredStudies = scoreAndFilter(
				canonicalIndustry,
				fallbackRegion,
				category,
				cloudEcosystem,
			);
			if (scoredStudies.length > 0) {
				return { studies: scoredStudies, usedFallback: true, fallbackRegion };
			}
		}
	}

	return { studies: [], usedFallback: false };
}

function scoreAndFilter(
	industryCode: string,
	region: string,
	category: string,
	cloudEcosystem: string,
): VerifiedCaseStudy[] {
	return VERIFIED_CASE_STUDIES.map((study) => {
		let score = 0;
		if (study.regions.includes(region)) score += 50;
		const studyIndustries = study.industries.map(migrateIndustryCode);
		if (studyIndustries.includes(industryCode)) score += 40;
		if (category && study.categories.includes(category)) score += 25;
		if (study.cloudProvider === cloudEcosystem || study.cloudProvider === "multicloud")
			score += 10;
		return { ...study, _score: score };
	})
		.filter((s) => s._score >= 50)
		.sort((a, b) => b._score - a._score)
		.slice(0, 3)
		.map(({ _score: _, ...study }) => study);
}
