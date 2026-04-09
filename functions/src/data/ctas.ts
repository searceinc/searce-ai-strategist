interface AngleCTA {
	primary: string;
	secondary: string;
}

const ANGLE_CTAS: Record<string, Record<string, AngleCTA>> = {
	pain_point: {
		it: {
			primary: "Get a Free Cloud Readiness Assessment",
			secondary: "See How We Solved Similar Challenges",
		},
		marketing: {
			primary: "Request a Marketing Analytics Demo",
			secondary: "See Our Location Intelligence in Action",
		},
		finance: {
			primary: "Schedule a FinOps Audit",
			secondary: "Learn How We Cut Cloud Costs 24%",
		},
		sales: { primary: "See Our Sales Intelligence Platform", secondary: "Request a Demo" },
		operations: {
			primary: "Explore Operations Modernization",
			secondary: "See Our Logistics Case Studies",
		},
		default: { primary: "Schedule a Discovery Call", secondary: "Learn More About Searce" },
	},
	roi_metrics: {
		it: { primary: "Calculate Your Cloud ROI", secondary: "See 24% Cost Reduction Case Study" },
		marketing: {
			primary: "See 2x Engagement Results",
			secondary: "Request ROI Calculator Access",
		},
		finance: {
			primary: "Get Cloud Cost Optimization Analysis",
			secondary: "See 50% Faster Reporting Results",
		},
		sales: {
			primary: "See Revenue Impact Analysis",
			secondary: "Request Pipeline Acceleration Demo",
		},
		operations: {
			primary: "Calculate Operational Savings",
			secondary: "See 35% Efficiency Improvement Case",
		},
		default: { primary: "Calculate Your Transformation ROI", secondary: "See Our Results" },
	},
	social_proof: {
		it: {
			primary: "See Similar Success Stories",
			secondary: "Connect With Our Technical Team",
		},
		marketing: {
			primary: "Read Our Marketing Transformation Cases",
			secondary: "Speak to a Marketing Specialist",
		},
		finance: {
			primary: "See Finance Transformation Results",
			secondary: "Connect With Our FinOps Team",
		},
		sales: {
			primary: "See Sales Enablement Success Stories",
			secondary: "Request Reference Call",
		},
		operations: {
			primary: "Read Operations Excellence Cases",
			secondary: "Connect With Our Ops Team",
		},
		default: { primary: "Explore Our Case Studies", secondary: "Request a Reference Call" },
	},
	direct_pitch: {
		it: { primary: "Schedule a Modernization Workshop", secondary: "Get Started With Searce" },
		marketing: { primary: "Book a Marketing Strategy Session", secondary: "Get Started Today" },
		finance: {
			primary: "Schedule a FinOps Workshop",
			secondary: "Start Your Optimization Journey",
		},
		sales: {
			primary: "Book a Sales Acceleration Session",
			secondary: "Get Started With Searce",
		},
		operations: {
			primary: "Schedule an Ops Excellence Workshop",
			secondary: "Start Modernizing Today",
		},
		default: {
			primary: "Schedule a Modernization Workshop",
			secondary: "Get Started With Searce",
		},
	},
};

export function getAngleCTA(angle: string, personaFunction: string): AngleCTA {
	const angleCTAs = ANGLE_CTAS[angle] ?? ANGLE_CTAS.pain_point!;
	return angleCTAs[personaFunction] ?? angleCTAs.default!;
}
