// Auto-generated from the Mapped Pain Points and Use Cases workbook (Sheets 1, 2 & 3).
// Run scripts/build-sheet-data.mjs to regenerate after the workbook changes.
// DO NOT EDIT BY HAND.

export interface IndustryOption {
	value: string;
	label: string;
}

export interface CategoryOption {
	value: string;
	label: string;
}

export interface SubCategoryOption {
	value: string;
	label: string;
	fullId: string;
}

/** Sheet-1 canonical industry codes + detailed labels, in workbook order. */
export const SHEET_INDUSTRIES: IndustryOption[] = [
	{ value: "FSI", label: "Financial Services & Insurance" },
	{ value: "HLS", label: "Healthcare & Life Sciences" },
	{ value: "TTL", label: "Travel, Transportation & Logistics" },
	{ value: "RCE", label: "Retail, CPG & E-commerce" },
	{ value: "TMEG", label: "Telecommunications, Media, Entertainment & Gaming" },
	{ value: "MCM", label: "Manufacturing, Construction & Mining" },
	{ value: "TSS", label: "Technology, Services & Startups" },
	{ value: "EUP", label: "Energy, Utilities & Power" },
	{ value: "PSE", label: "Public Sector & Education" },
];

/** Sheet-driven categories (sub-industries) per industry code. */
export const INDUSTRY_CATEGORIES: Record<string, CategoryOption[]> = {
	FSI: [
		{ value: "banking", label: "Banking" },
		{ value: "capital-markets", label: "Capital Markets" },
		{ value: "insurance", label: "Insurance" },
		{ value: "payments-and-lending", label: "Payments & Lending" },
		{ value: "fintech-and-emerging", label: "FinTech & Emerging" },
	],
	HLS: [
		{ value: "providers", label: "Providers" },
		{ value: "life-sciences", label: "Life Sciences" },
		{ value: "payers", label: "Payers" },
		{ value: "healthtech", label: "HealthTech" },
		{ value: "healthcare-supply-chain", label: "Healthcare Supply Chain" },
	],
	TTL: [
		{ value: "passenger-travel", label: "Passenger Travel" },
		{ value: "hospitality", label: "Hospitality" },
		{ value: "logistics-and-warehousing", label: "Logistics & Warehousing" },
		{ value: "freight-transportation", label: "Freight Transportation" },
		{ value: "travel-and-logistics-technology", label: "Travel & Logistics Technology" },
	],
	RCE: [
		{ value: "retail-channels", label: "Retail (Channels)" },
		{ value: "cpg-brands", label: "CPG (Brands)" },
		{ value: "e-commerce-digital-channels", label: "E-commerce (Digital Channels)" },
		{ value: "retail-and-cpg-technology", label: "Retail & CPG Technology" },
	],
	TMEG: [
		{ value: "telecommunications", label: "Telecommunications" },
		{ value: "media", label: "Media" },
		{ value: "entertainment", label: "Entertainment" },
		{ value: "gaming", label: "Gaming" },
	],
	MCM: [
		{ value: "manufacturing", label: "Manufacturing" },
		{ value: "construction", label: "Construction" },
		{ value: "mining-and-metals", label: "Mining & Metals" },
		{ value: "industrial-technology-and-services", label: "Industrial Technology & Services" },
	],
	TSS: [
		{
			value: "core-technology-and-software-platforms",
			label: "Core Technology & Software Platforms",
		},
		{ value: "it-and-technology-services", label: "IT & Technology Services" },
		{ value: "professional-and-business-services", label: "Professional & Business Services" },
		{ value: "startup-and-venture-ecosystem", label: "Startup & Venture Ecosystem" },
	],
	EUP: [
		{ value: "oil-and-gas", label: "Oil & Gas" },
		{ value: "utilities-and-power", label: "Utilities & Power" },
		{ value: "renewables-and-clean-tech", label: "Renewables & Clean Tech" },
		{ value: "energy-commercial-and-retail", label: "Energy Commercial & Retail" },
	],
	PSE: [
		{ value: "government", label: "Government" },
		{ value: "education", label: "Education" },
		{ value: "non-profit-and-ngos", label: "Non-Profit & NGOs" },
		{ value: "govtech-and-edtech", label: "GovTech & EdTech" },
	],
};

