export interface CloudContext {
	partnerStatus: string;
	technologies: string[];
	terminology: string;
	focusAreas: string[];
}

const CONTEXTS: Record<string, CloudContext> = {
	gcp: {
		partnerStatus: "Google Cloud Managed Services Partner (MSP)",
		technologies: ["Google Cloud", "BigQuery", "Vertex AI", "Anthos", "Cloud Run", "GKE"],
		terminology: "GCP-specific",
		focusAreas: [
			"BigQuery analytics",
			"Vertex AI implementations",
			"Cloud-native transformations",
		],
	},
	aws: {
		partnerStatus: "AWS Advanced Consulting Partner",
		technologies: [
			"Amazon Web Services",
			"Redshift",
			"SageMaker",
			"AWS Bedrock",
			"S3",
			"Lambda",
		],
		terminology: "AWS-specific",
		focusAreas: ["AWS migrations", "SageMaker ML workflows", "Serverless architectures"],
	},
	multicloud: {
		partnerStatus: "Multi-Cloud Engineering Partner",
		technologies: [
			"Cloud-agnostic solutions",
			"Kubernetes",
			"Terraform",
			"Multi-cloud architectures",
		],
		terminology: "Cloud-neutral",
		focusAreas: ["Digital transformation", "Cloud modernization", "Platform engineering"],
	},
};

export function getCloudContext(cloudEcosystem: string): CloudContext {
	return CONTEXTS[cloudEcosystem] ?? CONTEXTS.multicloud!;
}