/** Sheet-driven sub-categories per industry+category. */
export const CATEGORY_SUBCATEGORIES: Record<string, Record<string, SubCategoryOption[]>> = {
	FSI: {
		banking: [
			{ value: "retail-and-consumer", label: "Retail & Consumer", fullId: "1.1.1" },
			{ value: "commercial-and-business", label: "Commercial & Business", fullId: "1.1.2" },
			{ value: "corporate", label: "Corporate", fullId: "1.1.3" },
			{
				value: "private-and-wealth-management",
				label: "Private & Wealth Management",
				fullId: "1.1.4",
			},
			{
				value: "credit-unions-and-community-banks",
				label: "Credit Unions & Community Banks",
				fullId: "1.1.5",
			},
		],
		"capital-markets": [
			{ value: "investment-banking", label: "Investment Banking", fullId: "1.2.1" },
			{ value: "asset-management", label: "Asset Management", fullId: "1.2.2" },
			{ value: "hedge-funds", label: "Hedge Funds", fullId: "1.2.3" },
			{
				value: "venture-capital-and-private-equity",
				label: "Venture Capital & Private Equity",
				fullId: "1.2.4",
			},
			{ value: "brokerage-and-trading", label: "Brokerage & Trading", fullId: "1.2.5" },
			{
				value: "custody-and-fund-services",
				label: "Custody & Fund Services",
				fullId: "1.2.6",
			},
		],
		insurance: [
			{ value: "life-and-annuities", label: "Life & Annuities", fullId: "1.3.1" },
			{
				value: "property-and-casualty-p-and-c",
				label: "Property & Casualty (P&C)",
				fullId: "1.3.2",
			},
			{ value: "health", label: "Health", fullId: "1.3.3" },
			{ value: "reinsurance", label: "Reinsurance", fullId: "1.3.4" },
			{ value: "specialty", label: "Specialty", fullId: "1.3.5" },
		],
		"payments-and-lending": [
			{
				value: "payment-processing-and-networks",
				label: "Payment Processing & Networks",
				fullId: "1.4.1",
			},
			{
				value: "remittance-and-cross-border-payments",
				label: "Remittance & Cross-Border Payments",
				fullId: "1.4.2",
			},
			{ value: "consumer-lending", label: "Consumer Lending", fullId: "1.4.3" },
		],
		"fintech-and-emerging": [
			{
				value: "digital-banking-and-neobanks",
				label: "Digital Banking & Neobanks",
				fullId: "1.5.1",
			},
			{
				value: "p2p-lending-and-crowdfunding",
				label: "P2P Lending & Crowdfunding",
				fullId: "1.5.2",
			},
			{
				value: "robo-advisors-and-digital-wealth",
				label: "Robo-Advisors & Digital Wealth",
				fullId: "1.5.3",
			},
			{ value: "insurtech-platforms", label: "InsurTech Platforms", fullId: "1.5.4" },
			{ value: "regtech-solutions", label: "RegTech Solutions", fullId: "1.5.5" },
			{
				value: "blockchain-and-digital-currencies",
				label: "Blockchain & Digital Currencies",
				fullId: "1.5.6",
			},
		],
	},
	HLS: {
		providers: [
			{
				value: "hospitals-and-health-systems",
				label: "Hospitals & Health Systems",
				fullId: "2.1.1",
			},
			{
				value: "ambulatory-and-outpatient-care",
				label: "Ambulatory & Outpatient Care",
				fullId: "2.1.2",
			},
			{
				value: "post-acute-and-long-term-care",
				label: "Post-Acute & Long-Term Care",
				fullId: "2.1.3",
			},
			{ value: "specialty-care-centers", label: "Specialty Care Centers", fullId: "2.1.4" },
			{
				value: "diagnostic-services-labs-and-imaging",
				label: "Diagnostic Services (Labs & Imaging)",
				fullId: "2.1.5",
			},
		],
		"life-sciences": [
			{ value: "pharmaceuticals", label: "Pharmaceuticals", fullId: "2.2.1" },
			{ value: "biotechnology", label: "Biotechnology", fullId: "2.2.2" },
			{
				value: "medical-devices-medtech",
				label: "Medical Devices (MedTech)",
				fullId: "2.2.3",
			},
			{
				value: "contract-research-and-manufacturing-cro-cmo",
				label: "Contract Research & Manufacturing (CRO/CMO)",
				fullId: "2.2.4",
			},
		],
		payers: [
			{ value: "public-payers", label: "Public Payers", fullId: "2.3.1" },
			{ value: "private-insurance", label: "Private Insurance", fullId: "2.3.2" },
			{
				value: "pharmacy-benefit-managers-pbms",
				label: "Pharmacy Benefit Managers (PBMs)",
				fullId: "2.3.3",
			},
		],
		healthtech: [
			{
				value: "emr-ehr-and-clinical-workflow",
				label: "EMR/EHR & Clinical Workflow",
				fullId: "2.4.1",
			},
			{
				value: "telemedicine-and-virtual-care",
				label: "Telemedicine & Virtual Care",
				fullId: "2.4.2",
			},
			{ value: "health-analytics-and-ai", label: "Health Analytics & AI", fullId: "2.4.3" },
			{
				value: "patient-engagement-and-wearables",
				label: "Patient Engagement & Wearables",
				fullId: "2.4.4",
			},
			{
				value: "digital-wellness-and-therapeutics",
				label: "Digital Wellness & Therapeutics",
				fullId: "2.4.5",
			},
		],
		"healthcare-supply-chain": [
			{
				value: "pharmaceutical-distribution",
				label: "Pharmaceutical Distribution",
				fullId: "2.5.1",
			},
			{
				value: "medical-device-distribution",
				label: "Medical Device Distribution",
				fullId: "2.5.2",
			},
			{
				value: "group-purchasing-organizations-gpos",
				label: "Group Purchasing Organizations (GPOs)",
				fullId: "2.5.3",
			},
		],
	},
	TTL: {
		"passenger-travel": [
			{ value: "airlines-commercial", label: "Airlines (Commercial)", fullId: "3.1.1" },
			{ value: "passenger-rail", label: "Passenger Rail", fullId: "3.1.2" },
			{ value: "cruise-lines-and-ferries", label: "Cruise Lines & Ferries", fullId: "3.1.3" },
			{ value: "bus-and-coach-services", label: "Bus & Coach Services", fullId: "3.1.4" },
			{
				value: "ride-hailing-and-taxi-services",
				label: "Ride-Hailing & Taxi Services",
				fullId: "3.1.5",
			},
			{ value: "car-rental", label: "Car Rental", fullId: "3.1.6" },
			{ value: "micromobility", label: "Micromobility", fullId: "3.1.7" },
		],
		hospitality: [
			{
				value: "hotels-resorts-and-casinos",
				label: "Hotels, Resorts & Casinos",
				fullId: "3.2.1",
			},
			{ value: "short-term-rentals", label: "Short-Term Rentals", fullId: "3.2.2" },
			{
				value: "food-service-restaurants-and-qsrs",
				label: "Food Service (Restaurants & QSRs)",
				fullId: "3.2.3",
			},
			{
				value: "meetings-incentives-conferences-and-exhibitions-mice",
				label: "Meetings, Incentives, Conferences & Exhibitions (MICE)",
				fullId: "3.2.4",
			},
		],
		"logistics-and-warehousing": [
			{
				value: "warehousing-and-fulfillment-centers",
				label: "Warehousing & Fulfillment Centers",
				fullId: "3.3.1",
			},
			{
				value: "third-party-logistics-3pl-and-fourth-party-logistics-4pl",
				label: "Third-Party Logistics (3PL) & Fourth-Party Logistics (4PL)",
				fullId: "3.3.2",
			},
			{
				value: "freight-forwarding-and-brokerage",
				label: "Freight Forwarding & Brokerage",
				fullId: "3.3.3",
			},
			{
				value: "last-mile-delivery-services",
				label: "Last-Mile Delivery Services",
				fullId: "3.3.4",
			},
			{ value: "cold-chain-logistics", label: "Cold Chain Logistics", fullId: "3.3.5" },
		],
		"freight-transportation": [
			{
				value: "trucking-and-road-haulage",
				label: "Trucking & Road Haulage",
				fullId: "3.4.1",
			},
			{
				value: "rail-freight-and-intermodal",
				label: "Rail Freight & Intermodal",
				fullId: "3.4.2",
			},
			{ value: "maritime-shipping", label: "Maritime Shipping", fullId: "3.4.3" },
			{ value: "air-cargo-and-freight", label: "Air Cargo & Freight", fullId: "3.4.4" },
		],
		"travel-and-logistics-technology": [
			{
				value: "online-travel-agencies-otas-and-metasearch",
				label: "Online Travel Agencies (OTAs) & Metasearch",
				fullId: "3.5.1",
			},
			{
				value: "global-distribution-systems-gds-and-reservation-systems",
				label: "Global Distribution Systems (GDS) & Reservation Systems",
				fullId: "3.5.2",
			},
			{
				value: "transportation-management-systems-tms",
				label: "Transportation Management Systems (TMS)",
				fullId: "3.5.3",
			},
			{
				value: "warehouse-management-systems-wms",
				label: "Warehouse Management Systems (WMS)",
				fullId: "3.5.4",
			},
			{
				value: "fleet-management-and-telematics",
				label: "Fleet Management & Telematics",
				fullId: "3.5.5",
			},
			{
				value: "supply-chain-visibility-and-planning-platforms",
				label: "Supply Chain Visibility & Planning Platforms",
				fullId: "3.5.6",
			},
		],
	},
	RCE: {
		"retail-channels": [
			{ value: "grocery-and-supermarkets", label: "Grocery & Supermarkets", fullId: "4.1.1" },
			{ value: "department-stores", label: "Department Stores", fullId: "4.1.2" },
			{
				value: "specialty-retail-fashion-electronics-and-home-goods",
				label: "Specialty Retail (Fashion, Electronics & Home Goods)",
				fullId: "4.1.3",
			},
			{ value: "convenience-stores", label: "Convenience Stores", fullId: "4.1.4" },
			{
				value: "discount-and-off-price-retailers",
				label: "Discount & Off-Price Retailers",
				fullId: "4.1.5",
			},
			{
				value: "pharmacies-and-drug-stores",
				label: "Pharmacies & Drug Stores",
				fullId: "4.1.6",
			},
		],
		"cpg-brands": [
			{ value: "food-and-beverage", label: "Food & Beverage", fullId: "4.2.1" },
			{
				value: "apparel-footwear-and-accessories",
				label: "Apparel, Footwear & Accessories",
				fullId: "4.2.2",
			},
			{ value: "health-and-personal-care", label: "Health & Personal Care", fullId: "4.2.3" },
			{
				value: "household-and-cleaning-supplies",
				label: "Household & Cleaning Supplies",
				fullId: "4.2.4",
			},
			{
				value: "consumer-electronics-and-appliances",
				label: "Consumer Electronics & Appliances",
				fullId: "4.2.5",
			},
		],
		"e-commerce-digital-channels": [
			{ value: "e-commerce-marketplaces", label: "E-commerce Marketplaces", fullId: "4.3.1" },
			{
				value: "direct-to-consumer-d2c-brands",
				label: "Direct-to-Consumer (D2C) Brands",
				fullId: "4.3.2",
			},
			{ value: "b2b-e-commerce", label: "B2B E-commerce", fullId: "4.3.3" },
			{
				value: "q-commerce-quick-commerce",
				label: "Q-commerce (Quick Commerce)",
				fullId: "4.3.4",
			},
			{
				value: "epharmacy-and-digital-health-marketplaces",
				label: "ePharmacy & Digital Health Marketplaces",
				fullId: "4.3.5",
			},
		],
		"retail-and-cpg-technology": [
			{
				value: "e-commerce-platforms-and-carts",
				label: "E-commerce Platforms & Carts",
				fullId: "4.4.1",
			},
			{
				value: "point-of-sale-pos-systems",
				label: "Point-of-Sale (POS) Systems",
				fullId: "4.4.2",
			},
			{
				value: "supply-chain-and-inventory-management-software",
				label: "Supply Chain & Inventory Management Software",
				fullId: "4.4.3",
			},
			{
				value: "crm-and-customer-loyalty-platforms",
				label: "CRM & Customer Loyalty Platforms",
				fullId: "4.4.4",
			},
			{
				value: "retail-analytics-and-demand-forecasting",
				label: "Retail Analytics & Demand Forecasting",
				fullId: "4.4.5",
			},
		],
	},
	TMEG: {
		telecommunications: [
			{ value: "wireless-carriers", label: "Wireless Carriers", fullId: "5.1.1" },
			{
				value: "wireline-and-broadband-providers",
				label: "Wireline & Broadband Providers",
				fullId: "5.1.2",
			},
			{
				value: "cable-and-satellite-providers",
				label: "Cable & Satellite Providers",
				fullId: "5.1.3",
			},
			{
				value: "network-infrastructure-and-equipment-vendors",
				label: "Network Infrastructure & Equipment Vendors",
				fullId: "5.1.4",
			},
		],
		media: [
			{
				value: "broadcasting-tv-and-radio",
				label: "Broadcasting (TV & Radio)",
				fullId: "5.2.1",
			},
			{
				value: "publishing-digital-and-print",
				label: "Publishing (Digital & Print)",
				fullId: "5.2.2",
			},
			{
				value: "over-the-top-ott-and-streaming-platforms",
				label: "Over-the-Top (OTT) & Streaming Platforms",
				fullId: "5.2.3",
			},
			{ value: "social-media-platforms", label: "Social Media Platforms", fullId: "5.2.4" },
			{
				value: "advertising-and-marketing-services-adtech",
				label: "Advertising & Marketing Services (AdTech)",
				fullId: "5.2.5",
			},
		],
		entertainment: [
			{ value: "film-and-tv-studios", label: "Film & TV Studios", fullId: "5.3.1" },
			{
				value: "music-industry-labels-and-streaming",
				label: "Music Industry (Labels & Streaming)",
				fullId: "5.3.2",
			},
			{
				value: "live-entertainment-concerts-sports-parks",
				label: "Live Entertainment (Concerts, Sports, Parks)",
				fullId: "5.3.3",
			},
			{
				value: "podcasting-and-audio-entertainment",
				label: "Podcasting & Audio Entertainment",
				fullId: "5.3.4",
			},
		],
		gaming: [
			{
				value: "game-developers-and-studios",
				label: "Game Developers & Studios",
				fullId: "5.4.1",
			},
			{ value: "game-publishers", label: "Game Publishers", fullId: "5.4.2" },
			{
				value: "esports-leagues-and-platforms",
				label: "Esports Leagues & Platforms",
				fullId: "5.4.3",
			},
			{
				value: "gaming-hardware-and-peripherals",
				label: "Gaming Hardware & Peripherals",
				fullId: "5.4.4",
			},
		],
	},
	MCM: {
		manufacturing: [
			{
				value: "automotive-and-transportation-equipment",
				label: "Automotive & Transportation Equipment",
				fullId: "6.1.1",
			},
			{ value: "aerospace-and-defense", label: "Aerospace & Defense", fullId: "6.1.2" },
			{
				value: "industrial-machinery-and-equipment",
				label: "Industrial Machinery & Equipment",
				fullId: "6.1.3",
			},
			{
				value: "high-tech-and-electronics",
				label: "High-Tech & Electronics",
				fullId: "6.1.4",
			},
			{
				value: "process-manufacturing-chemicals-metals",
				label: "Process Manufacturing (Chemicals, Metals)",
				fullId: "6.1.5",
			},
		],
		construction: [
			{
				value: "residential-construction",
				label: "Residential Construction",
				fullId: "6.2.1",
			},
			{
				value: "commercial-and-institutional-construction",
				label: "Commercial & Institutional Construction",
				fullId: "6.2.2",
			},
			{ value: "industrial-construction", label: "Industrial Construction", fullId: "6.2.3" },
			{
				value: "infrastructure-and-civil-engineering",
				label: "Infrastructure & Civil Engineering",
				fullId: "6.2.4",
			},
		],
		"mining-and-metals": [
			{ value: "metals-mining", label: "Metals Mining", fullId: "6.3.1" },
			{ value: "coal-mining", label: "Coal Mining", fullId: "6.3.2" },
			{
				value: "minerals-and-aggregates-quarrying",
				label: "Minerals & Aggregates (Quarrying)",
				fullId: "6.3.3",
			},
			{
				value: "mining-support-services-and-equipment",
				label: "Mining Support Services & Equipment",
				fullId: "6.3.4",
			},
		],
		"industrial-technology-and-services": [
			{
				value: "engineering-procurement-and-construction-firms-epc",
				label: "Engineering, Procurement and Construction Firms (EPC)",
				fullId: "6.4.1",
			},
			{
				value: "industrial-automation-and-robotics-industry-4-0",
				label: "Industrial Automation & Robotics (Industry 4.0)",
				fullId: "6.4.2",
			},
			{
				value: "building-materials-manufacturing",
				label: "Building Materials Manufacturing",
				fullId: "6.4.3",
			},
			{
				value: "testing-inspection-and-certification-services-tic",
				label: "Testing, Inspection and Certification Services(TIC)",
				fullId: "6.4.4",
			},
		],
	},
	TSS: {
		"core-technology-and-software-platforms": [
			{
				value: "cloud-computing-providers-iaas-paas",
				label: "Cloud Computing Providers (IaaS, PaaS)",
				fullId: "7.1.1",
			},
			{
				value: "enterprise-software-erp-crm-and-hris",
				label: "Enterprise Software (ERP, CRM & HRIS)",
				fullId: "7.1.2",
			},
			{
				value: "cybersecurity-products-and-platforms",
				label: "Cybersecurity Products & Platforms",
				fullId: "7.1.3",
			},
			{
				value: "data-management-and-analytics-platforms",
				label: "Data Management & Analytics Platforms",
				fullId: "7.1.4",
			},
			{
				value: "collaboration-and-productivity-software",
				label: "Collaboration & Productivity Software",
				fullId: "7.1.5",
			},
		],
		"it-and-technology-services": [
			{
				value: "it-consulting-and-strategic-advisory",
				label: "IT Consulting & Strategic Advisory",
				fullId: "7.2.1",
			},
			{
				value: "cloud-professional-services",
				label: "Cloud Professional Services",
				fullId: "7.2.2",
			},
			{
				value: "systems-integration-and-implementation",
				label: "Systems Integration & Implementation",
				fullId: "7.2.3",
			},
			{
				value: "managed-it-and-infrastructure-services",
				label: "Managed IT & Infrastructure Services",
				fullId: "7.2.4",
			},
		],
		"professional-and-business-services": [
			{
				value: "management-and-strategy-consulting",
				label: "Management & Strategy Consulting",
				fullId: "7.3.1",
			},
			{
				value: "business-process-outsourcing-bpo",
				label: "Business Process Outsourcing (BPO)",
				fullId: "7.3.2",
			},
			{
				value: "staffing-and-recruitment-services",
				label: "Staffing & Recruitment Services",
				fullId: "7.3.3",
			},
			{
				value: "digital-marketing-and-advertising-agencies",
				label: "Digital Marketing & Advertising Agencies",
				fullId: "7.3.4",
			},
		],
		"startup-and-venture-ecosystem": [
			{
				value: "early-stage-startups-seed-series-a",
				label: "Early-Stage Startups (Seed - Series A)",
				fullId: "7.4.1",
			},
			{
				value: "growth-stage-startups-series-b",
				label: "Growth-Stage Startups (Series B+)",
				fullId: "7.4.2",
			},
			{
				value: "venture-capital-vc-and-private-equity-pe-firms",
				label: "Venture Capital (VC) & Private Equity (PE) Firms",
				fullId: "7.4.3",
			},
		],
	},
	EUP: {
		"oil-and-gas": [
			{
				value: "upstream-exploration-and-production",
				label: "Upstream (Exploration & Production)",
				fullId: "8.1.1",
			},
			{
				value: "midstream-pipelines-and-storage",
				label: "Midstream (Pipelines & Storage)",
				fullId: "8.1.2",
			},
			{ value: "downstream-refining", label: "Downstream (Refining)", fullId: "8.1.3" },
			{
				value: "o-and-g-equipment-and-services",
				label: "O&G Equipment & Services",
				fullId: "8.1.4",
			},
		],
		"utilities-and-power": [
			{
				value: "power-generation-conventional-fossil-fuels",
				label: "Power Generation - Conventional (Fossil Fuels)",
				fullId: "8.2.1",
			},
			{
				value: "power-generation-nuclear",
				label: "Power Generation - Nuclear",
				fullId: "8.2.2",
			},
			{
				value: "electric-transmission-and-distribution-the-grid",
				label: "Electric Transmission & Distribution (The Grid)",
				fullId: "8.2.3",
			},
			{
				value: "water-and-wastewater-utilities",
				label: "Water & Wastewater Utilities",
				fullId: "8.2.4",
			},
			{
				value: "gas-distribution-utilities",
				label: "Gas Distribution Utilities",
				fullId: "8.2.5",
			},
		],
		"renewables-and-clean-tech": [
			{
				value: "solar-power-development-and-operations",
				label: "Solar Power Development & Operations",
				fullId: "8.3.1",
			},
			{
				value: "wind-power-development-and-operations",
				label: "Wind Power Development & Operations",
				fullId: "8.3.2",
			},
			{
				value: "battery-and-energy-storage-solutions",
				label: "Battery & Energy Storage Solutions",
				fullId: "8.3.3",
			},
			{
				value: "other-renewables-hydro-geothermal",
				label: "Other Renewables (Hydro, Geothermal)",
				fullId: "8.3.4",
			},
		],
		"energy-commercial-and-retail": [
			{
				value: "energy-trading-and-risk-management",
				label: "Energy Trading & Risk Management",
				fullId: "8.4.1",
			},
			{
				value: "fuel-retail-and-marketing",
				label: "Fuel Retail & Marketing",
				fullId: "8.4.2",
			},
			{
				value: "electric-power-and-gas-retailers",
				label: "Electric Power & Gas Retailers",
				fullId: "8.4.3",
			},
		],
	},
	PSE: {
		government: [
			{
				value: "national-federal-government",
				label: "National / Federal Government",
				fullId: "9.1.1",
			},
			{
				value: "state-and-provincial-government",
				label: "State & Provincial Government",
				fullId: "9.1.2",
			},
			{
				value: "local-government-municipalities",
				label: "Local Government (Municipalities)",
				fullId: "9.1.3",
			},
			{
				value: "public-safety-and-justice",
				label: "Public Safety & Justice",
				fullId: "9.1.4",
			},
		],
		education: [
			{
				value: "k-12-primary-and-secondary",
				label: "K-12 (Primary & Secondary)",
				fullId: "9.2.1",
			},
			{ value: "higher-education", label: "Higher Education", fullId: "9.2.2" },
			{
				value: "vocational-and-professional-training",
				label: "Vocational & Professional Training",
				fullId: "9.2.3",
			},
			{ value: "libraries-and-museums", label: "Libraries & Museums", fullId: "9.2.4" },
		],
		"non-profit-and-ngos": [
			{
				value: "charitable-and-philanthropic-foundations",
				label: "Charitable & Philanthropic Foundations",
				fullId: "9.3.1",
			},
			{
				value: "social-and-human-services-organizations",
				label: "Social & Human Services Organizations",
				fullId: "9.3.2",
			},
			{
				value: "advocacy-and-public-policy-groups",
				label: "Advocacy & Public Policy Groups",
				fullId: "9.3.3",
			},
		],
		"govtech-and-edtech": [
			{
				value: "civic-tech-and-digital-government-platforms",
				label: "Civic Tech & Digital Government Platforms",
				fullId: "9.4.1",
			},
			{
				value: "public-safety-and-emergency-management-tech",
				label: "Public Safety & Emergency Management Tech",
				fullId: "9.4.2",
			},
			{
				value: "learning-management-systems-lms-and-sis",
				label: "Learning Management Systems (LMS) & SIS",
				fullId: "9.4.3",
			},
			{
				value: "online-program-management-opm",
				label: "Online Program Management (OPM)",
				fullId: "9.4.4",
			},
		],
	},
};

export function getIndustryCategories(industryCode: string): CategoryOption[] {
	return INDUSTRY_CATEGORIES[industryCode] ?? [];
}

export function getCategorySubCategories(
	industryCode: string,
	category: string,
): SubCategoryOption[] {
	return CATEGORY_SUBCATEGORIES[industryCode]?.[category] ?? [];
}
