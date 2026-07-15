// AUTO-GENERATED from the "Referenceable Solution Stories Master Sheet".
// Source: curated CSV of referenceable (publicly citable) Searce case studies.
// Regenerate with scripts/build-referenceable-stories.mjs after the sheet changes.
// DO NOT EDIT BY HAND.
//
// URLs intentionally point at the Searce case-studies hub: we do not have
// per-story detail URLs, and fabricating them is forbidden. Emails therefore
// name these clients in plain prose (no inline link) as social proof.

export interface ReferenceableStory {
	id: string;
	/** Verified client name — safe to name in outreach (referenceable). */
	client: string;
	/** App region code: AMER | APAC | EMEA | India. */
	region: string;
	/** App industry code: FSI | RCE | HLS | TSS | MISC. */
	industryCode: string;
	/** Raw industry label from the sheet. */
	industryName: string;
	/** SearceService enum value this story best maps to. */
	service: string;
	/** Human practice label (matches ALLOWED SEARCE PRACTICES vocabulary). */
	practiceLabel: string;
	title: string;
	summary: string;
	businessContext: string;
	solution: string;
	/** Full business impact & key metrics text from the sheet. */
	impact: string;
	/** Short, scannable proof headline derived from `impact`. */
	metricHeadline: string;
	techStack: string;
	/** Inferred from tech stack: gcp | aws | multicloud. */
	cloudProvider: string;
	url: string;
}

export const REFERENCEABLE_STORIES: ReferenceableStory[] = [
	{
		id: "ref-ayoconnect",
		client: "Ayoconnect",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Scalable DevOps: Bitbucket to Jenkins Pipelines",
		summary:
			"Migration from Bitbucket pipelines to Jenkins on GKE for scalable CI/CD and versatile pipelines.",
		businessContext:
			"AyoConnect engg team was limited by what Bitbucket pipelines can do in terms of control and versatility. Limitations of running builds in docker containers. Ayoconnect wanted to make their DevOps pipelines more versatile and scalable.",
		solution:
			"Created infrastructure using Terraform in Google cloud. Using google best practices installed Jenkins Dynamic Build agents on GKE. Installed, and configured the plugins on Jenkins. Setup Google SSO on Jenkins. Implemented SonarQube Scanner, slack notifications. Created Pipelines on Jenkins, trigger on Bitbucket Push event. Configure each build stages in pipelines as shared libraries in Jenkins.",
		impact: "Increased agility and faster rollout of features. Highly customizable and scalable CI/CD pipelines on GKE environment. Deliver customer serving active pipelines for GoLang, Node JS, and other applications. Deliver customer centralized DevOps automated workflows to Google Cloud.",
		metricHeadline: "Increased agility and faster rollout of features.",
		techStack: "Jenkins, GKE, Terraform, SonarQube, Slack, Bitbucket",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-ayoconnect-2",
		client: "Ayoconnect",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Apigee Re-architecture",
		summary:
			"Re-architecture of network design with applying Landing Zone and migrating Apigee X to a new shared VPC.",
		businessContext:
			"Reorganization and regrouping of Ayoconnect APIs as per best practices. Re-architecture of Ayoconnect Google Cloud Instance by implementing a Landing Zone and redeploying Apigee X in a Host project. Migrate Ayoconnect environments from Apigee X at Project level (45 Google Cloud projects) to Apigee X in Host project for a new Shared VPC on Google Cloud.",
		solution:
			"Designed the Google Cloud Landing Zone as per best practices to ensure the consistency, scalability and governance. Isolation across different environments using Google Cloud firewalls and environment specific subnets. Performed and completed the assessment and foundation using custom Terraform modules. Performed and completed the migration of Labs Project resources (Cloud Run, Cloud Functions) and Apigee to the new Shared VPC.",
		impact: "Implement Ayoconnect landing zone to get the benefit of enhanced security, improved efficiency and streamlined the governance & compliance. Get more clear visibility and control on Ayoconnect current APIs. The new environment is architected to be scalable which is beneficial in all the public facing applications. Improved accuracy and security in applying CI/CD pipeline as per best practices.",
		metricHeadline:
			"Implement Ayoconnect landing zone to get the benefit of enhanced security, improved efficiency and streamlined the governance…",
		techStack:
			"Apigee, Cloud Functions, Cloud Run, Cloud SQL, Compute Engine, Load Balancing, Virtual Private Cloud",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-insurun",
		client: "Insurun",
		region: "AMER",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Infra and Apps deployment to GKE Infra v1.25",
		summary:
			"Migration of apps and GKE Infra to v1.25 for Staging and Production environments.",
		businessContext:
			"Establish CI/CD from Cloud Build for both staging and production environment. Upgrade the GKE infra to v1.25. Upgrade deployment scripts to Helm3. Successful DNS cutover to Prod GKE Cluster deployed by Searce.",
		solution:
			"Searce Team deployed the staging and production environment with GKE infra v1.25. Cloud Build CI/CD set up achieved from the centralised DevOps project to the destination staging and production project. Applications deployed with upgraded Helm v3. Successfully created Cloud Build triggers for the Infra and Application deployment and ensured the deployment of 74 micro-services.",
		impact: "Insurun is running on the latest GKE version 1.25. Applications are deployed using the latest Helm v3 charts and achieved successful deployment for them in GKE Cluster. Established Automation through Cloud Build CI/CD set up in place thereby achieving the DevOps framework for Insurun. Achieving TF code level deployment for Insurun using Cloud Build with Security best practices in place.",
		metricHeadline: "Insurun is running on the latest GKE version 1.25.",
		techStack: "Google Kubernetes Engine, Cloud Build, Terraform, Helm3",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-toorak-capital-partners",
		client: "Toorak Capital Partners",
		region: "AMER",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to Google Cloud Migration & Code Refactoring",
		summary:
			"Migration of existing infrastructure, apps, and Data Warehouse from AWS to Google Cloud.",
		businessContext:
			"Toorak Capital wanted to Migrate their infrastructure, App and Data Warehouse to Google Cloud and leverage cost efficiency on Google Cloud. As part of migration Searce assisted Toorak to refactor 38 apps, 10 Core Lambdas and 14 ML lambdas and deploy them on Google Cloud. Toorak to leverage Google Cloud Data services of BigQuery, Dataproc, DocAI and Cloud SQL services.",
		solution:
			"Deployed Google Cloud Landing zone - Resource Hierarchy set up for 3 projects. Jenkins Deployment achieved through Shared Library migration from AWS thereby ensuring that the existing folder set up is retained for Toorak team. Refactored pipelines to push SDKs, services to Google Artifact registry for python, java and node.js. Ingress configurations for internal routing of apps configured and deployed.",
		impact: "Automation: Infra hosted on Google Cloud with resources being deployed through Terraform. HA: HPA enabled on GKE to ensure the high availability is enabled for all the pods running on the cluster. Securing the GKE workload with Workload Identity services. Security: Cloud armor securing the infra from any DDOS/OWASP Top 10 attacks.",
		metricHeadline:
			"Security: Cloud armor securing the infra from any DDOS/OWASP Top 10 attacks.",
		techStack:
			"Compute Engine, Kubernetes Engine, Memorystore, Cloud SQL, Cloud Functions, Cloud VPN, Cloud Armor, Artifact Registry, Cloud Storage",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-oms-cicd-and-billing-migration",
		client: "OMS, CICD and Billing Migration",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "OMS, CICD and Billing Migration",
		summary: "OMS, CICD and Billing Migration",
		businessContext:
			"The OMS Project needs to be migrated to the SM Retail Landing Zone for security compliance Migration to the SM Retail Landing Zone for standardization of network connectivity and identity policies APAC",
		solution:
			"OMS will be moved to the SM Retail organization The OMS project will have a Production and UAT/Dev environment The Jenkins Server used for CICD will be migrated to a separate GCP project under the Common Services folder",
		impact: "Better security compliance Standardization of network connectivity Identity of best policies.",
		metricHeadline:
			"Better security compliance Standardization of network connectivity Identity of best policies.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-early-salary",
		client: "Early Salary",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Re-Architecting the Infrastructure for AutoScaling",
		summary: "Re-architecting infra on AWS Aurora for unpredictable workloads.",
		businessContext:
			"High latency in the database leading to delay in reportings mainly due to Unpredictable loads. High Latency due to Complex queries being run on the RDS read replica with High IO.",
		solution:
			"Deployed the necessary VPCs, subnets, EC2 instances for the application, & database servers. Created automated RDS backups setup. Configured CloudWatch, RDS monitoring metrics and DB event notifications. Set up Application Load Balancer to serve request to the EC2 instances with SSL certificates from AWS Certificate Manager.",
		impact: "Response time for reports improved by over 50%. New & better reports were created with lesser cost. EC2 usage was optimised drastically and only the resources that were utilized were paid. Auto scaling option on Aurora handled unpredictable workloads. New resources and services were used to analyse data and run intelligent queries.",
		metricHeadline: "Response time for reports improved by over 50%.",
		techStack: "EC2, Aurora, CloudWatch, Application Load Balancer, AWS Certificate Manager",
		cloudProvider: "aws",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-anchorage",
		client: "Anchorage",
		region: "AMER",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Automating Resource Management on GCP",
		summary:
			"One-click Terraform scripts with error-handling and rollback for resource management.",
		businessContext:
			"Customer wanted a script to re-use in multiple project/environment to deploy complete end-to-end setup with no human intervention/input required while running the script. Security was key. Smart error handling in each step with rollback option to delete the deployed resources in case of failure. Script should have option to create completely new network stack and also to use existing network resources.",
		solution:
			"Script written to start the deployment with Single-click and minimum inputs. All resources created using Terraform are rollback. Multiple state management on Google Cloud state bucket making the code capable of managing separate state files for individual stack. Validations in place to check for existing Networking components and skipping their creation part. Buildkite metrics agent runs on an isolated managed service.",
		impact: "Developed CI solution which utilizes Buildkite effectively and efficiently. Automated environment provisioning saving devops hours.",
		metricHeadline:
			"Developed CI solution which utilizes Buildkite effectively and efficiently.",
		techStack: "Terraform, Buildkite, Google Cloud Storage",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-step",
		client: "Step",
		region: "AMER",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Optimizing Costs on Google Cloud with Searce",
		summary: "Cloud Acceleration Program deployment for cost optimization.",
		businessContext:
			"Cost Optimization & Performance: Looking to optimise cost by leveraging true cloud economics, longer commitments and enhance performance using cloud native services. Cloud Support: Step was evaluating service providers for auditing their infrastructure and deploying the best cloud practices.",
		solution:
			"Searce's Cloud Acceleration Program: Provide a holistic engagement with Google Cloud for optimization and support, i.e. dedicated TAM, Cloud Wellness Checks, 24*7 Support Services, On-demand Consulting Hours, Security Posture Review and more.",
		impact: "Cost Optimization & Architecture Consultation: Significant cost reduction by optimising the architecture whilst enhanced performance by leveraging managed cloud native services. Leveraging discounting option like SUD, CUD & revenue commit to improve TCO.",
		metricHeadline:
			"Cost Optimization & Architecture Consultation: Significant cost reduction by optimising the architecture whilst enhanced…",
		techStack: "Google Cloud Native Services",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-api-security",
		client: "API security",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "API Management & DA for Insurance Giant",
		summary:
			"Leverage Apigee for API development, integration and management. Unified DA for 8 different data sources on BQ",
		businessContext:
			"Expand the partner ecosystem by onboarding of new online insurance brokers via APIs and ensure security of data. Onboard new brokers in an efficient and self service manner Track key metrics to monitor and optimise broker sales performance Create a robust technology platform to release and mange new functional changes API security was the biggest concern",
		solution:
			"Delivered API management platform using Apigee Edge Enabled API developer portal & SDK for sign-up, registration & seamless integration of new partners with approval workflow Enabled API staging environment for partners to test & QA integration API versioning for managing change effectively Consulting with ICICI technical team to standardise backend APIs leading to better management & integration",
		impact: "Aggregated data from 7 different source systems to BigQuery for building an analytics warehouse to support GBGFs like Risk Analytics, Marketing Analytics, CRANE, etc. Automation and orchestration of pipelines to reduce manual dependency and TAT. Photo deduplication of 12L images on GCP for near real time application approval with an accuracy of 97.8%",
		metricHeadline:
			"Aggregated data from 7 different source systems to BigQuery for building an analytics warehouse to support GBGFs like Risk…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-developer",
		client: "Developer",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "API Management for AI Automation Tool",
		summary: "Leverage Apigee for testing & development, management and monitoring of APIs",
		businessContext:
			"Easy integration new customer in an efficient and self service manner Ensure security of customer and document data during analysis Track key metrics to monitor and optimise API performance API security was one of the biggest challenges. To create a platform that is efficient enough to accomodate any major functional changes",
		solution:
			"Delivered API management platform using Apigee Edge Enabled API staging environment for customers to test & QA integration API versioning for managing change effectively Usage report to track the subscription purchased by customer",
		impact: "75% reduction in time for customer onboarding and integration Customer dashboard for usage analysis Developer team is focusing on core features and all API management workload transferred to Apigee Edge",
		metricHeadline:
			"75% reduction in time for customer onboarding and integration Customer dashboard for usage analysis Developer team is focusing…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-xeno",
		client: "Xeno",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Migration from Azure to AWS & cost optimisation",
		summary: "EKS autoscaling and Jenkins automation setup for Kubernetes workloads.",
		businessContext:
			"To handle the traffic they configured the high specification instances. Manual Deployment for Kubernetes Workloads.",
		solution:
			"AutoScaling at EKS. Memory-optimized instances for better performance and lower cost. Implemented Jenkins to automate the Deployment Kubernetes workloads.",
		impact: "Added More Security. Reduced costs.",
		metricHeadline: "Added More Security.",
		techStack: "AWS EKS, Jenkins, Grafana, Prometheus",
		cloudProvider: "aws",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-martha-s-vineyard-bank",
		client: "Martha's Vineyard Bank",
		region: "AMER",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Google Cloud Deployment",
		summary: "Apigee EVAL solution migration to Apigee X PAYG.",
		businessContext:
			"Establish a foundational Google Cloud environment in accordance with best practices for security, networking, IAM, and relevant infrastructure components. Conduct a migration of the existing Apigee EVAL solution to the permanent APIGEE X PAYG solution.",
		solution:
			"Created a host project and two service projects (prod, non-prod) for networking using terraform. Provisioned Apigee X with two instances (one instance as a failover) in the specified regions. Migrated Apigee Eval to Apigee X(PAYG) dev environment. Deployed Cloud armor for Apigee security.",
		impact: "The migration of entities like proxies, sharedFlows, products, developers, apps, dataCollectors, KVMS from Apigee EVAL to Apigee X(PAYG) was seamless.",
		metricHeadline:
			"The migration of entities like proxies, sharedFlows, products, developers, apps, dataCollectors, KVMS from Apigee EVAL to…",
		techStack: "Apigee X, Terraform, Cloud Armor",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-oneassist",
		client: "OneAssist",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "BCE & CIP Procurement & Implementation",
		summary: "BeyondCorp Enterprise deployment for Zero Trust model.",
		businessContext:
			"One Assist Applications are hosted on AWS and using SaaS for their business needs would like to implement BeyondCorp Enterprise (BCE). Eliminate the use of 3rd Party VPN connection to access their Applications. OneAssist to follow the Zero Trust security practices, Reliable and future proof in terms of secure access of Applications.",
		solution:
			"Deployed BCE connectors for Apps from AWS and Saas to be protected with BCE. Restrict access based upon context aware proxy was implemented. Established private connectivity between Site to Site (cloudVPN). IAP for Cloud Applications access control has been setup & BeyondCorp Enterprise App connector installed on AWS Cloud.",
		impact: "Secure Application access & safeguard from online attackers (without having user level VPN connectivity). Context Aware access for Company owned devices as well as Unmanaged Individual user devices. Applications and User SSO login controlled via BeyondCorp Enterprise Zero Trust Access control.",
		metricHeadline:
			"Secure Application access & safeguard from online attackers (without having user level VPN connectivity).",
		techStack: "BeyondCorp Enterprise, IAM, VMware Engine, Cloud VPN, IAP",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-europ-assistance",
		client: "Europ Assistance",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "EA DRSA - Migration",
		summary: "Landing Zone creation and security layered multi-AZ environment deployment.",
		businessContext:
			"Europ Assistance provides travel Assistance and Insurance covering over 200 countries. Customer applications are hosted on ECS and all are publicly accessible and they want their application to be secure and PCI DSS compliance. Customer also want to upgrade their application with latest softwares. They want to migrate their applications to an environment which is more secure and cost effective.",
		solution:
			"Created Landing Zone architecture and separated all of their applications into different accounts. Implemented all the security features like AWS WAF, Network Firewall, KMS, ACM, SG's to secure all of the applications. Created the layer wise architecture for security and High Availability(3-tier). Deployed resources in Multi-AZ for HA.",
		impact: "With Landing Zone implementation Europ Assistance workloads got more security. Added different layers of security in their architecture like WAF, Network Firewall, KMS, Security Groups etc to secure their infrastructures. Provided HA to the workloads with Multi-AZ. Prevented data access of unauthorized person or entity by enabling the encryption of data at transit and rest.",
		metricHeadline:
			"With Landing Zone implementation Europ Assistance workloads got more security.",
		techStack: "AWS ECS, AWS WAF, Network Firewall, KMS, Route 53, VPC, EC2, RDS",
		cloudProvider: "aws",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-yubi-spocto",
		client: "Yubi Spocto",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Digital Debt platform Cloud Agnostic on GCP",
		summary: "AWS to GCP migration for GKE components to meet compliance.",
		businessContext:
			"Al-Enabled Global Leader in Digital debt collection. Yubi Spocto is a debt collection platform which banks can leverage for their loan collection process. Yubi-Spocto wanted to migrate their app into GCP with an objective of being cloud agnostic. Smartcollect is single tenant app which is created for each bank. Multi-tenant modules enabling the debt collection lifecycle.",
		solution:
			"GCP infrastructure as per best practices using IaaC. Multi to Single VPC approach for GCP. CICD pipeline using Jenkins & ArgoCD. Deployed Kafka, HashiCorp & Memorystore Redis on GKE so as to have connectivity of On Premise Users of Spocto. Deployed Mongodb on GCP VM. Migrated data from AWS RDS to GCP Cloud SQL via Backup and Restore.",
		impact: "Single VPC approach made GCP Architecture simple and scalable. Deployment of key components like Kafka, HashiCorp, MongoDB & Memorystore on GKE resulted in achieving Compliance need of Spocto Business use case. GCP Infrastructure cloud agnostic and onboarding additional customers.",
		metricHeadline: "Single VPC approach made GCP Architecture simple and scalable.",
		techStack: "Terraform, GKE, Kafka, Memorystore Redis, Cloud SQL, Cloud Storage, MongoDB",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-kogta",
		client: "Kogta",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "AWS Data Platform Migration",
		summary:
			"AWS data lake migration to enable near real-time analytics offloaded from Aurora RDS.",
		businessContext:
			"Used AWS Aurora RDS for transactional workloads. To enable scalable analytics, reporting was offloaded to AWS Redshift. Redshift is now the centralized reporting layer, supporting real-time dashboards and advanced queries. This separation improved performance, scalability, and data accessibility for business users.",
		solution:
			"Aurora RDS data streamed to raw layer via AWS DMS for near real-time replication with minimal downtime. Raw data converted to Hudi format for cdc, pushed to Athena for efficient incremental processing. ETL workflows automated using AWS Step Functions, integrating Lambda and PySpark jobs on EMR. End-to-end data validation and monitoring ensured integrity, reliability.",
		impact: "Near real time data generation of reports which were available at redshift store procedures, tables & views. Optimized EMR clusters for cost and Performance. Option of querying data on raw layer gave an option to debug in case of any data discrepancy found at Hudi layer. Migrated incremental data from ~125 transactional tables [RDS to Redshift] every 30 mins.",
		metricHeadline:
			"Migrated incremental data from ~125 transactional tables [RDS to Redshift] every 30 mins.",
		techStack:
			"AWS Aurora, AWS Redshift, AWS DMS, Apache Hudi, Amazon Athena, AWS Step Functions, AWS Lambda, Amazon EMR, Amazon S3",
		cloudProvider: "aws",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-oakbrook-finance",
		client: "Oakbrook Finance",
		region: "EMEA",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Oakbrook-Databricks Migration on GCP",
		summary: "Migration of Azure-hosted Databricks environment and workloads to GCP.",
		businessContext:
			"Oakbrook Finance runs a multi-cloud environment in Microsoft Azure and Google Cloud Platform (GCP). Oakbrooks finds it cumbersome to have two separate platforms for data management in Azure and GCP for their applications.",
		solution:
			"Discovery & Assessment for migration activities. Migrate Azure hosted Databricks environment to GCP. Migrate Azure SQL database instances & Workloads to a GCP hosted Databricks environment. Migration of Azure Event Landing to GCP.",
		impact: "Data Platform and Application platform are on same cloud platform, maintenance has become easier. Compute and Operational cost dropped down drastically.",
		metricHeadline:
			"Data Platform and Application platform are on same cloud platform, maintenance has become easier.",
		techStack: "Databricks, Azure SQL, Google Cloud Platform",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-toorak-capital",
		client: "Toorak Capital",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to Google Cloud Data Warehouse Migration toorakcapital.com",
		summary:
			"Toorak Capital is an integrated correspondent lending platform, It acquires business purpose loans backed by residential & mixed-use properties",
		businessContext:
			"Toorak Capital initiates a migration project aimed at optimizing operational efficiency & costs It aims to streamline workflows, enhance scalability & reduce overhead costs compared to their existing AWS infrastructure The move aligns with Toorak's strategic goals of staying agile & competitive in business landscape Client wanted to prevent unauthorized access to avoid compromise of sensitive data",
		solution:
			"Used transient Dataproc clusters to optimize resource utilization & improve ease of maintenance Cluster orchestrated by workflows to start & stop as needed, preventing unnecessary operational charges Workflow framework designed with reusable modules Implemented an additional security layer by using API gateway to call Function URLs. Airbyte was used alongside Datastream for seamless data integration",
		impact: "Platform Tech Stack Transient clusters resulted in performance optimization,ensuring efficient data processing & cost reduction Modularied Workflow framework simplified the creation and maintenance process Workflows Cloud Datastream Dataproc BigQuery Serverless architecture reduced infrastructure cost Functions Searce's Data Validation tool & automated testing framework improved speed of the validation process. API Gateway to provided an additional layer of protection Pub/Sub API Gateway Cloud Cloud Storage Scheduler Institutional Capital Provider | Data & Analytics",
		metricHeadline:
			"Platform Tech Stack Transient clusters resulted in performance optimization,ensuring efficient data processing & cost…",
		techStack:
			"speed of the validation process. API Gateway to provided an additional, Pub/Sub API Gateway Cloud Cloud",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-arcus",
		client: "Arcus",
		region: "AMER",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Data led Insights for a Payments-as-a-Service",
		summary: "Connecting Salesforce data with BigQuery and Looker for real-time dashboards.",
		businessContext:
			"Arcus is the Payments-as-a-Service helping every business make payments accessible for every consumer, across the Americas. Arcus has a good amount of incoming customer data which is not being utilized efficiently for the business.",
		solution:
			"Provided support in connecting Salesforce data with BigQuery using Fivetran. Integrated Looker with BigQuery and built 8 visualizations in the dashboard related to Churn Rate, Annual Recurring Revenue, etc. Leveraged Looker capabilities to create interactive dashboard that depicts critical business KPIs. Showcased Looker capabilities and user training to the business users.",
		impact: "Better and intuitive customer experience. Real-time analytics and quick decision making. Modernized dashboards and analytics framework for their operational and strategic reporting.",
		metricHeadline: "Better and intuitive customer experience.",
		techStack: "BigQuery, Looker, Fivetran, Salesforce",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-walnut",
		client: "Walnut",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Leveraging Serverless to Save Time and Scale Easily",
		summary: "Google App Engine and Datastore utilization for a scalable expense app.",
		businessContext:
			"Walnut wanted to build their expense management application ground up on a scalable platform. They wanted a robust scalable database in the backend which could store NoSQL type of data.",
		solution:
			"Google App Engine as the PaaS for building the mobile Application. Datastore in tandem with Google App Engine as the backend NoSQL database. BigQuery to process the end user data to provide insights on their expenses.",
		impact: "Google App Engine is a developer friendly platform, which helped them build and ship their mobile app to the market very easily. Easily scalable based on the traffic. Datastore helps them perfectly handle the NoSQL data with ease.",
		metricHeadline:
			"Google App Engine is a developer friendly platform, which helped them build and ship their mobile app to the market very easily.",
		techStack: "Google App Engine, Datastore, BigQuery",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-centioi",
		client: "Centioi",
		region: "EMEA",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Faster Insights and Business Agility using BQ",
		summary: "Modernizing Greenplum on-prem infrastructure to BigQuery and GKE.",
		businessContext:
			"Client needed to modernise the existing DWH (Greenplum) due to end of life & limited support. Modernise their existing on-prem infra to eliminate the maintenance overhead & improve operational efficiency.",
		solution:
			"Provided modern architecture for Infra & data layer enabled through GKE and Big Query. Application Layer was hosted on GKE to leverage cost savings & operational efficiencies.",
		impact: "Time to insights has improved significantly with BQ. Increase in developer productivity with migration to GKE. Better business agility shifting from a Capex to an Opex model.",
		metricHeadline: "Time to insights has improved significantly with BQ.",
		techStack: "Google Kubernetes Engine, BigQuery, Greenplum",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-recvue",
		client: "Recvue",
		region: "AMER",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Modernizing DWH for Faster Reports",
		summary: "Ingesting data from Oracle 12c to BigQuery via GoldenGate for batch reporting.",
		businessContext:
			"Recvue currently has its production database on Oracle 12c. The production instance hosts multiple databases one per each customer. Recvue's reporting requirements are batch in nature and some of the reports on Oracle take a long time to render. RecVue partnered with Searce to explore data services available on GCP and build a data warehouse to serve batch reports and also build a prediction model on BigQuery.",
		solution:
			"Configured Oracle Golden Gate and ingested data from Oracle to BigQuery. Converted the PL/SQL code from Oracle to BigQuery SQL dialect. Built stored procedures and views for reports on BigQuery. Data Studio was used to connect to BigQuery and render the reports.",
		impact: "Improved customer experience. More control on the data-pipelines. Centralized data in Cloud. Real-time analytics and quick decision making. Optimization and operational efficiency.",
		metricHeadline: "Improved customer experience.",
		techStack: "Oracle GoldenGate, BigQuery, Data Studio (Looker Studio)",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-trm",
		client: "TRM",
		region: "AMER",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Business Intelligence for a Risk Management Giant",
		summary: "Real-time visualization dashboards on Looker using BigQuery.",
		businessContext:
			"TRM enables risk management and compliance for a global community of financial institutions, cryptocurrency businesses and government agencies. As part of its management review, TRM wanted to have a self service BI Solution to consume actionable insights.",
		solution:
			"Looker was integrated with BigQuery tables as the data source for the visualization dashboards. Leveraged Looker capabilities to create real time dashboard that provides fully-managed rental homes and other critical business KPIs. Showcased Looker capabilities and user training to the business users.",
		impact: "110+ KPIs Visualized through looker. Looker trained engineers for continuous development.",
		metricHeadline: "110+ KPIs Visualized through looker.",
		techStack: "BigQuery, Looker",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-coindcx",
		client: "CoinDCX",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "CoinDCX wants to move from onPrem to AWS",
		summary: "Migrating cryptocurrency CSV and API data into AWS S3 and Looker dashboards.",
		businessContext:
			"CoinDCX collates all crypto currencies data from various sources on to AWS. Their historical data was available in CSV format. They were manually collating raw data from about 40 different apis and storing them in CSV files. Historical and Current year database were used for Analysis. Multiple reports were generated manually for analysing the Currency data.",
		solution:
			"Created a single storage space (AWS S3) for collecting all currency data. Custom scripts were used for transforming existing data into structured format in S3. Created pipelines to fetch historical & incremental data from about 40 different APIs, & transform to enrich the raw json data. A Looker dashboard was created for real time reports for all type of transactions across all crypto tokens & various platforms.",
		impact: "Cost optimisation from on-premise setup. Centralized data helped to store large amount of data from various 3rd party sources. One database to verify all the transactions across all the platforms and various crypto currencies. Looker Dashboard helped save hours of manual report generation.",
		metricHeadline:
			"Centralized data helped to store large amount of data from various 3rd party sources.",
		techStack: "AWS S3, Databricks, EC2, SSM, Looker",
		cloudProvider: "multicloud",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-containerized-and-deployed-api",
		client: "Containerized and deployed API",
		region: "AMER",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Containerized and deployed API",
		summary:
			"LO-NET Accelerates Mortgage Disbursals with AI-powered Doc Processing for 99% Accuracy",
		businessContext:
			"LO-NET relied on manual processing of loan documents which led to inefficiencies and higher chance of errors This slowed down the mortgage closing process for both loan officers and borrowers",
		solution:
			"Pre-Trained DocAI to handle a wide variety of financial documents Implemented Smart Splitting & Classification to route different document types to the most suitable parser for accurate data extraction Developed custom logic for complex cases that tackled intricate situations & ensured complete data extraction Deployed Scalable Cloud Run API which allowed seamless integration",
		impact: "Achieved 99% accuracy in document categorization and 96% in field extraction Electronic data extraction minimizes human error and ensures consistent information retrieval Streamlined document handling leads to quicker loan approvals and closings",
		metricHeadline:
			"Achieved 99% accuracy in document categorization and 96% in field extraction Electronic data extraction minimizes human error…",
		techStack: "Cloud Storage",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-client",
		client: "client",
		region: "EMEA",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "AI enabled chatbots",
		summary:
			"The client wanted to use a chatbot to automatically generate tasks in Jira automating and speeding up the manual process",
		businessContext:
			"Improving in house system Automated chatbot for creating tickets Bringing AI chatbot into workflow Better use of resources",
		solution:
			"Utilizing confluence documents and API documentation websites as the primary data source Integrating with JIRA to automatically create tickets based on user-reported issues Implement a natural language understanding (NLU) system to handle complex queries and maintain context across multiple turns Ensuring the chatbot can handle a growing user base and increasing data volumes.",
		impact: "Business teams can be used for more valuable tasks Faster process for logging issues Integration of AI with project management tooling Reduction of manual tasks and user error",
		metricHeadline:
			"Business teams can be used for more valuable tasks Faster process for logging issues Integration of AI with project management…",
		techStack:
			"Utilizing confluence documents and API documentation websites as the primary data source",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-this",
		client: "This",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Multilingual IVR bot to route user conversations",
		summary:
			"For live conversations, routing of calls & redirection to a human agent post understanding intent functionalities are implemented",
		businessContext:
			"BDO has the largest distribution network with over 1,700 operating branches and more than 5,500 teller machines nationwide BDO seeks to enable their customers by providing voice bot feature on their existing customer touchpoint This is to be enabled during the live conversations - text / speech (English/ Tagalog/ Taglish)",
		solution:
			"Analysis of flow to identify and group intents Creation of database, data ingestion Creation of dialogflow intents, entities, generators, webhook Set up transfer to agent/static IVR using Avaya payload and then call transfer to agent after `x' number of failures",
		impact: "BDO is now able to do agent authentication and intent identification seamlessly Human agent routing has been successfully implemented",
		metricHeadline:
			"BDO is now able to do agent authentication and intent identification seamlessly Human agent routing has been successfully…",
		techStack: "DialogFlow",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-using-searce",
		client: "Using Searce",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Automating Approvals for Insurance Giant",
		summary:
			"Using Searce's Recognic, built on top of Google's AI capabilities, for document AI for faster approvals and minimizing errors",
		businessContext:
			"Prolonged back-office process of policy issuance and claim approvals Regulatory non-compliance for customer identification and medical examination Large drop-out rate on online channels An underwriting overhead on the majority of the applications",
		solution:
			"Integrated Recognic with the front end mobile app used by insurance agents to verify supporting documents on users insurance applications in real-time.",
		impact: "Real-time validation of data between application form and associated identity, financial and medical examination documents. Significantly enhanced speed and efficiency of underwriting and approval processes by harnessing the agility and machine learning capabilities of Vision API 30% increase in number of applications processed within same timeframe",
		metricHeadline:
			"Significantly enhanced speed and efficiency of underwriting and approval processes by harnessing the agility and machine…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-capturing-accurate-addresses-for-card-delivery",
		client: "Capturing Accurate Addresses for Card Delivery",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Capturing Accurate Addresses for Card Delivery",
		summary:
			"Use GMP to accurately identify correct customer address to deliver credit cards hassle free",
		businessContext:
			"Required data-rich, accurate mapping technology to identify customer locations Capturing the Lat/Long and address string to make the card delivery experience smooth Using Maps data to identify the landmarks near to customer location",
		solution:
			"Assisted with utilizing places autocomplete api to get an accurate address string for the customer address Consulted on the APIs to be used across their mobile application Helped utilising places details data to identify nearby landmark to the customer Helped optimize the usage on Google Maps Platform",
		impact: "Customers can accurately pinpoint their location in a map through functionality made available through the Geocoding API, in conjunction with the JavaScript API. Address details made more robust by getting landmark information through places details API",
		metricHeadline:
			"Customers can accurately pinpoint their location in a map through functionality made available through the Geocoding API, in…",
		techStack: "Places Details API Geocoding API Autocomplete API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-field-rep-the-company",
		client: "Field Rep The company",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Accurate Fuel Reimbursements for Employees",
		summary:
			"Use GMP to accurately calculate travelled distance and thus calculate fuel reimbursement accurately",
		businessContext:
			"Inaccuracy in calculation of distance traveled by the Field Rep The company wanted to track the location of their Field Reps",
		solution:
			"Used Google Maps Platform instead of calculating the aerial distance Through a small POC we showed them the difference between the current implementation and using the Google Maps Platform",
		impact: "Accurately calculate the distance traveled by the Field reps Streamlined the process of Fuel reimbursement using Google Maps Platform",
		metricHeadline:
			"Accurately calculate the distance traveled by the Field reps Streamlined the process of Fuel reimbursement using Google Maps…",
		techStack: "Directions API Geocoding API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-icici-lombard-team",
		client: "ICICI Lombard team",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Shipment Tracking for a Financial Giant",
		summary: "Use GMP to track shipments and calculate distance to be travelled by vehicles",
		businessContext:
			"ICICI Lombard team wanted to track their shipments and vehicles. Visualize the current location on top of a mapping solution. Also, calculate the distance to be traveled by the vehicles",
		solution:
			"Searce proposed to go for Google Maps Platform to implement the above mentioned use case Searce conducted a kick start workshop to explain how Google Maps APIs work and also provided the necessary billing support",
		impact: "Accurately locate the shipment location and easily calculate the distance traveled between desired points",
		metricHeadline:
			"Accurately locate the shipment location and easily calculate the distance traveled between desired points",
		techStack: "Directions API Geocoding API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-sea",
		client: "SEA",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Finding Money Easily with SEA's Fintech Giant",
		summary:
			"Use Places API to find ATMs easily. Use location based fraud prevention for better security",
		businessContext:
			"Make liquid money easily accessible to the people. Reduce bottlenecks at traditional banking a ATMs Centralize internet banking services on a single smartphone base scalable platforms",
		solution:
			"Helped SoCash leverage the powerful places database provided by Google to find the nearest cash distribution vendor Assisted them to develop a robust fraud detection mechanisms that guarantees the safety of its own platform",
		impact: "Achieved monthly growth rate of 22% (CMGR) Reduced the soCash platform response times to enable the processing of hundreds of thousands of events Expanded to the densely populated countries in SEA - Singapore, Malaysia and Thailand",
		metricHeadline:
			"Achieved monthly growth rate of 22% (CMGR) Reduced the soCash platform response times to enable the processing of hundreds of…",
		techStack: "Directions API Geocoding API Roads API Routes",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-api-management-for-payments-giant",
		client: "API Management for Payments Giant",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "devops_platform_engineering",
		practiceLabel: "Software Engineering",
		title: "API Management for Payments Giant",
		summary: "Leverage Apigee for API development, exposing core FinTech Services as APIs",
		businessContext:
			"Expose existing FinTech Services as secured APIs through Apigee Standardize API Specifications OWASP Threat Protection Time window based Spike Arrest Configuration, Tier Based Quotas Quick merchant onboarding",
		solution:
			"Delivered API management platform using Apigee Edge Implemented OWASP Threat Protection using Apigee Security & Traffic Management Policies Implemented Time Window based Spike Arrest Configurations & Tier based quotas using OOTB & Customizations Standardized OpenAPI Specifications using REST API Design Best Practices Quick onboarding & API Access through Integrated Developer Portal",
		impact: "41 Merchant Onboarding, Payment Gateway & PoS Standardized APIs available for easy Integration FSS Backend systems got secured against OWASP Threats & Spikes Easy Merchant Onboarding & quick API Access APIs as Products for enhanced API Customer experience & easy integrations",
		metricHeadline:
			"41 Merchant Onboarding, Payment Gateway & PoS Standardized APIs available for easy Integration FSS Backend systems got secured…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-landing-zone-and-banking-application",
		client: "Landing Zone and Banking Application",
		region: "EMEA",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "devops_platform_engineering",
		practiceLabel: "Software Engineering",
		title: "Landing Zone and Banking Application",
		summary: "Beyla now have a Landing Zone and a first stage banking application",
		businessContext:
			"A light version of the PWA App Integration with SaaSacada BaaS solution AI Integration for processing documents, client data and generating recommendations for SMEs UI of the MVP",
		solution:
			"Best practice Google Cloud foundation Deployed a working application with APIs Created the UI and backend infrastructure Gemini Integration with the application and testing multimodal solutions",
		impact: "New secure Landing Zone on Google Cloud Working Application for MVP Integration with Gemini Backend and UI documented and handed over Cloud Storage",
		metricHeadline:
			"New secure Landing Zone on Google Cloud Working Application for MVP Integration with Gemini Backend and UI documented and…",
		techStack: "Cloud DNS, Cloud Run",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-ci-cd-pipeline-automations-ayoconnect",
		client: "CI-CD Pipeline Automations Ayoconnect",
		region: "APAC",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "devops_platform_engineering",
		practiceLabel: "Software Engineering",
		title: "API Management for Open-Banking",
		summary:
			"API Gateway for Open-Banking APIs - OWASP Threats Protection, Developer Portal, CI-CD Pipeline Automations",
		businessContext:
			"Ayoconnect is Indonesia's largest financial API platform. As a next step in their growth journey, they envisioned adding a set of Open Banking APIs readily available to developers and businesses. To fulfil this use case they decided to use Apigee X as their API gateway and management platform.",
		solution:
			"External API proxies on Apigee X with private target at Cloud Run. Security Hardening with VPC Service Controls. OAuth 2.0 authentication and payload optimization. DDoS, Spike and Injection Protection. Testing and deployment automations with Cloud Build Orchestrations. Developer Portal - API documentation and API Key Generation.",
		impact: "Searce solved for an unprecedented use case of externally exposing Apigee API Proxies targeted to internal Cloud Run services. The Developer Portal catered to a smooth developer experienceUser Sign-Up, API Keys Generation and API Documentation. CI-CD pipelines helped their developers test and integrate their APIs with Apigee in an automated fashion, hence saving time and reducing errors.",
		metricHeadline:
			"Searce solved for an unprecedented use case of externally exposing Apigee API Proxies targeted to internal Cloud Run services.",
		techStack: "Apigee X Cloud Run Cloud Build Mocha",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-migration-of-workloads",
		client: "Migration of workloads",
		region: "EMEA",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Migration of workloads-GCP to reduce overall TCO",
		summary:
			"Migration of workloads to GCP & Optimized DevOps Lifecycle phases using the latest in container management technology.",
		businessContext:
			"Reduce Overall TCO Observability Optimise DevOps Lifecycle phases while using the latest in container management technology.",
		solution:
			"Migration of workloads to AutoPilot GKE cluster on GCP Monitoring Dashboards for quick view of Infra and insights for optimization provided. Implemented Automated CICD pipeline using Github Actions which deploys to multiple environments.",
		impact: "Successful completion of project scope within timelines of the project. Zero Rollbacks in Production migration and cutover. 4 additional services were onboarded and migrated within the project timelines. Autopilot, fully automated CICD pipeline, Helm Templates, Doppler integration, monorepo architecture resulting in faster onboarding of new service helped in reducing the toil.",
		metricHeadline:
			"4 additional services were onboarded and migrated within the project timelines.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-vmware-workload-which-they",
		client: "VMware workload which they",
		region: "AMER",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "GCVE Foundations + Migration",
		summary:
			"OIA Global has 121 VM's on existing VMware workload which they wanted to move it on GCVE, secured connectivity for required users across the world.",
		businessContext:
			"121 VM's on existing VMware workload lift and shift the workload without data loss and in preferred timeline and secured connectivity for required users across the world Due to increase in licensing cost for on-premise VMWare resources, OIA Global preferred the GCVE as best fit solution.",
		solution:
			"Enterprise tier landing zone has been created in Google Cloud Platform to meet OIA Global unique needs and requirements. Followed best practices to provision Org Policies, VPC, GCVE Private Cloud and other resources to meet the OIA Global requirements. Created VPN tunnel between on-prem and Google Cloud to establish a robust and secure connection to migrate VMs.",
		impact: "Better and intuitive customer experience with improved performance of the workloads with better and latest hardware, better scalability and better security posture Lift-and-shift VMWare workload to GCVE without refactoring thus reducing impact to the business and applications Cost optimized by transitioning from CapEx to OpEx with flexible scaling Logistics | Cloud Modernization",
		metricHeadline:
			"Better and intuitive customer experience with improved performance of the workloads with better and latest hardware, better…",
		techStack: "Cloud Firewall Rules, VMware Engine",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-rs-metrics",
		client: "RS Metrics",
		region: "AMER",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Google Marketplace Listing",
		summary:
			"RS Metrics wanted to perform listing of its offering (ESGSignals) on Google Marketplace (SAS & BYOL)",
		businessContext:
			"As part of its Kubernetes offering, RS Metrics was looking for ways to help their Google Cloud Platform based clients to maximize their usage of the service. Through the Google Cloud Platform marketplace, they would be able to acquire customers from a wide range of industries. To list their Kubernetes(k8s) application in the GCP Marketplace.",
		solution:
			"Incorporated the Kubernetes product into Google marketplace listings. Enhanced the product's deployment process by utilizing the marketplace solution. Designed and packaged their kubernetes application to be able to list in the Google Cloud Platform Marketplace.",
		impact: "Through the implementation of the marketplace solution, RS Metrics will be able to attract customers who already use the services of Google Cloud Platform. Enabled one click deployment of the containerised application into the customers cluster environment with minimal efforts. Reduced the calculations involved in billing by adding Bring Your Own License (BYOL) model. TTL - Satellite Analytics | Infra Modernization",
		metricHeadline:
			"Through the implementation of the marketplace solution, RS Metrics will be able to attract customers who already use the…",
		techStack: "Google Cloud Google Kubernetes Marketplace Engine, Container Registry",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-emt",
		client: "EMT",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Modernizing Infra for a Tours & Travels Website",
		summary: "Migration from On-Prem and GCP for cost saving and outage prevention mechanism",
		businessContext:
			"EMT wanted to reduce their existing infrastructure cost which was hosted on premise and EMT web application which was hosted on AWS. Implementing Mirroring and Failover for the SQL Database as that will help them if there's any outage. Issues related to IIS timeout",
		solution:
			"Configuring the Global Load Balancer in the Backend EMT web application live-migration from AWS to GCP using cloud endure. SQL Server migration from On-Premise to GCP with mirroring Configured AlwaysOn for high availability and disaster recovery",
		impact: "20% optimization in cost from AWS to GCP Reduction in Cloud Spend and overall Infrastructure Cost Increase in the performance with reduced latency Better Security with Mirroring and Failover implementation",
		metricHeadline:
			"20% optimization in cost from AWS to GCP Reduction in Cloud Spend and overall Infrastructure Cost Increase in the performance…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-migrating-pickme",
		client: "Migrating PickMe",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Modernizing Data Platform for Cab Hailing App",
		summary:
			"Saved costs by moving data services from Azure to GCP without compromising performance",
		businessContext:
			"Migrating around 35 TB data from Azure blob to GCS. Migrating Hadoop, Kafka, Spark and IQR clusters from Azure to GCP Dataproc with centralised Hive metastore. Cost effective solution as their data platform Explore GCP and compare services with Azure based on capability and cost",
		solution:
			"Migrated historical data and delta data from Azure Blob to Google Cloud Storage using storage transfer service Deployed Dataproc cluster with Kafka, Ranger, Hive, Sqoop, Zookeeper and HBase components with best practice configuration. Implemented Data Security framework using Apache Ranger for comprehensive data security across the Hadoop platforms Deployed Azkaban servers on Dataproc for scheduling and triggering the workflows",
		impact: "Migrating PickMe's data workload from Azure to GCP Centralised data on GCS so that it became easier for references and internal usage within the GCP, enabling smart analytics and AI use cases. Reducing their current infrastructure cost without compromising on performance, speed and efficiency",
		metricHeadline:
			"Migrating PickMe's data workload from Azure to GCP Centralised data on GCS so that it became easier for references and…",
		techStack:
			"Migrated historical data and delta data from Azure Blob to Google Cloud Storage using storage transfer service",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-go-quo",
		client: "Go Quo",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Saving IT Costs for a Flight Booking Platform",
		summary:
			"Leverage Managed Services on GCP to save management overhead and focus on the application features",
		businessContext:
			"Go Quo hosted on AWS and was leveraging AWS Elasticache for Redis along with Amazon's Simple Notification Service and Simple Email Service. Go Quo team required a self managed and automated infrastructure and hence wanted to leverage the managed services on GCP to decrease their overhead and improve innovation on the product side.",
		solution:
			"Searce did all the necessary integration with monitoring and logging systems and followed all the required Security policy implementation along with Adhering to all the compliance requirements. Windows IIS Applications running on Google Compute engine MSSQL DB's running on Google Compute Engine Migrated Go Quo's existing infrastructure from AWS to GCP",
		impact: "Fully automated infrastructure assisting them to focus more on innovating their products Go Quo team will also have a more engaging product helping them in better customer acquisition Managed services on GCP decreased the overhead of running the overall infra",
		metricHeadline:
			"Fully automated infrastructure assisting them to focus more on innovating their products Go Quo team will also have a more…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-tracking-user-engagement-for-airline-giant",
		client: "Tracking User Engagement for Airline Giant",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Tracking User Engagement for Airline Giant",
		summary:
			"Leverage automated scripts and data from Google Tag Manager to track user engagement efficiently",
		businessContext:
			"Santan by AirAsia lacked a solution on their application to enable them track customer engagement activities The metrics given by Google Tag Manager were basic and not enough to track and hence use the data to work on advanced use-cases",
		solution:
			"Searce suggested the application of Google Tag manager that allowed Santan to a manage and deploy marketing tags by writing custom scripts integrated with their frontend Searce provided a solution with enabled Santan to track activities by users when they visit their website for ordering food.",
		impact: "Santan can now understand the user activity lifecycle on their website such as time spend to order, Failure and error rates of order can now be easily tracked and engaged with Sanatan now has better customer acquisition and engagement campaigns",
		metricHeadline:
			"Santan can now understand the user activity lifecycle on their website such as time spend to order, Failure and error rates of…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-customer",
		client: "Customer",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Global HA Solution for Travel Social App",
		summary:
			"Leverage GCP CDN and Load Balancing solutions to maintain high availability for users around the world and save costs",
		businessContext:
			"Customer was looking for cost saving and ease of management of the resources. Handling millions of requests of users on the website Significantly reducing cost Right sizing of resources",
		solution:
			"Use of Terraform to automate resources creation in GCP. Strong security posture by connecting servers using Identity Aware Proxy (IAP). Implemented Load Balancer to distribute traffic among different backend Servers and SSL authentication through LB (Automated SSL Renewal and Management) Implemented Managed SQL DB to get rid of Management overhead. Implemented CDN in GCP by moving the content to GCS Buckets enabled by Cloud CDN for low latency content serving",
		impact: "Enhanced performance and latency with the help of cloud solutions High Availability of the website to users spread across the world ~20-30% reduction in Cloud Spends vs previous Cloud Platform",
		metricHeadline:
			"Enhanced performance and latency with the help of cloud solutions High Availability of the website to users spread across the…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-containerizing-microservices-for-india-s-largest-trucking-platform",
		client: "Containerizing microservices for India's largest trucking platform",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Containerizing microservices for India's largest trucking platform",
		summary:
			"Containerization of spring based microservices from AWS to GCP by leveraging existing CI/CD pipelines",
		businessContext:
			"Highly agile & robust microservices framework on AWS 100+ microservices on AWS EC2 machines Maintenance and Monitoring using AWS native & third party tools such as Datadog , New Relic. Dockerize the existing microservices on GKE & setup a foundation for full migration to GCP Create a monetizable roadmap for logistics partner with lower IT operation heads",
		solution:
			"GCP Foundation setup based on the best practices 97 Microservices were containerized which were built upon Java 8 and Python v2.7 16 database instance with data migrated from AWS to GCP via GCP DMS CI/CD pipelines implementation and integration leveraging Jenkins ELK Setup on GKE cluster Stackdriver dashboards in line with existing Kibana dashboards Self-hosted MongoDB, Cassandra DB migration to GCP via native method of data replication",
		impact: "Reduction in cost compared to AWS counterpart Enhanced TTM with agile project delivery framework Faster build and deploy time for all applications containerised Jenkins",
		metricHeadline:
			"Reduction in cost compared to AWS counterpart Enhanced TTM with agile project delivery framework Faster build and deploy time…",
		techStack:
			"GCP Foundation setup based on the best practices 97 Microservices were containerized which were built upon Java 8 and",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-airasia",
		client: "AirAsia",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Self-Managed Modern Application for Airline Giant",
		summary:
			"Infra and App Modernization to modern, self managed tech stack. Ensure minimum downtime for users",
		businessContext:
			"AirAsia had an existing app built on App Maker which was being deprecated and wanted to completely modernise the app to latest tech stack AirAsia also wanted the infrastructure to be self managed as much as possible AirAsia wanted the migration from old application to the new one to be seamless for the users The existing data had also to be migrated to the new platform",
		solution:
			"Architected and developed a cloud native serverless application and deployed on GAE with Cloud SQL as the database The entire app was rewritten in modern tech stack The data model was designed to use the existing data as is to facilitate platform migration",
		impact: "Successfully launched the portal for the entire user base The data from old platform is migrated to new platform and the transition of users between old and new systems was seamless The performance improved and the maintenance overhead significantly reduced",
		metricHeadline:
			"Successfully launched the portal for the entire user base The data from old platform is migrated to new platform and the…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-modernizing-database-for-a-cab-hailing-app",
		client: "Modernizing Database for a Cab Hailing App",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Modernizing Database for a Cab Hailing App",
		summary:
			"Leverage Managed DB solutions on GCP and microservices based architecture to scale seamlessly and have better DR",
		businessContext:
			"Difficulty with scaling - Friday evening traffic surges Unable to choose the instance sizes of choice Increase in lead time needed for procuring new servers Sporadic downtimes Difficulty to iterate faster",
		solution:
			"Prior to migration, Searce ran a thorough assessment of then existing on-prem infra and came up with the following services inventory to enable these services to talk to each other Consolidated servers and services to arrive at a multi-tiered, highly available and, scalable architecture on Google Cloud Deployed a large fleet of self managed MySQL servers with a complex replication topology of multiple masters and slaves behind proxysql along with the managed Cloud SQL databases for postgres and MySQL",
		impact: "Latency reduced by 10x with more reliable infrastructure Reduced infra spend a better DR setup Reduced management overhead Better performance with microservices deployment",
		metricHeadline:
			"Latency reduced by 10x with more reliable infrastructure Reduced infra spend a better DR setup Reduced management overhead…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-kubernetes",
		client: "Kubernetes",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Scaling with High Demand for Cab Hailing App",
		summary:
			"Revamp the current infrastructure with right-sizing and deployment on Kubernetes - reduce dev-time, improve performance",
		businessContext:
			"Difficulty in enforcing security across the spread out infra Unable to scale vis-à-vis the way deployments were done More time spent managing infra, than shipping new features Difficulty in identifying the root cause of the problem when something went wrong Unaffordable downtimes with no guaranteed SLAs Over-provisioning of resources",
		solution:
			"Consolidate 200 + servers from multiple datacenters, and deploy a highly available and scalable infrastructure using Google Cloud services Deployed VM based microservices to manage Kubernetes with Istio Built a data layer with better availability and performance Provided Support for multiple managed databases (MySQL, Mongo & Redis)",
		impact: "Gained ability to do 15 Minor releases per day and app update every 2 weeks Increased observability, ability to triangulate issues faster and resolve with minimal disruption Highly available and scalable database layer to support high transactional workloads Able to run a highly transactional and read/write intensive database layer without spending too much money",
		metricHeadline:
			"Gained ability to do 15 Minor releases per day and app update every 2 weeks Increased observability, ability to triangulate…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-jenkins-server",
		client: "Jenkins server",
		region: "AMER",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Migration of AWS infra & workload to GCE & GKE",
		summary:
			"Deployment AWS infra to GCP App using CI/CD Jenkins pipeline on GKE. Migration AWS RDS to Cloud SQL, Cloud Memorystore Redis and execution of GCP.",
		businessContext:
			"Automate Infrastructure deployment for multiple environments Application deployment using CI/CD Jenkins pipeline Migration of AWS databases to GCP Cloud SQL & Memorystore Redis Securely access Cloud SQL mysql database using Cloud SQL Auth proxy. Wildcard certificate creation using Letsencrypt & cert-manager",
		solution:
			"deployed the infrastructure using terraform scripts. Formation and deployed of app using Jenkins Pipeline & Helm charts on GCP GKE Restoring AWS database dumps to GCP Cloud SQL & RDB snapshot to Memory Store Redis Deployed CloudSQL & proxy deployment for secure communication between database and app.Deployed Wildcard",
		impact: "The migration of applications from AWS EKS to GCP GKE assisted in more control over the deployment and increased the scalability of applications. Creation of Helm charts for effortless deployment The Jenkins server is secured by attaching it as a backend to the load balancer. Deployment of Wildcard SSL certificates & CloudSQL auth proxy to GKE-hosted app. Improved security and scalability",
		metricHeadline:
			"The migration of applications from AWS EKS to GCP GKE assisted in more control over the deployment and increased the…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-optimize-time-and-cost-using-google-maps",
		client: "Optimize time and cost using Google Maps",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Optimize time and cost using Google Maps",
		summary:
			"Helped optimize API calls and leverage real time traffic data for monitoring and optimizing the supply chain",
		businessContext:
			"Create a location-based solution that delivers rich maps and reliable navigation to customers Mitigate risks by lowering insurance cost Reduce wasted and congestion during transit and at warehouses",
		solution:
			"Helped them to leverage real-time traffic data to avoid bottlenecks at warehouses and reduce wait time by 20% to 40% Optimized API calls to smoothen the variations in GPS reading for accurate visualization of a vehicle's location",
		impact: "Reduced toll cost by 1% to 4% due to the ability to plan efficient delivery routes Monitors the movement of $560Mn of freight along the supply chain every month with little human intervention Easily scales to track more than 100,000 loads per customer account Cuts cargo delivery, loading, and unloading time by 40%",
		metricHeadline:
			"Reduced toll cost by 1% to 4% due to the ability to plan efficient delivery routes Monitors the movement of $560Mn of freight…",
		techStack: "Directions API Autocomplete API Roads API Geocoding API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-improving-ux-for-a-digital-printing-company",
		client: "Improving UX for a Digital Printing Company",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Improving UX for a Digital Printing Company",
		summary:
			"Leverage GMP APIs to scale with demand in smaller cities, optimize time and costs for end users",
		businessContext:
			"Leverage GMP APIs to scale with demand in smaller cities, optimize time and costs for end users",
		solution:
			"Customer primary business is creating customized t-shirt, bottles etc for Consuming API to track orders before they reach the final customer Schools, companies etc Identifying customer addresses at check out pages Present across multiple geographies, leaders in what the do",
		impact: "Order tracking and customer service has improved due to ease of tracking Customers have to spend less time inputting their addresses which leads to faster checkouts Customer orders have gone up after the implementation of of Geocoding & Places Autocomplete API",
		metricHeadline:
			"Order tracking and customer service has improved due to ease of tracking Customers have to spend less time inputting their…",
		techStack: "Directions API Geocoding API Roads API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-asset-tracking-for-a-supply-chain-startup",
		client: "Asset Tracking for a Supply Chain Startup",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Asset Tracking for a Supply Chain Startup",
		summary: "Track assets and calculate ETA/distance accurately to save time and costs",
		businessContext:
			"Required data-rich, accurate mapping technology and scalable visualization platform Visualize asset location on a real time basis Calculate accurate ETAs and distances",
		solution:
			"Assisted with identifying the correct pricing model for the API consumption Consulted on the APIs to be used across their mobile applications and websites Helped optimize the usage on Google Maps Platform by suggesting tweaks in use-cases and logic in API consumption",
		impact: "Accurate distances and ETA calculated using Distance Matrix Advanced API which includes Reduction in total API consumption and billing",
		metricHeadline:
			"Accurate distances and ETA calculated using Distance Matrix Advanced API which includes Reduction in total API consumption and…",
		techStack: "Directions API Geocoding API Distance matrix advanced API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-optimizing-delivery-for-courier-company",
		client: "Optimizing Delivery for Courier Company",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Optimizing Delivery for Courier Company",
		summary: "Use GMP APIs to find accurate address and assign nearest cab driver",
		businessContext:
			"Required accurate address for pick and drop points to calculate accurate travel time Calculate fare based on origin and destination Optimize the path drivers take to help ensure the fare charged is accurate",
		solution:
			"Google's Places data gives users more accurate addresses to choose as pick up or delivery points Assign orders to nearest available cab and driver based on users pick up point Provide users with real time ETA and drivers location",
		impact: "Accurate addresses helped reduce rerouting from wrong pick up locations, also avoiding customer dissatisfaction Google Maps Platform helped ensure drivers pick up most customers within the defined SLA Showing user the drivers real time location helps reduce anxiety as well as calls to customer care",
		metricHeadline:
			"Accurate addresses helped reduce rerouting from wrong pick up locations, also avoiding customer dissatisfaction Google Maps…",
		techStack: "Directions API Geocoding API Roads API Autocomplete API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-platform-science",
		client: "Platform Science",
		region: "AMER",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Looker Dashboards for Multi-tenant Application",
		summary:
			"Developed Looker dashboards for different product lines like safety and operational efficiency, with a final aim to embed them in their native application and enable access through SSO. These dashboards are used by external fleet users (customers) and internal management team to execute safety programs, manage fleet assets.",
		businessContext:
			"Platform Science had a roadmap for developing and deploying advanced and intuitive Looker dashboards and integrate it with their native application Data availability to the customers/users based on their access, permissions, and timezone Ease of development and code maintainability Automate Looker dashboards deployment in various environment",
		solution:
			"Built looks and dashboards based on the business requirements with drill down to detail, scheduled reports based on defined thresholds for their fleet managers, safety managers and transportation director to explore data and make quicker decisions Implemented a framework to migrate code, dashboards and looks across dev, staging, and production Looker instances Created data governance framework for all Looker users using combination of content access for folders, user attributes, roles, user groups",
		impact: "Eliminate silos by developing unified looks & dashboards for all the fleets for a use case and control access to each fleet using user attributes Roles, groups, user attributes, and content access for folders streamlined the access controls across the business users Improved the visualization experience using looker capabilities to provide insights on telematics and productivity data Non -",
		metricHeadline:
			"Eliminate silos by developing unified looks & dashboards for all the fleets for a use case and control access to each fleet…",
		techStack: "Snowflake Looker",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-tableau-for-visualizations-sap-hybris",
		client: "Tableau for visualizations SAP Hybris",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Cost Effective Analytics using Redshift for Logistics Leader",
		summary:
			"Offloading analytics workload to Redshift moving out of SAP HANA framework with Tableau for visualizations",
		businessContext:
			"SAP Hybris had limitation on generation of certain drill down reports. Complex GUI HANA model views Consignment level data development require more hardware and licenses from SAP Maintenance and Monitoring of the SAP Integration with different application to SAP HANA require is expensive",
		solution:
			"Deployed pipelines to extract data from SAP BRIM/HANA and load into Redshift by using BODS Design DW schema as per AWS Redshift best practices and reduce the complexity Deployed transformation jobs to process data, created OLAP models to slice and dice the data Integrated Redshift data with Tableau dashboards Provision to on-board new data-pipelines with few easy steps Deployed pipeline for CTBS workload to Redshift using AWS Glue Converted SAP HANA data models to Redshift compatible queries",
		impact: "Significant savings in terms of licensing & infrastructure cost of SAP system by offloading analytics workload on Redshift Redshift is SQL compatible - Implementing new analytics workload is easier than SAP system. SAP implementation & maintenance cost saved. Drilldown data (Consignment level) gets populated on Tableau faster than SAP HANA",
		metricHeadline:
			"Significant savings in terms of licensing & infrastructure cost of SAP system by offloading analytics workload on Redshift…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-client-2",
		client: "Client",
		region: "AMER",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Oracle Exit and Infra Modernization for CONVO",
		summary:
			"Leverage Cloud SQL for faster and cost effective DB for operational and analytical workloads",
		businessContext:
			"Client wanted to modernise the existing DB (AWS RDS ORACLE) due to end of life & for ease of use While evaluating Cloud SQL PostgreSQL, they partnered with Searce on modernising the entire infra to eliminate the maintenance overhead & improve operational efficiency.",
		solution:
			"Modern architecture for Infra & data layer enabled through Cloud SQL PostgreSQL Data migration from AWS RDS Oracle to Cloud SQL PostgreSQL was carried out in various phases.. Schema conversion, data type conversion, Stored Procedures, Functions conversion to target Database using AWS Schema Conversion Tool (SCT)) Migration instance was setup and around 3TB data was migrated from AWS RDS Oracle to Cloud SQL PostgreSQL using AWS Data Migration Service On successful data migration, cutover activity was planned and Cloud SQL PostgreSQL was successful initiated",
		impact: "Time to insights improved significantly Ease of use and cost effective Modernization and operational efficiency Agile and robust Infrastructure 20-30% reduction in Infra cost",
		metricHeadline:
			"Time to insights improved significantly Ease of use and cost effective Modernization and operational efficiency Agile and…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-in-the-existing-setup",
		client: "In the existing setup",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "devops_platform_engineering",
		practiceLabel: "Software Engineering",
		title: "Building a document search engine for RE",
		summary:
			"Building of an application to search documents- by model, part, and group assembly type, a robust search tool",
		businessContext:
			"In the existing setup is developed using Google Form All the requests are captured in the spreadsheet in the backend. It is developed using app script It is difficult to maintain the version control of the documents listed and recorded within the library system. Hence the new development will be done on app engines to improve user experience",
		solution:
			'Built a robust search tool to search documents by model, part, and group assembly type, a robust search tool Built-in "HELP" that will guide users through document submission, approval protocols, and system navigation The document library shall be available to Global RE-PD members',
		impact: 'Make it easier for everyone to search for documents based on multiple criteria All document approvals are done through this platform built Enabled "HELP" that will guide through document submission, approval protocols, and system navigation Seamless way to search for documents by the employees',
		metricHeadline:
			"Make it easier for everyone to search for documents based on multiple criteria All document approvals are done through this…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-bizzy",
		client: "Bizzy",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "devops_platform_engineering",
		practiceLabel: "Software Engineering",
		title: "Modernizing legacy apps to Serverless",
		summary: "App modernization to move away from .net app to serverless node app",
		businessContext:
			"Bizzy was at the start of the infra and app modernization and as a first step, wanted to move away from the .NET applications The new application should use an opensource database backend and not SQL Server Bizzy wanted to avoid the license associated with hosting and running .NET and SQL Server applications",
		solution:
			"Darfur, Tukur Fatar and Cashier are domains for Bizzy. Searce has built serverless apps. Used AWS API gateway for routing services Built the service to support mysql database and created interface for consuming the same",
		impact: "Enabled serverless application stack for all the domain service Moved out the dependency over mssql apps and modernized to mysql Saved the license costs associated with hosting and running .net and SQL Server applications",
		metricHeadline:
			"Enabled serverless application stack for all the domain service Moved out the dependency over mssql apps and modernized to…",
		techStack: "JavaScript",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-adding-features-to-sqlcommenter-project",
		client: "Adding features to SQLCommenter Project",
		region: "APAC",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "devops_platform_engineering",
		practiceLabel: "Software Engineering",
		title: "Adding features to SQLCommenter Project",
		summary: "An open source plugin that attach metrics to sql query BIZZY",
		businessContext:
			"Need plugins to attach ORM or driver related metrics to the sql query so that we can associate query by metrics at large scale Migrate google sqlcommenter into open telemetry",
		solution:
			"Develop middlewares for ORM Develop custom cursors for drivers Migrate the sql commenter into open telemetry and they can be enabled in open telemetry using flags",
		impact: "ORM, driver or request metrics can be appended to the sql logs Open Telemetry traceparent can be added to the logs",
		metricHeadline:
			"ORM, driver or request metrics can be appended to the sql logs Open Telemetry traceparent can be added to the logs",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-client-3",
		client: "client",
		region: "AMER",
		industryCode: "TTL",
		industryName: "Travel, Transportation & Logistics (TTL)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Accelerate training & testing",
		summary:
			"Optimize code and training workflow to accelerate training & testing of deep learning models",
		businessContext:
			"The client is working on multiple Deep Learning algorithms trains on 3D Point clouds data and some other use-cases as well. The customer wants to reduce training time to speed up training process and get faster results. The goal was to help them optimize the code and training workflow to reduce the training time and accelerate their research experiments and delivery flow.",
		solution:
			"Searce first worked on optimizing the codebase, removing bottlenecks, visualizing data flow between CPU and GPU devices using Nvidia Nsight Systems. Then the code was made compatible to run on Nvidia's flagship A100 devices to further optimize the training time. Further optimizations were made by implementing Quantization Aware Training which helped them optimize their other workflows.",
		impact: "The training time was reduced to 1-1.5 day from original 8 days which enabled the team to perform multiple experiments and model iterations in order to get the best possible results. Faster delivery, reduced wait time.",
		metricHeadline:
			"The training time was reduced to 1-1.5 day from original 8 days which enabled the team to perform multiple experiments and…",
		techStack: "Compute Engine Nvidia A100, Nvidia Tensor RT Nsight Systems",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-moglix",
		client: "Moglix",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "On Prem to Google Cloud Platform Migration",
		summary: "Multi-stage secure container infrastructure deployment on GKE.",
		businessContext:
			"When developing a Java-based application, storing sensitive files containing credentials and secrets on GitHub poses a significant security risk. The size of Docker images used for deploying the application on Kubernetes can be large, resulting in slower pod launches.",
		solution:
			"Multi-stage Docker images is implemented. In the first stage, Credentials are securely retrieved from the GCP Secret Manager, mitigating the risk of storing them on GitHub. Use of multi-stage containers reduces Docker image sizes, leading to faster pod launches on Kubernetes.",
		impact: "Increased customer satisfaction, and a competitive advantage in the market. Customer was able to achieve more agility and leverage cloud native features. Customer was also able to save around 15-20% in cost.",
		metricHeadline: "Customer was also able to save around 15-20% in cost.",
		techStack:
			"Google Kubernetes Engine, Compute Engine, GCP Secret Manager, Elastic Search, Redis, RabbitMQ, MySQL",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-myanatomy",
		client: "MyAnatomy",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to GCP migration of workloads",
		summary: "Dockerization of monolithic AWS Lightsail workloads to GKE.",
		businessContext:
			"MyAnatomy is product based startup based out of Bangalore, Karnataka. Providing SaaS-based talent demand & supply solutions for corporates, colleges & candidates. MyAnatomy also wanted to optimize the cloud infrastructure cost, modernize their application. MyAnatomy also wanted to enhance security and implement DevOps best practices.",
		solution:
			"Provision GCP services which correspond to the respective AWS services. (Ec2 to GCE, s3 – GCS, VPC- VPC, ALB – GCP LBs and so on). Ensure that the running environment is efficient, secure and runs cost effective. Migrate AWS Lightsail to GCP after dockerisation of existing workloads. Dockerization of monolithic applications in AWS Lightsail.",
		impact: "Build a scalable, secure baseline infrastructure for potential future growth. Compute and operational cost benefits. CI/CD setup for dockerized applications by provisioning Jenkins and efficient migration and cutover involving 17 servers and 10 AWS Lightsail applications within a month. Secure infrastructure by applying the required organization policy, cloud armor rules and SCC.",
		metricHeadline:
			"CI/CD setup for dockerized applications by provisioning Jenkins and efficient migration and cutover involving 17 servers and…",
		techStack: "Kubernetes Engine, Compute Engine, Cloud Storage, Cloud SQL",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-retail-intelligence-firm",
		client: "Retail Intelligence Firm",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Infra setup in Google Cloud for Prod and DR",
		summary:
			"Greenfield implementation of production and disaster recovery (DR) environments in regional zones.",
		businessContext:
			"Wanted to minimize reliance on legacy AWS and on-prem setups to establish a localized retail data footprint in Dammam and Singapore with zero public IP exposure.",
		solution:
			"Deployed a standalone VPC configuration in Prod/DR linked via VPC Peering; isolated instances using custom service accounts; attached Cloud Armor WAF to Global Load Balancers.",
		impact: "Deployed a completely secure, modular cloud infrastructure; Cloud Armor and SCC provided total defense against web application threats; automated disk snapshots ensured disaster resilience.",
		metricHeadline:
			"Deployed a completely secure, modular cloud infrastructure; Cloud Armor and SCC provided total defense against web application…",
		techStack:
			"Virtual Private Cloud, Cloud Armor, Security Command Center, GCS, Cloud Snapshots",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-dmart",
		client: "DMart",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Hybrid Infrastructure for Retail Corporation",
		summary:
			"Leveraging Hybrid Infra to save costs, by advanced networking capabilities for connecting between on-prem and cloud",
		businessContext:
			"Hybrid Infrastructure: Looking for hybrid solutions for the connectivity to core servers hosted on-premises through Google Cloud Platform advanced networking & Load balancing capabilities CDN Enablement: Looking to migrate existing CDN servers to GCP to eliminate the dependency from on-premise host and have a robust infrastructure on cloud using serverless solutions WAF: DMart is looking for WAF solutions for mitigating DDoS attacks on their workloads",
		solution:
			"Deployed the DMart core frontend API services on Google Compute Engine with Managed Instance Group that can scale seamlessly as per the increase/decrease in demand with minimal operational overhead Migrated their dockerized applications to serverless Cloud Run which helped to reduce the VM management overhead Migrated their CDN servers to GCP by moving the content to GCS Buckets enabled by Cloud CDN for low latency content serving Implemented Cloud Armor security policies for providing WAF.",
		impact: "Better manageability and lower operational overheads by moving serverless solutions and system automation Cloud Spend decreased by 15% overall as compared to DC spend Strong security posture by adopting latest frameworks to adopt cloud R,C, & E I Infra Mod Non-",
		metricHeadline:
			"Better manageability and lower operational overheads by moving serverless solutions and system automation Cloud Spend…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-saving-costs-scaling-better-for-online-retail",
		client: "Saving Costs & Scaling Better for Online Retail",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Saving Costs & Scaling Better for Online Retail",
		summary:
			"AWS to GCP Migration by hosting microservices on GKE and DWH on BQ. Saved costs and improved scalability",
		businessContext:
			"AWS to GCP Migration by hosting microservices on GKE and DWH on BQ. Saved costs and improved scalability",
		solution:
			"Exorbitant cloud spend with AWS Unable to scale at the desired rate with the current platform Deployed microservices architecture on GKE Configured CI/CD using Kubernetes-Spinnaker Implemented BigQuery as a more scalable Data Warehouse",
		impact: "Cloud spend decreased by 15% overall Better manageability and lower operational overheads R,C, & E I Infra Mod",
		metricHeadline:
			"Cloud spend decreased by 15% overall Better manageability and lower operational overheads R,C, & E I Infra Mod",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-optimizing-cloud-infra-for-an-automobile-e",
		client: "Optimizing Cloud Infra for an Automobile E",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Optimizing Cloud Infra for an Automobile E-Com",
		summary:
			"Automated infra using best practices with terraform scripts and GCP tools. Improved performance, security & saved costs",
		businessContext:
			"Automated infra using best practices with terraform scripts and GCP tools. Improved performance, security & saved costs",
		solution:
			"Droom's environment was bit complex and quite unstructured while running on AWS environment. Improving existing infrastructure deployment approach by using Terraform (IaC) Improving application performance and content delivery Use of Terraform to automate resource creation in GCP as per Industry Best Practices Strong security posture by connecting servers using Identity Aware Proxy (IAP). Implemented Load Balancer to distribute traffic effectively SSL authentication through LB (Automated Renewal and Management) Migrating existing AWS EC2 setup to GCP using Migrate for compute service",
		impact: "Helped improve the performance of the Droom app & Website with successful migration of Infra to GCP Significantly reduced spending with improved performance R,C, & E I Infra Mod",
		metricHeadline:
			"Helped improve the performance of the Droom app & Website with successful migration of Infra to GCP Significantly reduced…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-vms-to-kubernetes-for-a-leading-ci-platform",
		client: "VMs to Kubernetes for a Leading CI Platform",
		region: "AMER",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "VMs to Kubernetes for a Leading CI Platform",
		summary:
			"Went from VM based architecture to container based on GKE. Implemented CI/CD. Reduced costs, improved performance",
		businessContext:
			"Went from VM based architecture to container based on GKE. Implemented CI/CD. Reduced costs, improved performance",
		solution:
			"Incurring high cost on AWS infrastructure. Application management was not straightforward. Multiple applications deployed on varying services, but all on EC2 instances. High operational overhead for maintaining the environment. Recommended modernising infrastructure to adopt container native approach with GKE Migrated high operational workload of Ceph Storage to GKE under Rook operator to reduce operational overhead. Implemented CI/CD pipelines for all applications to reduce deployment efforts Migrated Spark workload to Dataproc, and leveraged autoscaling via PVM to control costs",
		impact: "Reduction in cost compared to AWS counterpart Faster build and deploy time for all applications Simpler management of Ceph Storage under Rook operator on GKE Cost effective scaling of Spark workload depending on the load present R,C, & E I Infra Mod",
		metricHeadline:
			"Reduction in cost compared to AWS counterpart Faster build and deploy time for all applications Simpler management of Ceph…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-scalability-and-security-for-high-volume-e",
		client: "Scalability and Security for High Volume E",
		region: "AMER",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Scalability and Security for High Volume E-Com",
		summary:
			"Leverage GKE, CloudSQL, CloudBuild for managed & scalable infra and secure site from attackers using Cloud Armor",
		businessContext:
			"Leverage GKE, CloudSQL, CloudBuild for managed & scalable infra and secure site from attackers using Cloud Armor",
		solution:
			"Dockerize and host the Magento E-commerce store application code into Google Kubernetes Engine. Handling millions of requests of sellers and buyers on the website Security enhancement as its E-commerce website. Scaling the application as per increased user load on the website Deployed GKE to host the main website application and auto scaling is enabled on both node and pod level Cloud Armor policy implemented to protect website from attackers Cloud SQL, Filestore and Memorystore (redis) are used as storage Cloud build used for CI-CD based deployment of Application",
		impact: "High Availability of the website to users spread across globe Low latency product upload to website for sellers Secure website from online attackers R,C, & E I Infra Mod",
		metricHeadline:
			"High Availability of the website to users spread across globe Low latency product upload to website for sellers Secure website…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-moladin-to-setup",
		client: "Moladin to setup",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to GCP Migration Support",
		summary:
			"Searce assisted Moladin to migrate their existing workloads from AWS to GCP in 1 month timeline",
		businessContext:
			"Moladin need to migrates all their workloads (3 environments, 20 VPC, 40 Load Balancers, 20 Kubernetes Clusters, 710 microservices, 52 DB instances, 46 S3 Buckets) from AWS to GCP. Moladin has their own Data Team which is eager to learn about BigQuery and how to optimize it in practice.",
		solution:
			"Searce conducted a Technical Onboarding Center (ToC) for Moladin Engineering Team on GCP foundation best practices and use cases. Searce created Terraform scripts for Organization Policies and Cloud Armor Policies deployment. Searce assisted Moladin to setup Cloud Logging and Cloud Monitoring. Searce assisted Moladin by creating a script template to migrate AWS S3 bucket to GCS (Google Cloud Storage). Searce conducted BigQuery workshop for Moladin Data Team.",
		impact: "Platform GCP Terraform Cloud Armor R,C, & E I Infra Mod Tech Stack Cloud Logging Cloud Storage BigQuery Monitoring Transfer Service Non-",
		metricHeadline:
			"Platform GCP Terraform Cloud Armor R,C, & E I Infra Mod Tech Stack Cloud Logging Cloud Storage BigQuery Monitoring Transfer…",
		techStack: "Cloud Logging, BigQuery, Service",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-bailey-nelson",
		client: "Bailey Nelson",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Data Warehouse & Data led Insights on BigQuery",
		summary:
			"Consolidating multi-channel advertising and ecommerce data into a centralized repository.",
		businessContext:
			"Bailey Nelson had a roadmap for developing intuitive Looker dashboards with specific business based KPIs. Centralised data platform for business reporting based on diverse data sources on AWS, Google Ads & Facebook Ads, etc. Build modernized and cost effective data warehouse on Google Cloud Platform.",
		solution:
			"Migrated 800GB of data from Amazon S3 buckets to 20+ tables in BigQuery using BQ data transfer service. Integrated Google and Facebook Ads to BigQuery using BQ data transfer service and sync the data in the desired frequency. Integrated Looker with BigQuery and built insightful visualizations on the dashboard for the business KPIs as requested.",
		impact: "Bailey Nelson was able to identify customers who use to browse there website & this resulted in turning them into Buying customers. Few key insights on: Marketing Campaign, ROI and there brand awareness. Demographics analysis of the Bailey Nelson stores so as to understand in-store performance.",
		metricHeadline:
			"Bailey Nelson was able to identify customers who use to browse there website & this resulted in turning them into Buying…",
		techStack: "BigQuery, Cloud Functions, Looker, Amazon S3",
		cloudProvider: "multicloud",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-bizzy-2",
		client: "Bizzy",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Building an Enterprise Data lake for Bizzy",
		summary: "Centralized enterprise data lake solution for behavioral analytics.",
		businessContext:
			"Want to offer customer insights gathered from sales patterns and consumption trends to uncover potential sales opportunities. Existing data infrastructure could not cope with the growing demands and fast-paced nature of the business. Unable to get real-time view on product movement and sales.",
		solution:
			"Built an Enterprise Data Lake which had a central repository of data identified from multiple sources in its raw format. Migrate legacy systems and build automated data pipelines to store customer data. Performs batch and real time analytics, predictive and prescriptive analytics.",
		impact: "Increased speed of data streaming by 25%. Improved business decision-making with data-driven insights. Higher speed to market.",
		metricHeadline: "Increased speed of data streaming by 25%.",
		techStack: "Enterprise Data Lake framework",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-e-commerce-retailer",
		client: "E-commerce retailer",
		region: "India",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Data Lake and Recommendation Engine",
		summary:
			"Data Lake Solution and Recommendations Engine for Actionable, Real-time Insights Into Customer's Behavior",
		businessContext:
			"Data sources are ClickStream data, Relational Data and Log data in the infrastructure on which they wanted to implement a data lake and recommendation engine. Enhance its BI capabilities, For cost-effectiveness and scalability on the way to store and analyze its data. Leading to move its analytical data to the cloud for easier scalability Perform ETL on all their unstructured and semi-structured data Implement a recommendation engine that would help the customers/visitors to make a better decision while purchasing",
		solution:
			"Built a Data Lake that collected real-time data from the existing data sources and used AWS Glue which performed ETL on the collected data Trained the transformed data using Sagemaker which provided recommendations to the customer as per the browsing and purchasing history",
		impact: "Created a central repository for all of the data sources The recommendation engine presented users with choices regarding items from their list of available items. It lead to greater customer satisfaction, higher retention of existing customers, and lower advertising costs. R, C, & E | Data & Analytics",
		metricHeadline:
			"Created a central repository for all of the data sources The recommendation engine presented users with choices regarding…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-floweraura",
		client: "Floweraura",
		region: "India",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Centralized Data Warehouse and Reporting",
		summary: "Built Data Warehouse and generate real-time insights using Quicksight.",
		businessContext:
			"Real-time Clickstream data into Redshift after performing multiple transformations and filtering. Floweraura team did not have real-time replication and analytics. Google Analytics data shows ad-cost analysis on day basis, capture hourly ad-cost data Inability to get insights from the data that was being captured through various sources.",
		solution:
			"Built AWS Kinesis Firehose to get data from DynamoDB into Redshift so that the data can be merged with other data sources and generate actionable insights. Implemented AWS DMS for CDC replication for the near real-time reporting. To understand the ad cost to acquire a customer, developed python scripts to capture hourly ad cost data and insert into Redshift Data models and 10 dashboards in Quicksight to enable near real-time data and analytics",
		impact: "Better decision making and real-time insights based on the reports in QuickSight. Centralized data warehouse and reporting framework in Redshift where various data sources were merged. Redshift clusters offer flexibility and scalability as required depending on the peak and slack business periods.. R, C, & E | Data & Analytics",
		metricHeadline:
			"Better decision making and real-time insights based on the reports in QuickSight.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-food-ordering-app",
		client: "Food Ordering App",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Faster Analytics with BQ for Food Ordering App",
		summary:
			"Ingesting high-velocity food delivery metrics into a scalable serverless data warehouse.",
		businessContext:
			"The reporting was happening through RDS, which was not really meant for analytical reporting purpose. Needed a data warehouse which could properly scale and the query execution time should be as low as possible.",
		solution:
			"Set Up near real time replication for the RDS data to BigQuery. Enabling BigQuery for reporting and other analytical requirements. Reconfiguring of some of the existing BI queries to reduce the execution time.",
		impact: "The BI reports could fetch data coming in realtime from delivery centers now. The query execution time was reduced to 5s.",
		metricHeadline: "The query execution time was reduced to 5s.",
		techStack: "BigQuery, Amazon RDS",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-analytics-platform",
		client: "Analytics Platform",
		region: "AMER",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "High Volume Data Streaming for Analytics Platform",
		summary:
			"Deploying a real-time streaming pipeline to process 1 billion user click events daily.",
		businessContext:
			"On peak times, processing approx. 1 billion Kafka messages on AWS. Expected latency for streaming jobs to fetch data and write to ceph was 60 sec. Click events stored on Kafka from various JS code and consumed by the Spark Streaming jobs. Spark streaming jobs fetch data from Kafka and writes data to Ceph.",
		solution:
			"Deployed Spark Streaming jobs on Dataproc. Deployed CMAK(Kafka manager) for monitoring lag and data replication. Ceph migration from EC2 to GKE using rook operators. MySQL continuous replication from AWS RDS to GCP Cloud SQL. Optimized Dataproc clusters to have balanced on-demand and preemptible instances to save cost. Developed automation script to scale-up & scale-down Dataproc cluster based on Kafka backlog. Slack integration to start/terminate Dataproc, add/remove nodes in clusters etc. Implementing CI/CD for the spark streaming job using Cloud Build (Building the code and creating the Jars pushing the Jars to GCS, Submit the job using Dataproc Jobs).",
		impact: "Optimising Dataproc clusters to have balanced on-demand and preemptible instances to save cost. Developed automation script to scale-up & scale-down Dataproc cluster based on Kafka backlog. Slack integration to start/terminate Dataproc, add/remove nodes in clusters etc. Implementing CI/CD for the spark streaming job using Cloud Build.",
		metricHeadline:
			"Optimising Dataproc clusters to have balanced on-demand and preemptible instances to save cost.",
		techStack: "Dataproc, GKE, Rook Operator, Kafka, Cloud Build, Cloud SQL, Ceph Storage",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-google-cloud-product-genius",
		client: "Google Cloud Product Genius",
		region: "AMER",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Google Cloud Services Implementation",
		summary: "Provided consultation on infra and Data services offered in Google Cloud",
		businessContext:
			"Product Genius is an Ecormarce based organization which sells the product online to their US and Asia based customers, which currently operates on AWS Cloud. The product genius team was looking for a successful Google Cloud implementation of their new application end-to-end. In cooperation with the Client, Searce will provide the following services.",
		solution:
			"Implementing the designed solution to migrate the current non-prod environment and its related resources from AWS to Google Cloud as a part of future roadmap. As a part of the designed solution, Searce Team assisted Product Genius Team on security and operational best practices to be met on Google Cloud. Searce Team assisted Product Genius Team with IaC standards using Terraform for infra deployments",
		impact: "Product Genius Team benefited from a secure, scalable Google Cloud infrastructure deployed as per best practices, enabling a reliable foundation. Product Genius Team's deployments were automated via Terraform, reducing manual effort and accelerating the development lifecycle. Product Genius Team leveraged a CI/CD pipeline with GitHub Actions and ArgoCD, for seamless and efficient application delivery. Retail, CPG & E-commerce | Cloud Modernization",
		metricHeadline:
			"Product Genius Team benefited from a secure, scalable Google Cloud infrastructure deployed as per best practices, enabling a…",
		techStack: "Compute Kubernetes Cloud Engine Engine Armor, Cloud CDN, Cloud VPN",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-moglix-2",
		client: "Moglix",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "DR Setup in AWS Environment",
		summary: "Containerizing monolithic application to microservices on Amazon EKS for DR.",
		businessContext:
			"Moglix’s monolithic application struggled with scalability and slow deployment cycles. High operational overhead due to tightly coupled architecture. ELK stack for logging was running on EC2 instances, causing maintenance challenges. Searce modernized the app by moving to microservices on Amazon EKS.",
		solution:
			"Transformed Moglix’s monolithic application into containerized microservices on Amazon EKS. Created EKS cluster using auto mode and Deploy Applications. Enhanced application availability by setting up DR. Reduced infrastructure management overhead and improved resource utilization.",
		impact: "Using AWS, the client achieved improved scalability and reliability with EKS-managed microservices. S3 provided durable, cost-effective storage, while RDS ensured high-performance, managed databases. CloudWatch and ELK enhanced monitoring and troubleshooting. Overall, AWS enabled faster deployments, reduced operational overhead, and optimized costs through autoscaling and resource management.",
		metricHeadline:
			"S3 provided durable, cost-effective storage, while RDS ensured high-performance, managed databases.",
		techStack: "Elastic Kubernetes Service, EC2, RDS, Simple Storage Service, IAM, ELK Stack",
		cloudProvider: "aws",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-better-scaling-for-e",
		client: "Better Scaling for E",
		region: "AMER",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Better Scaling for E-Com Management Client",
		summary:
			"Containerizing monolithic app and leveraging managed DB and automated CI/CD for better scalability and cost savings",
		businessContext:
			"Running RoR applications on over provisioned VMs PostgreSQL database reaching limitation in terms of resources (CPU & Memory) No scaling for application under any kind of load",
		solution:
			"Recommended containerizing applications (singular Ruby processes) instead of deploying them as a monolith on an over provisioned VM Migrate database to CloudSQL PostgreSQL to support the increased demand for resources Implemented preemptible node pools for multiple applications to save cost and support on scaling Created an automated CI/CD pipeline for all containerized applications",
		impact: "Reduced cost upto 20% with right sized containers and preemptible node pools Faster time to deployment Scaling and deployment for individual applications instead of monolith R,C, & E I Infra Mod",
		metricHeadline:
			"Reduced cost upto 20% with right sized containers and preemptible node pools Faster time to deployment Scaling and deployment…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-moglix-3",
		client: "Moglix",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Modernizing Monolith Apps to Microservices",
		summary: "Monolith modernization to EKS microservices with Karpenter autoscaling.",
		businessContext:
			"Moglix’s monolithic application struggled with scalability and slow deployment cycles. High operational overhead due to tightly coupled architecture. ELK stack for logging was running on EC2 instances, causing maintenance challenges.",
		solution:
			"Transformed Moglix’s monolithic application into containerized microservices on Amazon EKS. Implemented Karpenter to enable dynamic and efficient auto-scaling based on workload demand. Containerized the existing ELK stack for improved logging, monitoring, and easier maintenance. Enhanced application scalability, performance, and operational efficiency.",
		impact: "Using AWS, the client achieved improved scalability and reliability with EKS-managed microservices. S3 provided durable, cost-effective storage, while RDS ensured high-performance, managed databases. CloudWatch and ELK enhanced monitoring and troubleshooting.",
		metricHeadline:
			"S3 provided durable, cost-effective storage, while RDS ensured high-performance, managed databases.",
		techStack:
			"Elastic Kubernetes Service, EC2, RDS, Simple Storage Service, IAM, Karpenter, ELK Stack",
		cloudProvider: "aws",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-mamearth",
		client: "Mamearth",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Modernizing Data Pipeline for E-Com Client",
		summary: "Unicommerce API custom orchestration to BQ via Cloud Composer.",
		businessContext:
			"The 3rd party tool that extracted data from various data source had limitations and didn’t provide in-depth control/customization on data-pipelines. Mamearth team wanted more control on data-pipelines and extract data from Unicommerce API and load it into BigQuery on GCP using Cloud Composer. Enable real-time analytics and decision-making on data available in BigQuery. Monitoring and Alerting for the ETL jobs.",
		solution:
			"Airflow DAGs that extracted data from Unicommerce API and loaded it to BigQuery staging tables keeping in consideration different sync frequencies and sync types (write truncate or upsert) using Cloud Composer. Stored Procedures were developed to handle the data transformations and load into BigQuery target tables. Monitoring and Alerting policies were setup in order to notify the pipeline failures.",
		impact: "More control on data-pipelines. Centralized data in Cloud. Real-time analytics and quick decision making. Optimization and operational efficiency.",
		metricHeadline: "More control on data-pipelines.",
		techStack: "Cloud Composer, BigQuery Staging/Target, Stored Procedures, Airflow",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-iprice",
		client: "iPrice",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Faster Data Processing for Shopping Aggregator",
		summary: "Leverage Dataproc + BQ for data faster data processing, reducing time to half",
		businessContext:
			"Price used the data from Google Merchant Center and pushed it to AWS for churning and generating pipeline. This resulted in slow processing layer and additional egress cost.",
		solution:
			"Searce was able to showcase performance benefits of running the data pipeline on BigQuery + Dataproc set-up. Searce helped deploy their existing data sources on GCP and optimize their transformation scripts to process the same using Dataproc and BigQuery.",
		impact: "Searce helped iPrice reduce the Data processing time from 3 hours to 1.5 hours This resulted in faster generation of offers on their website R, C, & E | Data & Analytics",
		metricHeadline:
			"Searce helped iPrice reduce the Data processing time from 3 hours to 1.5 hours This resulted in faster generation of offers on…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-floweraura-2",
		client: "Floweraura",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Data led Decision Making for Retail Startup",
		summary:
			"Centralization of real-time clickstream and transactional tables into an analytical warehouse.",
		businessContext:
			"Inability to get insights from the data that was being captured through various sources. Floweraura team did not have real-time replication and analytics. Google Analytics data shows ad-cost analysis on day basis, capture hourly ad-cost data.",
		solution:
			"Built AWS Kinesis Firehose to get data from DynamoDB into Redshift so that the data can be merged with other data sources and generate actionable insights. Implemented AWS DMS for CDC replication for the near real-time reporting. To understand the ad cost to acquire a customer, developed python scripts to capture hourly ad cost data and insert into Redshift. Data models and 10 dashboards in Quicksight to enable near real-time data and analytics.",
		impact: "Better decision making and real-time insights based on the reports in QuickSight. Centralized data warehouse and reporting framework in Redshift where various data sources were merged. Redshift clusters offer flexibility and scalability as required depending on the peak and slack business periods.",
		metricHeadline:
			"Better decision making and real-time insights based on the reports in QuickSight.",
		techStack: "Redshift, Quicksight, DynamoDb, AWS Glue/Kinesis, Sagemaker, AWS S3, Python",
		cloudProvider: "aws",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-there",
		client: "There",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Modern Data Warehouse on Google Cloud",
		summary:
			"Searce team built a centralized Google Cloud BigQuery data warehouse for eXtra, migrating siloed data from Oracle systems and cloud apps to enhance analytics. Middle East",
		businessContext:
			"eXtra team operated with siloed data across multiple systems (Oracle RMS, Siebel CRM, POS, DWH, and cloud apps). This fragmentation caused limited data integration and delayed actionable insights. There was no unified cloud-based platform to support advanced analytics, centralized governance or their rapidly expanding business requirements",
		solution:
			"Searce team deployed a secure Google Cloud Landing Zone and a centralized BigQuery Data Warehouse, utilizing Datastream and Dataflow to unify historical and incremental data from Oracle RMS, Siebel, POS, diverse APIs, and CSVs. This architecture automated complex ingestion processes via Cloud Functions and Workflows, ensuring a consistent and robust pipeline for enterprise analytics.",
		impact: "The solution dismantled silos by consolidating multi datasets (over 350 tables) into a single BigQuery Data Warehouse. This highly available architecture provided eXtra team with accelerated analytics, automated ingestion, centralized governance using Dataplex and a robust foundation for modern data-driven decision-making and operational efficiency. Cloud Build Cloud Dataflow Datastream BigQuery Storage Consumer Electronics Retail | Practice SBU - To be Discarded",
		metricHeadline:
			"The solution dismantled silos by consolidating multi datasets (over 350 tables) into a single BigQuery Data Warehouse.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-implementation-and-deployment-of-the-search-api",
		client: "implementation and deployment of the Search API",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "implementation and deployment of the Search API",
		summary: "Swimply Increases User Satisfaction By 90% with Searce's GenAI-Powered Search",
		businessContext:
			"Swimply's keyword-based search struggled to understand user intent, especially regarding visual aspects This led to a poor user experience and missed booking opportunities",
		solution:
			"Converted property data and images provided into a unified textual and visual representation using Vertex Embeddings API, enriching search experience Retrieved the most relevant listings using Vertex Vector Search Ensured scalability through Cloud Run and integration to existing systems via a user-friendly REST API",
		impact: "GenAI-powered search engine cut search response times in half from 300 ms to 150 ms Advanced filtering results, ranking properties based on user preferences. This translated to a 250% increase in booking conversions, from 10% to 35% Increased user satisfaction by 90%",
		metricHeadline:
			"GenAI-powered search engine cut search response times in half from 300 ms to 150 ms Advanced filtering results, ranking…",
		techStack: "Vertex AI, Cloud Storage, Cloud Run",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-flipkart",
		client: "Flipkart",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Speech to text solution leveraging Gemini",
		summary: "Building an in-house multilingual Speech-to-Text engine using Gemini Flash.",
		businessContext:
			"Flipkart needed a robust, self-owned Speech-to-Text (STT) solution to replace their third-party vendor, Convin. The goal was to process customer support calls for their Incident Management System (IMS) with high accuracy across English and 7 Indian languages, while reducing costs and enabling advanced analytics like anxiety scoring.",
		solution:
			"We developed a highly scalable, containerized STT service using Java (Dropwizard) and Google's Gemini models (Flash 2.0/2.5). The solution features a smart Silence Removal preprocessing pipeline to reduce costs and errors. It integrates seamlessly with Flipkart's IMS via a robust Primary + Fallback model strategy ensuring high availability and accuracy for 7+ languages.",
		impact: "We successfully replaced the external vendor solution with a cost-efficient, in-house STT engine. The solution achieved ~93% transcription confidence across 7 languages and reduced operational costs by 28% through intelligent token optimization. It enabled new capabilities like Anxiety Scoring (96% confidence) to improve customer service insights.",
		metricHeadline:
			"The solution achieved ~93% transcription confidence across 7 languages and reduced operational costs by 28% through…",
		techStack: "Kubernetes Engine, Cloud Storage, Data Loss Prevention API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-integration-with-bigquery",
		client: "Integration with BigQuery",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Generative AI",
		summary: "Developed an image extraction using Gemini 1.5 Pro",
		businessContext:
			"Manual extraction of product and price tags data from image is error-prone. Automating using Gemini 1.5 Pro with image processing enhances accuracy and operational efficiency. Integration with BigQuery provides scalable, insightful data management solutions. infilect.com APAC",
		solution:
			"Images are processed with sharpening techniques to enhance clarity. A coordinate JSON file guides the extraction of relevant image regions. Cropped images are arranged in a matrix fashion and labeled sequentially. The matrix image is analyzed by Gemini 1.5 Pro for information extraction. Extracted data is mapped with key of labeled crops and stored in BigQuery.",
		impact: "Reduces inaccuracies in product and pricing data extraction, ensuring reliable information. Automates data processing, cutting down the time required significantly. Provides a reusable solution for diverse image data extraction needs, with easy customization. Retail | Applied AI",
		metricHeadline:
			"Reduces inaccuracies in product and pricing data extraction, ensuring reliable information.",
		techStack: "Cloud Run, Vertex AI, BigQuery",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-object-detection-segmentation",
		client: "Object detection & segmentation",
		region: "AMER",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Object detection & segmentation",
		summary:
			"Developed a custom model to segment object & background to perform transformations such as scaling, centralization & resizing",
		businessContext:
			"Verishop receives multiple product images from different vendors which does not adhere to Verishop standards and acceptance criteria. They were using Pixelz to treat the images. Pixelz uses mix of ML models and manual work for transformations including scaling, background removal, centralization. The semi-manual process takes around 18 hours to process 2000 images and costs them around $4000.",
		solution:
			"Built a fully autonomous ML model to segment object and background, targeting to completely avoid manual work. Wrote intelligent logics to centralize the object, perform boundary elimination to rescale the image, preserving the original aspect ratio of the object, apply shadow with customizations, apply custom background. Deployed a scalable service on Cloud Run which takes the image batch and applies all the transformations.",
		impact: "High scalability and reduction of manual work. Low Latency. Time taken to process a batch of 10000 images is in the range of 10-20 minutes. Usage cost reduced by 95%. Vertex AI Cloud SQL R, C, & E | Applied AI Cloud Run Cloud Functions",
		metricHeadline:
			"Time taken to process a batch of 10000 images is in the range of 10-20 minutes.",
		techStack:
			"Deployed a scalable service on Cloud Run which takes the image batch and applies all the transformations.",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-detecting-packages-of-food-in-refrigerators",
		client: "Detecting packages of food in refrigerators",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Detecting packages of food in refrigerators",
		summary:
			"Developed a object detection model to classify food packages stored in refrigerators",
		businessContext:
			"Client wants to build an object detection model using GCP's AUTO ML for detecting and classifying custom food packages stored in their refrigerators.",
		solution:
			"Converting the annotations in required format for AUTO ML and trained a model on 24 food categories. Deployment of the model and a bucket trigger via cloud function to store the response as json in GCS.",
		impact: "An automated pipeline to get predictions as batches. Scalable system to integrate more categories. Cloud Functions AutoML R, C, & E | Applied AI Non -",
		metricHeadline: "An automated pipeline to get predictions as batches.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-udaan-s-objective",
		client: "Udaan's objective",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Agent behaviour analysis",
		summary:
			"Perform customer and agent sentiment analysis along with issue type tagging using AutoML NLP to improve customer experience",
		businessContext:
			"Udaan's objective is to improve customer support helpdesk performance - Agent Behavioral Analysis- Identifying misbehaviour on the part of the agent Issue Type Tagging- Checking whether the issue was tagged correctly by the agent Customer and Agent Satisfaction: Understanding if the customer was happy/ unhappy/ neutral about the interaction ((last 50% of call)",
		solution:
			"Analysing the agent's behavior during calls includes identifying and quantifying - Dead air time (start and end timestamp) Slow speech (sentence level - channel wise) Profanity (>1 - red flag for both agent and customer) Use of empathy words (check for empathy words used by agents only when there's a negative sentiment from customer side) Interjections when the agent is interrupting customer (start and end timestamp)",
		impact: "Successfully transcribed recordings using Google SST & analysed them using AutoML NLP to detect the profanity, empathy words, dead-air, speech rate of agents as well as customer and agent sentiment analysis. R, C, & E | Applied AI Non -",
		metricHeadline:
			"Successfully transcribed recordings using Google SST & analysed them using AutoML NLP to detect the profanity, empathy words,…",
		techStack: "Cloud Natural Language API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-optimizing-delivery-for-online-grocery-app",
		client: "Optimizing Delivery for Online Grocery App",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Optimizing Delivery for Online Grocery App",
		summary:
			"Use GMP to accurately identify provider's location and accurately forecast optimized delivery time",
		businessContext:
			"Required data-rich, accurate mapping technology and scalable visualization platform Identify potential grocery provider's location to optimize the delivery & batching algorithm Reduce in-accuracy of forecast time to save overall delivery cost",
		solution:
			"Assisted with utilizing sub-localities for accurate identification of nearby available grocery marts Consulted on the APIs to be used across their mobile applications and websites Helped optimize the usage on Google Maps Platform",
		impact: "Customers can accurately pinpoint their location in a map through functionality made available through the Places API and Geocoding API, in conjunction with the JavaScript API. Drivers use the Directions API to identify the quickest route to customers.",
		metricHeadline:
			"Customers can accurately pinpoint their location in a map through functionality made available through the Places API and…",
		techStack: "Directions API Geocoding API Roads API Autocomplete API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-optimizing-grocery-delivery-for-fresh-vnf",
		client: "Optimizing Grocery Delivery for Fresh VNF",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Optimizing Grocery Delivery for Fresh VNF",
		summary: "Use GMP to accurately calculate travel distance and manage delivery",
		businessContext:
			"Effectively manage the delivery of veggies , fruits, herbs , dairy products , etc. To calculate distance between shoppers and warehouse.",
		solution:
			"Assisted in devising a solution with a combination of multiple APIs wherein they were able to effectively conduct business and visualise locations on the maps, thus making deliveries smoother",
		impact: "Faster and smoother deliveries Better visualization R, C, & E | Location Intelligence",
		metricHeadline:
			"Faster and smoother deliveries Better visualization R, C, & E | Location Intelligence",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-accurate-location-finding-for-electronics-giant",
		client: "Accurate Location Finding for Electronics Giant",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Accurate Location Finding for Electronics Giant",
		summary:
			"Use GMP to accurately pinpoint customer location, find nearby stores and book orders",
		businessContext:
			"Required data-rich, accurate mapping technology and scalable visualization platform for a e-commerce portal Help customers identify nearby stores to their location and display the inventory available in that stores. Place orders via portal after identifying the nearby stores.",
		solution:
			"Assisted with identifying customer addresses using Places autocomplete API can Geocoding API Helped optimize the usage on Google Maps Platform by suggesting correct APIs for their use-cases Suggested UI/UX changes to get the best of Google Maps Platform",
		impact: "Customers can accurately pinpoint their location in a map through functionality made available through the Places API and Geocoding API, in conjunction with the JavaScript API to find nearby stores UI changes lead to reduction in Geocoding API requests by 20%",
		metricHeadline:
			"Customers can accurately pinpoint their location in a map through functionality made available through the Places API and…",
		techStack: "Directions API Geocoding API Places API Distance matrix API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-enhancement-and-support-for-applications",
		client: "Enhancement and Support for Applications",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "devops_platform_engineering",
		practiceLabel: "Software Engineering",
		title: "Enhancement and Support for Applications",
		summary: "Titan Esparsh support and enhancement",
		businessContext: "Enhancement items Reachout module Support user queries and bug fixing",
		solution:
			"Computation breakup module enhancement done Entire reachout module converted from app script to esparsh app Enhancement items fixes Reduced manual interventions over the application",
		impact: "Automated scripts to take care of manual workaround Reduced the support tickets from end Users through enhancements R, C, & E | Software Engineering",
		metricHeadline:
			"Automated scripts to take care of manual workaround Reduced the support tickets from end Users through enhancements R, C, & E…",
		techStack: "JavaScript",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-migration-of-aws-infra-workload-to-gcp",
		client: "Migration of AWS infra & workload to GCP",
		region: "AMER",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Migration of AWS infra & workload to GCP",
		summary:
			"Deployment to depict the AWS infra setup to GCP.deploy the apps using GCE,NEGs and Load Balancers. PostgreSQL and MySQL DB from EC2 to GCE on GCP.",
		businessContext:
			"Automate Infrastructure deployment for multiple environments Migration of AWS databases to GCP PostgreSQL and MySQL Setting up NEGs for multiple groups of GCE VMs Exploring connectivity cross projects through VPC peering",
		solution:
			"Authored and deployed the infrastructure using terraform scripts Restoring AWS database dumps to GCP PostgreSQL/MySQL and setting replication Setting up Load Balancer multiple multiple host based routing to backend NEGs",
		impact: "Infrastructure deployment of multiple environments using the Infrastructure as a Code tool (IaC) Terraform aids in faster deployment, reducing manual intervention and reducing the margin of error for deploying the infrastructure Taking the backup of streaming replication from the AWS source side using PG_base backup to perform cross-platform data replication with ease in switch during cutover",
		metricHeadline:
			"Infrastructure deployment of multiple environments using the Infrastructure as a Code tool (IaC) Terraform aids in faster…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-tendable",
		client: "Tendable",
		region: "EMEA",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Infrastructure Modernization on Google Cloud",
		summary: "AWS to GCP migration for 7 distinct app environments.",
		businessContext:
			"Searce worked to migrate Tendable’s existing AWS workload onto Google Cloud. Searce worked to improve the efficiency of their processes.",
		solution:
			"Successfully built and deployed google infrastructure for staging, performance and shared services as well as prod environments across 4 regions. Successfully optimised build and deployment features using Google Cloud services. Successfully completed migration of all applications and services from AWS to Google Cloud.",
		impact: "Successfully reduced build time of new releases by almost 77%. Reduced DB sizes by ~70% by defragmenting the databases. Provided the client with Google infrastructure; Cloud Run, Cloud Armor, SCC, and other services; application migration for 7 different environments as per best practices; and helped optimize their existing processes.",
		metricHeadline: "Successfully reduced build time of new releases by almost 77%.",
		techStack:
			"Compute Engine, Cloud Storage, IAM, Cloud Run, Cloud Build, Security Command Center",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-amwell",
		client: "Amwell",
		region: "AMER",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to Google Cloud migration | AI POC's | UI/UX Audit",
		summary: "SilverCloud platform AWS to GCP multi-cloud migration with Vertex AI search.",
		businessContext:
			"Amwell wanted to achieve a multi-cloud environment and evaluate AI/ML technologies. Amwell wanted to improve patient retention and engagement rates. To enhance coach efficiency and provide patient personalization. To enhance platform navigation and design for AI integrations.",
		solution:
			"Conducted an AWS to Google Cloud migration for Amwell. Implemented an AI onboarding assistant and introduced a vertex AI based contextual search for the patients. Built a Coach prompting tool which will suggest and recommend modules to Coach. Searce did an exhaustive UI/UX audit.",
		impact: "Accelerated cloud migration, enabling faster validation cycles and smoother production readiness. Maintained infrastructure consistency by extending Terraform with a familiar code structure for client integration. Enhanced user experience with AI-powered conversational and search features. Strengthened client confidence via proactive support, thorough documentation, and cost-effective modernization.",
		metricHeadline:
			"Accelerated cloud migration, enabling faster validation cycles and smoother production readiness.",
		techStack:
			"Kubernetes Engine, Secret Manager, Memory store, Logging, Monitoring, Vertex AI",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-quadrivia",
		client: "Quadrivia",
		region: "EMEA",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to Google Cloud Migration & CI/CD Modernization",
		summary: "GKE migration and GitOps argoCD setup for clinical AI assistant.",
		businessContext:
			"Quadrivia's AI-powered clinical assistant, Qu, addresses the global healthcare professional shortage by improving care quality and accessibility. The AWS to Google Cloud migration project aims to provide a secure, highly available cloud infrastructure with lower latencies to support these critical operations.",
		solution:
			"Transformed infrastructure using Terraform and OPA for policy validation. Migrated workloads to GKE for improved scalability, simplifying secrets with Google Secret Manager instead of Vault. Deployed services using Helm and ArgoCD for GitOps. Ensured security with Cloud Armor and Security Command Center Enterprise, and utilized CloudSQL for managed databases.",
		impact: "The Google Cloud platform provided Quadrivia a secure, highly available, disaster-resilient foundation for its AI clinical assistant. It enabled modernized CI/CD (GitOps) and enhanced security post-AWS migration.",
		metricHeadline:
			"The Google Cloud platform provided Quadrivia a secure, highly available, disaster-resilient foundation for its AI clinical…",
		techStack:
			"Compute Engine, Kubernetes Engine, Cloud NAT, Cloud Routers, Cloud Storage, Cloud Armor, Secret Manager, Helm, ArgoCD, Cloud SQL, Terraform",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-azure-to-google-cloud",
		client: "Azure to Google Cloud",
		region: "AMER",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Azure to Google Cloud - 2 projects",
		summary:
			"Implementation of CI/CD for both Internal and External projects will be handled using Cloud Build",
		businessContext:
			"Move away from Azure to Google Cloud best practices Connectivity across the infrastructure with security measures Deployment scripts for Terraform are in place for repetitive deployments for setting up multiple environments",
		solution:
			"Establish a Google Cloud Foundation Landing Zone Migrate the setup, consisting of 2 different projects Connectivity across the infrastructure with security measures Terraform will be used for IaC to create scripts for repetitive deployments to set up multiple environments",
		impact: "Competitive pricing and flexible billing options Confidentiality, integrity, and availability of sensitive data Low-latency delivery of videos to users worldwide. This results in faster video loading times and smoother playback experiences compared to Azure",
		metricHeadline:
			"Competitive pricing and flexible billing options Confidentiality, integrity, and availability of sensitive data Low-latency…",
		techStack: "Cloud Storage, Kubernetes Engine, Cloud Armor",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-health-assure",
		client: "Health Assure",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS Migration and Re-architecture for Scalability",
		summary: "DC (Yotta) to AWS multi-AZ migration and CI/CD setup.",
		businessContext:
			"Health assure had multiple issues with the application availability and user retention due to unavailability on the Yotta Data center. Health assure wanted a cost effective and stable cloud environment to migrate their windows and linux workloads.",
		solution:
			"Searce team setup Landing Zone architecture and separated all of their applications into accounts for security. Implemented security features like AWS WAF, Network Firewall, KMS, ACM, Guard Duty, Security Hub. Created the layer wise architecture for security and High Availability(3-tier). Deployed resources in Multi-AZ. Used Auto scaling for cost efficiency for workloads and Fault Tolerance environment.",
		impact: "With AWS Landing Zone architecture, Health Assure workloads are secured and isolated. The migration from Yotta DC to AWS provided Health Assure with a scalable, efficient, and cost-effective solution. Changed manual deployments to automation using CI/CD providing additional security to the application code. By leveraging CI/CD improved software development and delivery processes and collaboration.",
		metricHeadline:
			"With AWS Landing Zone architecture, Health Assure workloads are secured and isolated.",
		techStack: "EC2, Transit Gateway, Security Hub, Control Tower, AWS WAF, Network Firewall",
		cloudProvider: "aws",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-day-1-load-conditions-total-processing",
		client: "Day 1 load conditions Total Processing",
		region: "EMEA",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Setting up Scalable Infra Under Strict Timeline & COVID",
		summary:
			"Leverage GKE autoscaling to set up scalable and reliable managed infra for millions of daily unique visitors during Covid",
		businessContext:
			"Leverage GKE autoscaling to set up scalable and reliable managed infra for millions of daily unique visitors during Covid",
		solution:
			"Build a platform for Covid-19 Antigen E-Commerce site with anticipated Day 1 traffic of 4mn unique visitors Aggressive timelines driven by urgency of the ongoing pandemic Deployed mission critical application on GKE to leverage it's autoscaling capabilities without management overhead Application layer communicates with the Cloud SQL & Memorystore( caching layer) in the backend Implemented scaled infrastructure in 3 weeks end-to-end",
		impact: "Successful Day 1 launch with site performing without any issues under Day 1 load conditions Total Processing is now setup with scaled and optimised infrastructure to increase capacity on demand in TP and Searce now engaged with subsequent project to migrate existing Payment Gateway to GCP",
		metricHeadline:
			"Successful Day 1 launch with site performing without any issues under Day 1 load conditions Total Processing is now setup with…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-cloud-armor-customer",
		client: "Cloud Armor Customer",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Improved Security & Latency for Healthcare",
		summary:
			"Leverage GCP Networking to reduce latencies and improved security posture using Cloud Armor",
		businessContext:
			"Customer was facing latency issues while working in Azure. Client was looking for a solution which will store and retrieve files faster.. Client wanted to restrict the access of web services to limited geographic locations.",
		solution:
			"Deployed the Attunelive core frontend API services on Google Compute Engine with Unmanaged Instance Group Migrated their Azure application and Database to GCP using Google Cloud Migrate Created and integrated a filestore to store files in cloud in a secure way Implemented Cloud Armor security policies for providing regional restriction",
		impact: "Reduced cost upto 15% compared to previous cloud service Enhanced performance and latency with the help of cloud solutions Strong security posture by adopting latest frameworks to adopt cloud",
		metricHeadline:
			"Reduced cost upto 15% compared to previous cloud service Enhanced performance and latency with the help of cloud solutions…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-solving-networking-challenges-for-dental-client",
		client: "Solving Networking Challenges for Dental Client",
		region: "AMER",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Solving Networking Challenges for Dental Client",
		summary:
			"Leverage GCP IAM for improved role and access management, CloudVPN for connecting 20+ offices securely",
		businessContext:
			"Legacy windows workload Network security requirements Database scaling and performance challenges",
		solution:
			"Searce performed a fully managed migration that seamless converted CSG's Active Directory hierarchy to GCP's IAM. VPN connections were created between 24 different offices, creating a complex testing situation prior to launch that Searce handled. Data was easily sent to SQL instances on GCP.",
		impact: "Migration of legacy workloads to Google Cloud Platform Improved role and access management Better network security posture",
		metricHeadline:
			"Migration of legacy workloads to Google Cloud Platform Improved role and access management Better network security posture",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-marico-limited",
		client: "Marico Limited",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Creation of a landing zone,creating a VM instance",
		summary:
			"Creation of a landing of landing zone and creating a VM instance as the greenfield deployment",
		businessContext:
			"Marico Limited is an Indian multinational consumer goods company providing consumer products and services in the areas of health, beauty and wellness Marico wanted to migrate their existing services creation of landing zone and creating a VM instance as the greenfield deployment",
		solution:
			"A Landing Zone is a modular and scalable configuration that enables Marico India Ltd to adopt Google Cloud for their business needs. A Landing Zone is a prerequisite to deploying enterprise workloads in a cloud environment. Creation of a VM instance as the greenfield deployment",
		impact: "Setting up of standard building blocks that allowed users to create infrastructure and environments that are preconfigured in line with security policies, compliance guidelines and cloud native best practices",
		metricHeadline:
			"Setting up of standard building blocks that allowed users to create infrastructure and environments that are preconfigured in…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-migration-of-aws-infra-and-workload-to-gke",
		client: "Migration of AWS infra and workload to GKE",
		region: "AMER",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Migration of AWS infra and workload to GKE",
		summary:
			"Deployment to GCP as per the best practice. Implementation to deploy the app using cloud build triggers to GKE, rabbitmq cluster operator on GKE",
		businessContext:
			"Automate Infrastructure deployment for multiple environments. Shared VPC architecture DR environment setup Rabbitmq Cluster operator",
		solution:
			"Authored and deployed the infrastructure using terraform scripts. Shared VPC architecture to connect resources from multiple projects for application deployments on multiple projects. Deployed Active-Active environment requirements Setting up Rabbitmq Cluster Operator on GKE as per application requirement",
		impact: "Infrastructure deployment of multiple environments using the Infrastructure as a Code tool (IaC) Terraform aids in faster deployment, reducing manual intervention and reducing the margin of error for deploying the infrastructure Setting shared VPC for application deployment Establish Active-Active requirement deployed DR Deployment of Rabbitmq cluster on GKE cluster the application requirement",
		metricHeadline:
			"Infrastructure deployment of multiple environments using the Infrastructure as a Code tool (IaC) Terraform aids in faster…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-data-centre-exit",
		client: "Data Centre Exit",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Data Centre Exit",
		summary: "Rehost of VMware workloads to Google Cloud Platform.",
		businessContext:
			"Adheris Health, of MedAdvisor Int'l in Australia, is a U.S. based HealthTech providing patient health advice. Their THRiVTM application promotes patient adherence to prescriptions and medical advice leveraging patient analytics. The Client has two Data Center (DC) sites with VMware infrastructure hosting ~90 workloads and a SAS on Netezza analytics platform.",
		solution:
			"Deployed a Landing Zone architecture to establish strong user access controls, project isolation and workload security measures. Rehosted ~90 workloads into Google Cloud VMware Engine (GCVE) into multiple regional zones. Data transfer performed over network VPN using `Bulk' method for the majority, and `Dynamic' method for zero-downtime workloads.",
		impact: "Short term cost reduction by eliminating DC costs, avoided associated infrastructure maintenance costs and complexity. Improved resiliency and reliability by deploying into a Landing Zone framework and across multiple Google Cloud zones. Stabilised Infrastructure base to allow application-led improvements moving forward in line with innovation objectives. Non -",
		metricHeadline:
			"Short term cost reduction by eliminating DC costs, avoided associated infrastructure maintenance costs and complexity.",
		techStack: "VMware Engine",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-data-center-migration",
		client: "Data center Migration",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Data center Migration",
		summary: "Data Center Migration",
		businessContext:
			"Client has most of their workloads hosted on on-premises data centers wants to move to cloud for a better security posture, scalability, and cost optimizations",
		solution:
			"Client VMware instances will be hosted on Google Cloud VMware Engine (GCVE) The VMware infrastructure inclusive of Bare metal Hypervisor, vCenter, vSphere, will be provided as a managed offering from GCP HA will be provided using native VMware service Layer 2 Network Extension will be used to persist IP and networking components",
		impact: "security posture scalability cost optimizations",
		metricHeadline: "security posture scalability cost optimizations",
		techStack:
			"Client VMware instances will be hosted on Google Cloud VMware Engine (GCVE), HA will be provided using native VMware service Layer 2 Network Extension will be used to persist IP and",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-curebay",
		client: "Curebay",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Improving Application Availability & Security for Curebay",
		summary: "GKE autoscaling and Cloud Build CI/CD deployment.",
		businessContext:
			"Curebay has it’s infrastructure on premise and it was very difficult to manage the traffic over the globe. Curebay opt for GCP for high availability, automation and managed services.",
		solution:
			"Deployed GKE to host the main website application and auto scaling is enabled on both node and pod level. Cloud Armor policy implemented to protect website from attackers. Cloud build used for CI-CD based deployment of Application.",
		impact: "High Availability of the website to users spread across globe. Secure website and applications from online attackers.",
		metricHeadline: "High Availability of the website to users spread across globe.",
		techStack: "Google Kubernetes Engine, Cloud Armor, Cloud Build",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-bfhl",
		client: "BFHL",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Flexible & Faster Analytics for a Healthcare Giant",
		summary: "Leverage serverless BQ for real time analytics with dynamic schema handling",
		businessContext:
			"Incrementally transform and load the structured and unstructured files to BigQuery using a scalable solution Bad records flowing into the downstream pipelines from the application, including NULL array values and EPOCH datetimes Dynamic schema definition for the CSV / JSON files including addition to the nested columns that need to be synchronized and upserted into BigQuery",
		solution:
			"CSV / JSON files were uploaded into GCS buckets and loaded into BigQuery through Dataflow jobs which are scheduled and orchestrated using Cloud Composer Schema Generator function was used in the Dataflow job to derive the schema at a file level dynamically, update the schema changes to staging and target BigQuery datasets. Data in staging is loaded into the analytics dataset using upsert (merge sp), dynamically inserting/updating the new columns (nested as well) Looker has been integrated with BigQuery and tables were as the data source for the visualization dashboards.",
		impact: "To help the BFHL team to familiarise with the landscape and further use GCP as a platform for their data and other use cases, thereby improving their customer experience and overall business growth. Scalable data and analytics solution to support future growth",
		metricHeadline:
			"To help the BFHL team to familiarise with the landscape and further use GCP as a platform for their data and other use cases,…",
		techStack:
			"Looker has been integrated with BigQuery and tables were as the data source for the visualization dashboards.",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-cost-effective-dwh-with-bq-for-a-healthcare-giant",
		client: "Cost Effective DWH with BQ for a Healthcare Giant",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Cost Effective DWH with BQ for a Healthcare Giant",
		summary:
			"Onboard Apollo to Google Cloud Platform by moving their historical data from Snowflake to BigQuery (8TB, 3000+ tables)",
		businessContext:
			"Historical migration of 8TB data from Snowflake to BigQuery (GCP) Huge volume of data : 8 TB Large number of tables : 3000+ tables, 30+ schemas Datatype mapping : Mapping of each snowflake datatype into Bigquery compatible type Special characters : Handling table and column names with multiple special characters allowed in snowflake while bigquery supports only underscore(_) as special character Partitioning : Few tables required higher number of partitions due to huge amount of data while Bigquery allows 4000 partitions per partitioned table",
		solution:
			"Migrated 3000+ tables from Snowflake to Bigquery, that included 31 datasets in Bigquery for the corresponding Snowflake schemas Data was migrated to GCS first and then to Bigquery to prevent any data loss Deployed a Snowsql VM instance to run Snowflake to GCS migration script Data loading from GCS to Bigquery was done using BQSmartMigrate (Python based accelerator) which was executed in cloud shell Tables with higher number of required partitions were split into multiple partitioned tables Before migration timestamp and row count for each table was noted for validate data",
		impact: "Successfully onboarded the customer to GCP for scalable data and analytics use cases to support future growth Reduced cost in Bigquery due to autoscaling and cloud best practices Reduced management overhead",
		metricHeadline:
			"Successfully onboarded the customer to GCP for scalable data and analytics use cases to support future growth Reduced cost in…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-batch-reports-on-hadoop-clusters",
		client: "Batch Reports on Hadoop Clusters",
		region: "AMER",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Scalable DWH for a Healthcare Client",
		summary:
			"Build end-to-end data infrastructure to go from HDFS to BQ for faster decision making",
		businessContext:
			"Scalability and operation overhead cost while using Hadoop On-Prem cluster For Commercials apps with 2.7PB of incremental data, it required data warehouse for easy & faster access Time to generate Batch Reports on Hadoop Clusters was huge Longer time to execute queries while using presto on premise Running hadoop clusters to crunch data was costly",
		solution:
			"Designed Cloud Data Warehouse in BigQuery using Incremental and Batch pipelines All the projects and resources were deployed using Terraform that can be reused to replicate complete environments later Composer used as orchestrator to load the data from On-Prem HDFS system to BigQuery Built BigQuery Cost Usage Dashboards in Looker to understand the query usage per user Custom Budget Alerts on GCP are setup using PubSub Notifications which send slack alerts.",
		impact: "",
		metricHeadline: "Delivered measurable cloud, data and AI outcomes.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-pulsepoint",
		client: "Pulsepoint",
		region: "AMER",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Implementation & Upgradation of Looker Dashboards",
		summary:
			"Developed & upgraded Looker dashboards for different product lines which were embedded in client's native application",
		businessContext:
			"Pulsepoint had a roadmap for developing, upgrading and deploying advanced and intuitive Looker dashboards on their platform. Development of data services (on Looker as a BI platform) across different product lines. Data availability to the users based on their access and permissions.",
		solution:
			"Built explores and dashboards for Product owners to explore data and make quicker decisions. Implemented a framework to migrate code & content across the Looker instances Implemented aggregate awareness for optimizing the data exploration for users and dynamic Period over Period analysis in 6 dashboards Created DG framework using combination of model sets, permission sets, roles and user groups.",
		impact: "New explores and additional KPIs enabled real-time data exploration and analysis Functionality to explore the data for added analysis without compromising on Performance & Cost Roles, groups, model sets and permission sets streamlined the access controls Renewal of Looker commit for three years. Setup Looker foundation to manage product lines development under scrum model in absence of in-house team",
		metricHeadline:
			"New explores and additional KPIs enabled real-time data exploration and analysis Functionality to explore the data for added…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-indegene",
		client: "Indegene",
		region: "India",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Greenfield Google Cloud LandingZone with Shared VPC",
		summary:
			"Deployed a fully automated Google Cloud LandingZone, secure multi-environment foundation using TF, centralized Shared VPC, security controls",
		businessContext:
			"Indegene is a leading global, technology-led life sciences commercialization company Indegene wants to create seamless experiences for their patients and physicians Chose Google Cloud to run their workload in UAT, Prod projects by doing Azure AD integration with Google Cloud via G Suite connector",
		solution:
			'Deployed a Shared VPC topology in the Mumbai region with granular subnets, firewall rules, NAT Gateways, while ensuring no public IP access via strict Org Policies Enabled Security Command Center (SCC) Standard for threat detection and applied "Secure by Design" policies (e.g., Domain restricted sharing, Public Access Prevention)',
		impact: "Established a secure environment ready for AI/Data workloads. Automated infrastructure provisioning reduced setup time for new environments Implemented centralized billing budgets and alerts to prevent unexpected spending during the initial setup phase",
		metricHeadline: "Established a secure environment ready for AI/Data workloads.",
		techStack: "Security Command Centre",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-speedoc",
		client: "Speedoc",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "MVP - Appointment Booking",
		summary: "Appointment Booking - Customer & Generative Knowledge Assist for Agents",
		businessContext:
			"To improve the user appointment booking experience by automatically extracting appointment details from customers in a scalable manner Reduce manual effort by significantly decreasing the need for manual answering of questions that can be answered by Speedoc's website via blogs, pdfs and FAQs",
		solution:
			"API that interacts with Dialogflow CX and appointment booking API Appointment booking flow is built to direct a multi-turn conversation with users to allow them to book appointments or to enquire about information that can be found in the internal database of Speedoc Appointment booking is automated, creation of appointment is automatically triggered once all relevant details have been obtained",
		impact: "By automating the extraction of appointment details through the customer-facing chatbot and providing generative knowledge assistance to agents, a substantial percentage of manual answering of routine questions can be eliminated Cloud Cloud Storage SQL Cloud Run React js Healthcare services | Applied AI",
		metricHeadline:
			"By automating the extraction of appointment details through the customer-facing chatbot and providing generative knowledge…",
		techStack: "API that interacts with Dialogflow CX and appointment booking API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-seamless-healthcare-customer-experience",
		client: "Seamless Healthcare Customer Experience",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Seamless Healthcare Customer Experience",
		summary:
			"Using GMP to suggest doctors nearby, optimise capturing delivery address and lab tests at home",
		businessContext:
			"Required data-rich, accurate mapping technology Identify customer location to suggest doctors nearby for consultation Optimising address capturing to get accurate lat/long and address string",
		solution:
			"Assisted with utilizing geocoding API to get the address string and lat/long of customer location for delivery Consulted on the APIs to be used across their mobile applications and website Helped optimize the usage on Google Maps Platform",
		impact: 'Customers can accurately pinpoint their location in a map through functionality made available through the Geocoding API, in conjunction with the JavaScript API. Customers can locate their address by just clicking a "Locate me" button on the app or website',
		metricHeadline:
			"Customers can accurately pinpoint their location in a map through functionality made available through the Geocoding API, in…",
		techStack: "Dynamic Maps Autocomplete API Geocoding API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-reduction",
		client: "Reduction",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Optimizing Maps Usage for Fitness App",
		summary:
			"Changes made in use-case logic leading to 35% reduction in use of APIs, saving costs",
		businessContext:
			"Required data-rich, accurate mapping technology and scalable visualization platform Identify potential cloud-kitchen location to optimize the delivery & batching algorithm Reduce in-accuracy of forecast time to save overall delivery cost",
		solution:
			"Helped optimize the usage on Google Maps Platform by suggesting tweaks in use-cases and logic in API consumption Assisted with utilizing sub-localities for accurate identification of restaurants nearby, using places API Helped optimize the usage on Google Maps Platform",
		impact: "Customers can accurately pinpoint their location in a map through functionality made available through the Places API and Geocoding API, in conjunction with the JavaScript API. Drivers use the Directions API to identify the quickest route to customers. Reduction is total API consumption and billing by 35%",
		metricHeadline: "Reduction is total API consumption and billing by 35%",
		techStack: "Directions API Geocoding API Dynamics API Autocomplete API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-reduction-2",
		client: "Reduction",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Optimizing Online Medicine Delivery",
		summary:
			"Use GMP to accurately pinpoint address, get optimized routes and UI for faster delivery",
		businessContext:
			"Required accurate and data rich platform to get correct customer addresses to make accurate and error free delivery. Fast and scalable solution to service large incoming orders.",
		solution:
			"Assisted with Geocoding and Places API to get accurate addresses. Consulted with the right APIs to be used across their mobile applications and websites as per their use-cases Helped with optimization API consumption by removing unwanted features(Atmosphere and Contact Data in Places API)",
		impact: "Decrease in the time required to get customer addresses. Reduction is total API consumption and billing by 40%",
		metricHeadline: "Reduction is total API consumption and billing by 40%",
		techStack: "Directions API Geocoding API Places API Distance matrix API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-identify-provider",
		client: "Identify provider",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Optimize Online Medicine Delivery",
		summary:
			"Use GMP to accurately pinpoint address, get optimized routes and UI for faster delivery",
		businessContext:
			"Required data-rich, accurate mapping technology and scalable visualization platform Identify provider's location to optimize the delivery & batching algorithm Reduce in-accuracy of forecast time to save overall delivery cost",
		solution:
			"Assisted with utilizing sub-localities for accurate identification of nearby available medicine shops Consulted on the APIs to be used across their mobile applications and websites Helped optimize the usage on Google Maps Platform",
		impact: "Customers can accurately pinpoint their location in a map through functionality made available through the Places API and Geocoding API, in conjunction with the JavaScript API. Drivers use the Directions API to identify the quickest route to customers.",
		metricHeadline:
			"Customers can accurately pinpoint their location in a map through functionality made available through the Places API and…",
		techStack: "Directions API Autocomplete API Roads API Geocoding API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-sharding",
		client: "Sharding",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "enterprise_transformation",
		practiceLabel: "Future of Work",
		title: "Managing heavy activity accounts",
		summary:
			"Best practices to deal with heavy activity accounts which crosses GWS email limits",
		businessContext:
			"This client provides Hotel Room Booking services across several countries. This emails triggers via dedicated Groups configured Country wise. This Booking happens through their Website & App.",
		solution:
			"Sharding is a process of Distributing Unique based on a static pattern to Multiple Accounts. For example, emails coming to info@hotelbooking.com can be redirected to info1, info2, info3 etc On the basis of email patterns emails can be rerouted to multiple groups so email limits will not be affected",
		impact: "Organizations specially Hotel booking, Ecommerce who deals with lots of email and with heavy activity accounts are now not required to use third party solutions Google workspace email routing helps sharding to divide emails to multiple mailboxes so no more email accounts locked out, no email bounce backs",
		metricHeadline:
			"Organizations specially Hotel booking, Ecommerce who deals with lots of email and with heavy activity accounts are now not…",
		techStack: "Google Sites",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-accidental-emails",
		client: "Accidental Emails",
		region: "APAC",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "enterprise_transformation",
		practiceLabel: "Future of Work",
		title: "Accidental Emails - Deletion",
		summary:
			"Delete emails from centralised console which are accidentally shared internally in the organization.",
		businessContext:
			"There are incidents happens in an organization where by mistake an email sent Group/DL cant be recalled. Unwanted information sent to the internal team or to the whole organization needs to be addressed and deleted from their mailboxes",
		solution:
			"Educating Admin team on how to use GAM (Google Apps Manager) tool Setup advanced GAM and find email msg ID so the same ID can be used for email deletion Use GAM commands to find and delete emails from all the mailboxes",
		impact: "Organization not having Google Workspace Enterprise plus subscription are getting an option to delete emails from user's mailbox from single console Accidental damage of losing confidential information can be controlled IT Admin job get easy with GAM benefits for performing bulk GMail operations",
		metricHeadline:
			"Organization not having Google Workspace Enterprise plus subscription are getting an option to delete emails from user's…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-migration-of-newsbytes-app-cms-from-aws-to-gcp",
		client: "Migration of Newsbytes App & CMS from AWS to GCP",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Migration of Newsbytes App & CMS from AWS to GCP",
		summary:
			"Newsbytes application migration from AWS to GCP primarily Bahasa app VMs, CMS and CloudSQL alongwith Cloud build for CI/CD & monitoring.",
		businessContext:
			"Application Scalability DDOS & Web application firewalls Application release management Database Management & caching",
		solution:
			"Achieved through MIG & Autoscaling Cloud Armor was implemented for enhanced Security Achieved through Cloud build integrated with Bitbucket Used Cloud SQL & MemoryStore for Redis for Cache which improved system performance, reliability, scalability",
		impact: "Migration to GCP helped in Cost optimization Increase in System availability, scalability & Security Implementation of CI/CD pipeline with Cloud build improves the Application roll out Monitoring Alerts helps in notifying the resource utilization & application failure",
		metricHeadline:
			"Migration to GCP helped in Cost optimization Increase in System availability, scalability & Security Implementation of CI/CD…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-bytesights-to-consolidate",
		client: "Bytesights to consolidate",
		region: "EMEA",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Google Cloud to Google Cloud migration and consolidation",
		summary:
			"Brainlabs required platform consolidation of siloed Google Cloud platforms, Searce delivered a smooth Google Cloud to Google Cloud migration using Searce Hypatia Glide",
		businessContext:
			"Brainlabs operated two siloed Google Cloud platforms: Bytesights and Cortex. The fragmented setup led to inefficiencies A unified environment was required for streamlined operations and deployment Searce worked with Bytesights to consolidate both platforms onto Cortex using Google Cloud best practices. The engagement was executed using Searce Hypatia Glide",
		solution:
			"Consolidated Bytesights into Cortex on Google Cloud Migrated services to GKE following Kubernetes best practices Established CI/CD Pipelines using GitHub Actions for infra provisioning and application deployment Enabled centralised observability and streamlined management",
		impact: "Eliminated operational Silos by consolidating platforms Improved observability and infrastructure management Improved deployment reliability by utilizing GitHub Actions Cloud Cloud Kubernetes Storage Scheduler Engine Cloud SQL Media agency specializing in digital marketing, media planning, creative & UX, and technology",
		metricHeadline:
			"Eliminated operational Silos by consolidating platforms Improved observability and infrastructure management Improved…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-aws-migration-to-gcp",
		client: "AWS Migration to GCP",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS Migration to GCP",
		summary:
			"SkyVu want to move their workload from AWS to GCP using automation tools and segregate the PROD and non-PROD environment",
		businessContext:
			"Looking for automation to provision the GCP infrastructure and segregate PROD and non-PROD Currently hosted in AWS, wanted to move to GCP for better manageability, operational efficiency and scalability",
		solution:
			"Migrated game server application from ECS to GKE Provision GCP infrastructure using Terraform Migrated AWS RDS database to Cloud SQL Migrated AWS Route53 to Cloud DNS",
		impact: "Simplify the management to operate and manage the Google Cloud Platform infrastructure using Terraform Improved visibility into the application infrastructure and operational Enable extreme scalability for applications hosted on GCP with better performance and security",
		metricHeadline:
			"Simplify the management to operate and manage the Google Cloud Platform infrastructure using Terraform Improved visibility…",
		techStack: "Compute Engine, Cloud SQL Cloud Load MongoDB Balancing",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-google-cloud-beamable",
		client: "Google Cloud Beamable",
		region: "AMER",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Google Cloud Services Implementation",
		summary:
			"Provided consultation on infra services offered and application deployment in Google Cloud",
		businessContext:
			"Beamable is an open, extensible game server platform that lets you create online games and virtual worlds in minutes. Rapidly add player auth, analytics, social, commerce, inventory, content management, meta-game features, GenAI, Web3 capabilities, and more to any game project.",
		solution:
			"Implementing the designed solution to host non-prod environment and its related resources similar to AWS within Google Cloud as a part of future roadmap Adapted the IaC standards using Terraform for infra deployments and developed the required manifest files for application deployment on GKE.",
		impact: "Benefited from a secure, scalable Google Cloud infrastructure deployed as per best practices, enabling a reliable foundation. Deployments were automated via Terraform, reducing manual effort and accelerating the development lifecycle. Leveraged a CI/CD pipeline with GitHub Actions for seamless and efficient application delivery.",
		metricHeadline:
			"Benefited from a secure, scalable Google Cloud infrastructure deployed as per best practices, enabling a reliable foundation.",
		techStack: "Compute Kubernetes Cloud Engine Engine Armor",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-cloud-armor-yupptv",
		client: "Cloud Armor YuppTV",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Automation via Terraform for GCP Cloud Armor rules",
		summary:
			"Leveraging Terraform based Automation for WAF based rules and improved security posture using Cloud Armor",
		businessContext:
			"YuppTV is an OTT platform WAF rules were extensively used in AWS to block and allow specific IPs Automation as the list of IPs in the system was quite large (~10000 IPs) Terraform based automation mitigate DDoS and other OWASP risks on their workloads in a more effective manner as per Google's best practises.",
		solution:
			"Cloud Armor deployment in GCP as per the existing AWS WAF rules with automation using Terraform Deployed 900+ rules (blocking/allowing 1200+ IPs) in Cloud Armor policies via Terraform CEL Rules for path based rate limiting. Automate the import process of WAF dump of all IPs to generate TF vars files using Python scripts.",
		impact: "Better manageability and lower operational overheads by Script automation. Strengthened the Security Posture via Cloud Armor WAF Capabilities. Rate limit for specific rule like sign in, signup, payment as per business use case.",
		metricHeadline:
			"Better manageability and lower operational overheads by Script automation.",
		techStack: "Cloud Armor, Terraform",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-gametion",
		client: "Gametion",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Searce provided a Game hosting solution on GCP",
		summary:
			"Gametion was looking forward GCP environment to host their latest game application",
		businessContext:
			"Gametion India's leading game publishers They are looking forward for deployment of game application deployment on GCP The game application is to be freshly deployed (not live)",
		solution:
			"Searce will align team of professionals and deploy the best suited gcp architecture Gametion teams will also be assisted by Searce to deploy & test the applications on GCP Searce will ensure a proper handover is provided",
		impact: "Fresh GCP deployment to run Game application More Optimised & Scalable Environment",
		metricHeadline:
			"Fresh GCP deployment to run Game application More Optimised & Scalable Environment",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-india-primecaptain",
		client: "INDIA PrimeCaptain",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Prioritize Innovation and Ensures Smooth Scaling",
		summary:
			"Achieving high availability, security and performance of the application for the best user experience. INDIA",
		businessContext:
			"PrimeCaptain is a fantasy sports platform that offers the simplest ways of playing fantasy games. With only one environment for production and all their deployments being carried out manually, they were unable to certify the build during testing and deploy it on the live production environment. The other challenge was that the Application wasn't able to handle bulk requests, failed to respond and slowed down during the busy sports season.",
		solution:
			"Separation of environments for Dev, Staging and Production Automation of the deployment of web tier and App Layer by using CodeCommit, CodeBuild and CodeDeploy on AutoScaling Group Modification of the DB layer to handle around 5000 IOPS and 150 throughput.",
		impact: "Reduced the complexity of the release process Test the builds and certify the builds before deploying on Production environment Redesigned the architecture helped the team to handle the peak load without any timeout errors Increased the pace of innovation and reduced rework to ensure time and money were saved",
		metricHeadline:
			"Reduced the complexity of the release process Test the builds and certify the builds before deploying on Production…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-one-to-one-mapping-of-streamers-to-vm",
		client: "One to One mapping of Streamers to VM",
		region: "AMER",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Improved Latency for Video Streaming on Blockchain",
		summary:
			"Leveraging autoscaling and multiple GCP regions to reduce streaming latency and costs",
		businessContext:
			"Limited Scaling: One to One mapping of Streamers to VM's limited their scaling. Inefficient infra consumption: Current setup creates a new server for every stream that is generated adding cost even without 100% utilization. Ingestion latency: Ingesting streams into regional infrastructure increases latency.",
		solution:
			"Increased scalability with reduced operational overhead - By leveraging autoscaling, Theta's infrastructure is more elastic now and they will be able to meet the current and future demands of onboarding more streamers without any additional operational overhead.",
		impact: "~50% Cost Reduction - Ingestor auto scaling allows the platform to scale out and scale down the Ingestor servers based on the # of streamers. Double-digit (ms) streaming latency - By having the Ingestor auto scaling setup in multiple GCP regions, streamers can stream using the nearest Ingestor. This improves the streaming performance and end user experience.",
		metricHeadline:
			"~50% Cost Reduction - Ingestor auto scaling allows the platform to scale out and scale down the Ingestor servers based on the…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-the-born-in-cloud-news-aggregator-moved-from-aws",
		client: "The born in cloud news aggregator moved from AWS",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "The born in cloud news aggregator moved from AWS",
		summary:
			"Migration to GCP in order to reduce infrastructure maintenance task and to reduce time to market for Inshorts",
		businessContext:
			"Increase in the operational IT Infrastructure spend Time-consuming infrastructure maintenance task by the development team Manual management of user data and recommending content.",
		solution:
			"Moved to GCP to reduce the infrastructure maintenance tasks as well as self-managed Google services to reduce time to market. Application development solution of Firebase to test new features in a rapidly shifting market. Dataflow to enable real-time data processing. Cloud Build and Cloud Deployment Manager has reduced the DevOps burden.",
		impact: "Reduced monthly costs from USD$100K on data analytics alone to USD$20K for the entire infrastructure Improved average user request latency from 600 ms to 100 ms through a regional data center network Time savings of up to 6 staff hours of work per day Real-time data processing helped to instantly recommend content to customer",
		metricHeadline:
			"Reduced monthly costs from USD$100K on data analytics alone to USD$20K for the entire infrastructure Improved average user…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-trell-s-environment",
		client: "Trell's environment",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Leveraging Kubernetes for Better App Performance",
		summary:
			"Moving from Monolithic to Microservices, improving CI/CD process and leveraging GKE + Cloud SQL for better performance",
		businessContext:
			"Trell's environment was mainly running on traditional compute. They had a strong desire to move to kubernetes and achieve scaling for their Monolithic application. Improvements were needed to the application performance and content delivery",
		solution:
			"50+ Microservices on staging migrated Designing the CI/CD pipelines for Gitlab 5+ TB of DB data migrated from Aurora to Cloud SQL Migrated monolithic applications to microservices on GKE. Allowed application to autoscale using HPA and VPA Deployed Gitlab runner on GK",
		impact: "Helped increase the performance of the Trell app with successful migration of Infra to GCP Significantly reduced spending with improved performance Modernized Infra by migrating Monolith Applications to GKE .",
		metricHeadline:
			"Helped increase the performance of the Trell app with successful migration of Infra to GCP Significantly reduced spending with…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-improving-scalability-for-media-streaming-client",
		client: "Improving Scalability for Media Streaming Client",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Improving Scalability for Media Streaming Client",
		summary:
			"Moving from Monolithic to Microservices based arch on GKE for saving ops cost and better scalability",
		businessContext:
			"Looking for an application modernization solution - Wanted to move from monolithic to microservices architecture. Currently hosted on-prem, wanted to move to cloud for better manageability, scalability, operational efficiency and reduce costs Looking for lift and shift migration solution. Workloads are running on hyperV",
		solution:
			"Migrated 30+ servers from on-premise to GCP via Sure Line appliances Migrated 2 monolithic applications to microservices on GKE. Migrated Data via DMS with minimal down-time Deployed one GCE VM and mount the data via Partner InterConnect and configured GCP DNS and Private server connect service to route the Google storage API call privately to make the data migration faster. Introduced shared VPC into GCP infra for centralized database access for multiple applications.",
		impact: "Improved visibility into the application infrastructure Lower management and operational costs with better scalability",
		metricHeadline:
			"Improved visibility into the application infrastructure Lower management and operational costs with better scalability",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-cloud-migration-and-cost-optimization-for-ai-client",
		client: "Cloud Migration and Cost Optimization for AI Client",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Cloud Migration and Cost Optimization for AI Client",
		summary:
			"Leverage autoscaling, CDN and security tools to build a robust infrastructure on GCP and save costs",
		businessContext:
			"Previously having a different cloud base, client was incurring high cost. Client wants to reduce cost without compromising on the performance and efficiency",
		solution:
			"Deployed applications on private GKE regional cluster and allowed to autoscale as per cpu and memory utilization. Centrally managed application secrets using GCP secret manager Used Armor along with GKE ingress thus replacing the need for API gateway in their current architecture Used CDN to serving static content in web applications",
		impact: "Helped achieve horizontal / elastic scalability to accommodate total of 9 million users and 15K DAU with average session time of 3 mins Helped increase the performance of the Roposo app with successful migration of Roposo Transcoding Infra to GCP",
		metricHeadline:
			"Helped achieve horizontal / elastic scalability to accommodate total of 9 million users and 15K DAU with average session time…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-autoscaling-improved-ci-cd-for-dating-app",
		client: "Autoscaling & Improved CI/CD for Dating App",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Autoscaling & Improved CI/CD for Dating App",
		summary:
			"Moving from monolithic to microservices, hosting them on GKE with auto scaling, designing CI/CD for better scalability",
		businessContext:
			"Moving from monolithic to microservices, hosting them on GKE with auto scaling, designing CI/CD for better scalability",
		solution:
			"TrulyMadly's environment was mainly running on traditional compute. They had a strong desire to move to kubernetes and achieve scaling for their Monolithic application. Significantly reducing cost Improving the existing deployment approach taken by implementing CI/CD Improving application performance and content delivery 50+ Microservices on Production + Staging migrated Designing the CI/CD pipelines Migrated monolithic applications to microservices on GKE. Allowed application to autoscale using HPA and VPA",
		impact: "Modernization of applications resulting in reduced technology debt Independently scalable application services resulting in increased performance and lower cost Automation resulting in reduction of operating cost by 20%",
		metricHeadline:
			"Modernization of applications resulting in reduced technology debt Independently scalable application services resulting in…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-asianet-news",
		client: "Asianet news",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS EKS to GCP GKE migration",
		summary:
			"Moved and deployed the application on EKS to GKE by making architectural changes and introducing namespace-level segregation of applications.",
		businessContext:
			"Asianet news had all microservices as a part of a single container with every service being exposed on a separate port. For any update, specific to a language and device, the entire container image was built and had to be redeployed. The customer is using Dynamodb as a database. Applications were deployed on separate clusters.",
		solution:
			"Redeployed the appln. with namespace-level segregation. Re-architected an appln as per best practice and created a separate service for each microservice. Implemented logic at the CircleCI and in the config file for language and device-specific builds and deployments. MongoDB DB configured across 2 regions. DNS authorization was used for smooth movement. Specific containers used for every new update",
		impact: "Improved application architecture Faster deployments of application updates & Better scalability using GKE HPA Near Zero downtime migration from AWS to GCP Zero downtime for SSL provisioning for migration",
		metricHeadline:
			"Improved application architecture Faster deployments of application updates & Better scalability using GKE HPA Near Zero…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-gcp-and",
		client: "GCP and",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Set-up Ube(Kumu Play)prod environment on GCP",
		summary:
			"Kumu initiated this project as Ube (Kumu Play) was running a dev environment on GCP and wanted to set up a similar production environment",
		businessContext: "To develop Kumu Play production environment on Google Cloud Platform",
		solution:
			"Google Cloud resources to be managed via Kubernetes and reduce operational overhead Artifact Registry to store all the container images For Database, used Cloud SQL for PostgreSQL which is a fully managed service Used Memory store, a fully managed in-memory service for Redis and Memcached",
		impact: "GKE provides a managed environment for deploying, managing & scaling containerized applications using Google infrastructure Cloud SQL reduced the operational overhead for Kumu's Operations' team Memory store for Redis reduced latency and provided scalable, secure, and highly available options for Kumu Play Cloud Monitoring and Log Sink will be used by the Kumu's InfoSec team for auditing purposes",
		metricHeadline:
			"GKE provides a managed environment for deploying, managing & scaling containerized applications using Google infrastructure…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-aws-migration",
		client: "AWS Migration",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS Migration",
		summary: "AWS region to region Migration",
		businessContext:
			"Streamlyn wants to migrate their existing application infrastructure hosted in N.Virginia, Singapore & Mumbai regions to a new AWS Account. APAC",
		solution:
			"Searce did a successful Migration of existing Services, Data & workloads from existing AWS account to new AWS account. Searce created 3-tier architecture and application instances and DB created in the Private Subnet and added Load Balancer in front of instances to segregate the load. Searce enabled Autoscaling on their application by considering the CPU utilization metrics.",
		impact: "Improved resource utilization and eliminated unnecessary charges, leading to cost savings and efficient platform management. Migrating the applications from one account to another account helped client to minimize Latency, Data transfer costs, and adhere to the compliances,best practices. Media and Entertainment | Cloud Modernization",
		metricHeadline:
			"Improved resource utilization and eliminated unnecessary charges, leading to cost savings and efficient platform management.",
		techStack: "EC2, S3 DevOps Lights Cloud",
		cloudProvider: "aws",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-ibm-netezza-to-aws-redshift-they",
		client: "IBM Netezza to AWS Redshift. They",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Netezza to Redshift Implementation",
		summary:
			"Data stack transformation to Redshift thereby significantly enhancing the performance and reduce the cost",
		businessContext:
			"TSL wants to migrate their existing workloads from IBM Netezza to AWS Redshift. They had approximately 65 TB of data and are facing challenges with data growth in Netezza which in turn is increasing the cost.nance overhead & improve operational efficiency. TSL wants to modernize the data analytics platform for company's growth and reduce operational overhead with easy to scale to cluster configuration",
		solution:
			"Configure RA3 Redshift cluster in Production environment Setup AWS Schema Conversion Tool for converting schema, data types and its associated keys Leverage AWS Snowball to copy the data from IBM Netezza . After the data was loaded to AWS Snowball using data migration agents, Snowball was shipped from TCS data center to AWS data center after which data was loaded into Tata Sky owned AWS S3 Data was copied from AWS S3 to Redshift using dynamic scripts. This was a one-time sync.",
		impact: "Platform Tech Stack Time to insights improved significantly Centralized data in Cloud, modernized data warehouse. Optimization and operational efficiency Faster query processing and time to response increased significantly when compared to Netezza",
		metricHeadline:
			"Platform Tech Stack Time to insights improved significantly Centralized data in Cloud, modernized data warehouse.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-robust-infra-with-bq-for-a-media-editing-app",
		client: "Robust Infra with BQ for a Media Editing App",
		region: "AMER",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Robust Infra with BQ for a Media Editing App",
		summary:
			"Replacing PostgreSQL with BQ for analytics backend. Automated CI/CD savings deployment time",
		businessContext:
			"Applications running on Heroku were increasing in complexity without proper support for containerization Resources for PostgreSQL on Heroku had reached maximum capacity without scope for further increase",
		solution:
			"Recommended adopting GKE for the applications and moving their analytics workload to BigQuery. Helped in containerizing the applications bundled together in the same repo. Created a pipeline to help move data from PostgreSQL to BigQuery. Building an automated CI/CD pipeline for each application to control container image creation and deployments.",
		impact: "Leveraging wider capabilities of BigQuery as an analytics backend as compared to PostgreSQL. Faster application deployment time with automated CI/CD pipeline. Scalable conterized application supporting incoming requests as required.",
		metricHeadline:
			"Leveraging wider capabilities of BigQuery as an analytics backend as compared to PostgreSQL.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-improving-analytics-for-an-ai-company",
		client: "Improving Analytics for an AI Company",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Improving Analytics for an AI Company",
		summary:
			"Moving 180 TB of data from Azure to GCP, setting up central repository on GCS and solution for Hive, Presto for DA",
		businessContext:
			"Migrating 180 TB of historical and incremental data from Azure to GCP using orchestrator engine Real-time data ingestion from Postgres database. Deploying optimized solution for migrating the legacy systems like Hive & Presto Explore GCP and compare services with Azure based on capability and cost",
		solution:
			"Deployed Hive & Trino on GKE to save infra cost Migrated historical data from Azure blob to GCS using storage transfer service Data pipelines using orchestrator tool - Airflow, to load incremental data for 151 tables (Including Daily and Hourly partitioning tables) into GCS CDC pipeline from Postgres to GCS using Debezium server, PubSub, and Dataflow Creating external Hive tables on top of GCS for data analytics using Presto",
		impact: "Centralised data on GCS so that it became easier for references and internal usage within the GCP. Cost efficient solution using Presto and Hive for data analytics Improved the performance of analytics",
		metricHeadline:
			"Centralised data on GCS so that it became easier for references and internal usage within the GCP.",
		techStack:
			"service Data pipelines using orchestrator tool - Airflow, to load incremental data, Dataflow Creating external Hive tables on top of GCS for data analytics using",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-bigquery-data-from-175-edge-cinemas",
		client: "Bigquery Data from 175 edge cinemas",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Real time analytics for 175 Cinemas",
		summary:
			"Designing CDC pipeline for loyalty program data and integrating data into Bigquery",
		businessContext:
			"Data from 175 edge cinemas was not integrated with the central system Existing data warehouse was unable to scale with high data volumes Real time analytics was not possible",
		solution:
			"Load historical data from existing Data Warehouse to BigQuery Design data pipeline for delta loads from CinemaDB to BigQuery Develop data transformation jobs to transform CinemaDB data into actionable insights Design Change Data Capture(CDC) pipeline for loyalty program data",
		impact: "Real time integration of data from edge cinemas to the central system Delivered seamless customer experience through loyalty program analytics Scalable analytics solution to support future growth",
		metricHeadline:
			"Real time integration of data from edge cinemas to the central system Delivered seamless customer experience through loyalty…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-globe",
		client: "Globe",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "On Prem to Google Cloud for Telecom Company",
		summary:
			"Data migration from on-prem to GCS to Bigquery and better dashboards with integration of Power BI",
		businessContext:
			"Globe currently uses Tableau dashboards for getting multiple business insights for their senior management to make strategic decisions. Globe wanted to setup automated data pipelines to load the data from GCS to BigQuery no matter the table count increases rapidly Globe decided to evaluate various possible alternatives for Tableau and Searce + Google jointly demonstrated the capabilities of Google Data Studio.",
		solution:
			"Data migration from their on-premise databases to GCS and from GCS the same data is loaded to Bigquery Data pipeline was constructed to extract from GCS using external tables in parquet format and load into Bigquery. Dynamic SQL scripting was implemented to load the data from GCS to Bigquery in incremental fashion based on the metadata tables. Bigquery was integrated with Microsoft Power BI and worked towards creating a data model as per the business wireframes designed by BI team on basis of requirements shared",
		impact: "Reasonable Dashboards More control on the data-pipelines. Centralized data in Cloud. Real-time analytics and quick decision making.",
		metricHeadline: "Reasonable Dashboards More control on the data-pipelines.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-tatasky",
		client: "TataSky",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Scaling up the data from Netezza To AWS",
		summary:
			"TataSky was able to scale up data from IBM Netezza to AWS Snowball which improved the operational efficiency significantly",
		businessContext:
			"TSL wants to migrate their existing workloads from IBM Netezza to AWS Redshift. They had approximately 65 TB of data and are facing challenges with data growth in Netezza which in turn is increasing the cost.nance overhead & improve operational efficiency. TSL wants to modernize the data analytics platform for company's growth and reduce operational overhead with easy to scale to cluster configuration",
		solution:
			"Configure RA3 Redshift cluster in Production environment Setup AWS Schema Conversion Tool for converting schema, data types and its associated keys Leverage AWS Snowball to copy the data from IBM Netezza . After the data was loaded to AWS Snowball using data migration agents, Snowball was shipped from TCS data center to AWS data center after which data was loaded into Tata Sky owned AWS S3 .",
		impact: "Time to insights improved significantly Centralized data in Cloud, modernized data warehouse. Optimization and operational efficiency Faster query processing and time to response increased significantly when compared to Netezza",
		metricHeadline:
			"Time to insights improved significantly Centralized data in Cloud, modernized data warehouse.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-create-music-group",
		client: "Create music group",
		region: "AMER",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Created Looker extension page per design specs",
		summary:
			"Searce team created a customized Looker extension that embedded an already available Looker dashboard into it. We also provided user authentication.",
		businessContext:
			"Create music group is a singular space where artists/labels can look at financial statements Customizable experience - logo and name as per the viewer of the dashboard User authentication Masked URL",
		solution:
			"Looker extension with pre-built dashboard embedded Changing logo and name as per user logged in Looker authentication method leveraged for user login Custom domain name and extension only experience for external users",
		impact: "Customizable extension provided to client This Looker extension can be used as a template and can further be extended to meet the other needs of the client (eg. Artist dashboard, label dashboard, etc.) Media and Entertainment | Data & Analytics HTM L",
		metricHeadline:
			"Customizable extension provided to client This Looker extension can be used as a template and can further be extended to meet…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-gsd-bot",
		client: "GSD Bot",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "GSD Bot",
		summary: "Developed a CCAI Bot for Concentrix with Avaya as telephony partner",
		businessContext:
			"Concentrix wants to automate their internal IT helpdesk for their employees using Avaya IVR bot for Reset password / account unlock for self, Reset password / account unlock for colleague, Deny reset password / account unlock of colleague for specific profiles to reduce the load on their helpdesk.",
		solution:
			"Created a conversational bot using Dialogflow and integrated it to Avayas' IVR Bot. Intents were created and integrated webhook to reset password and unlock account. Employee details are pulled on request and SMS will be sent to the caller for further action",
		impact: "CCAI experience for customers using dialogflow and telephony Reduced the load on customers help desk team. Dialog Flow Enterprise Edition App Engine",
		metricHeadline:
			"CCAI experience for customers using dialogflow and telephony Reduced the load on customers help desk team.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-integrated-adfs-with-google-workspace",
		client: "Integrated ADFS with Google Workspace",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "enterprise_transformation",
		practiceLabel: "Future of Work",
		title: "Integrated ADFS with Google Workspace",
		summary: "Integrate ADFS with Google Workspace for Single Sign-On",
		businessContext:
			"Easily manage identities and authentication with a single source of truth. Help end-users use single pair of credentials to login to their Google Workspace account.",
		solution:
			"Helped integrate ADFS with Google Workspace. Rolling out Single Sign-On (SSO) for all users.",
		impact: "IT admins are able to easily manage identities and authentication with a single source of truth i.e. ADFS. End users are able to use single pair of credentials on multiple services for authentication. Active Directory Federation Services Media/Entertainment | Future of Work",
		metricHeadline:
			"IT admins are able to easily manage identities and authentication with a single source of truth i.e.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-optimized-application-performance",
		client: "Optimized Application Performance",
		region: "AMER",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "devops_platform_engineering",
		practiceLabel: "Software Engineering",
		title: "Optimized Application Performance",
		summary:
			"Firebase optimization to improve app performance and reduction in load time for Roll 20",
		businessContext:
			"Reduce monthly expenditure on firebase Reduce load time and bandwidth usage for end users Reduce reliability issues with Firebase Get away from being bound to old libraries to prevent incremental refractors",
		solution:
			"Updated firebase sdk 3.x version to 8.1 version across the frontend and backend apps Implemented Lazy loading on the attributes in firebase queries Updated the schema to reduce the lookup details",
		impact: "10-15% reduction in loading time Reduced the query ops for one game data 700+ to 300+ Updated the SDK without affecting the performance of the existing mark. Firebase JavaScript",
		metricHeadline:
			"10-15% reduction in loading time Reduced the query ops for one game data 700+ to 300+ Updated the SDK without affecting the…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-helping-telecoms-reduce-customer-service-costs",
		client: "Helping Telecoms reduce customer service costs",
		region: "APAC",
		industryCode: "TMEG",
		industryName: "Telecommunications, Media, Entertainment & Gaming (TMEG)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Helping Telecoms reduce customer service costs",
		summary:
			"Use GMP to create network coverage maps to keep customers informed and reduce service cost",
		businessContext:
			"Reduce customer support calls by showing customers network coverage maps on their website Support Customer support desk by giving them insights on the exact user-location",
		solution:
			"Maps Javascript API is used to display a heatmap of network coverage where users can identify serviceable areas across Malaysia Google Maps Places Details is also used by their customer service team to identify accurate customer address in case of any grievance",
		impact: "Reduction in service calls and better user experience Quick resolution of customer complaints",
		metricHeadline:
			"Reduction in service calls and better user experience Quick resolution of customer complaints",
		techStack: "Maps Javascript API Places Details API Geocoding API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-backward-compatibility",
		client: "Backward compatibility",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to Google Cloud Migration",
		summary:
			"Developed TF scripts to automate Google Cloud resources VPC, subnets, networking, Mngt VM's, GKE, Cloud SQL, GAR & Cloud Armor Service.",
		businessContext:
			"Application hosted on AWS cloud platform, to move them on cloud agnostic landscape. Development of TF scripts to automate Google Cloud resources VPC, subnets, networking, Mngt VM's, GKE, Cloud SQL, GAR & Cloud Armor. Extend their applications to Google Cloud Platform- AWS Metabase BI service to CloudSQL via Intermediary Cloud SQL Auth Proxy VM.",
		solution:
			"One click deployment of infra resources. Code following the Dynamic parameters as per environment required. Application Deployment ensured the required Backward compatibility is instilled in the Helm charts and CI/CD pipelines. End to end automation and testing supported by Searce Team and shadow support provided to Select Star during the Production deployment for retained for environment.",
		impact: "One click deployment of infra resources Code following the Dynamic parameters as per environment Application Deployment ensured the required Backward compatibility is instilled in the Helm charts and CI/CD pipelines End to end automation and testing supported by Searce Team and shadow support provided to Select Star during the Production deployment Data catalog and Discovery platform | Cloud Modernization",
		metricHeadline:
			"One click deployment of infra resources Code following the Dynamic parameters as per environment Application Deployment…",
		techStack: "Compute Cloud Cloud Engine Firewall Storage, Cloud Armor, Kubernetes Engine",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-google-cloud-posidex",
		client: "Google Cloud Posidex",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Creation of Landing Zone, deployment on GKE",
		summary: "Provided support on Infra and Data services offered in Google Cloud",
		businessContext:
			"Posidex is an Enterprise Information Insights and Analytics company empowering leading enterprises It is an AI/ML-powered, privacy-enhanced customer data platform for contextual insights for better growth, compliance, & customer experiences Posidex wanted to set up workloads on Google Cloud's Mumbai region in this engagement",
		solution:
			"Provisioned GKE regional cluster to host 9 microservices Created YAML config file for GKE deployment and microservices Configured helm chart to automate deployment of application microservices into GKE cluster Set up Cloud logging and monitoring dashboards",
		impact: "Services streamlined operations, reduced infrastructure tasks, and enhanced synergy with Google Cloud's broader ecosystem New pricing models and cost structures within Google Cloud Performance and scalability characteristics adjusted, leveraging Google Cloud-specific capabilities, in some cases, necessitated application tuning Adapted to Google Cloud's distinct tools, APIs, and console, which involved skill development",
		metricHeadline:
			"Services streamlined operations, reduced infrastructure tasks, and enhanced synergy with Google Cloud's broader ecosystem New…",
		techStack: "Kubernetes Engine",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-integrating-saas-product-on-gcp-marketplace",
		client: "Integrating SaaS Product on GCP Marketplace",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Integrating SaaS Product on GCP Marketplace",
		summary:
			"CrateDB Cloud: Enhancing Customer Value through Google Cloud Marketplace Integration.",
		businessContext:
			"CrateDB Cloud offers a fully-managed solution for deploying, monitoring, and backing up data. Analyze massive data in near real-time with ease. As part of its Software as a Service (SaaS) offering, CrateDB aims to enhance customer visibility, maximizing usage of their service, onboarding clients across industries.",
		solution:
			"Incorporated and integrated the SaaS product into Google marketplace listing within 06 weeks. Searce offered a streamlined billing and notification process to simplify client onboarding on CrateDB Cloud. Enhanced the product's sign-up process by utilizing the marketplace solution. Seamless integration of product with Google APIs & services. Account creation and purchase linkage post procurement.",
		impact: "CrateDB will be able to acquire new customers on GCP. Global presence of CrateDB Cloud on GCP Geo locations. Easy 1 Click SaaS Database based offering over GCP Marketplace. Leveraging CrateDB via Marketplace user can minimize the overhead of operations. APIs integration and listing helps CrateDB end users simplify the deployment process and accelerate time to adopt solution. Information Technology, Database | Cloud Modernization",
		metricHeadline: "Easy 1 Click SaaS Database based offering over GCP Marketplace.",
		techStack: "Cloud Run, Pub/Sub Datastore, Secret Manager",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-content-stack",
		client: "Content Stack",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "GCP implementation of applications using GKE contentstack.com",
		summary:
			"GCP environment setup to leverage GKE for application deployments and implement other services like BigQuery, DataProc for data analytics on two envs",
		businessContext:
			"Containerization and migration of Content Stack's services from AWS to GCP Wanted to leverage GCP for data pipelines for enhanced analytical performance Automation of data processing and dashboard views They required scalability and enhanced security",
		solution:
			"Automated application deployment (CI/CD pipelines) with ArgoCD autosync. Migrated 65 applications from AWS to GCP for prod env Refactored Datasync Jobs written in NodeJS & automated data pipeline leveraging DataProc, MongoDB, GCS & BigQuery. Deployed scalable private GKE meeting Contentstack's compliance & security needs. Enhanced WAF protection leveraging Cloud Armor managed protection plus.",
		impact: "Deeper and key insights to make data driven decisions. 2x Quicker turnaround time with automated application deployments Centralized data in GCP for improved customer experience. Compute Engine Cloud Storage Google BigQuery Dataproc Kubernetes Engine Content Delivery Network / Internet | Cloud Modernization Cloud Armor",
		metricHeadline:
			"2x Quicker turnaround time with automated application deployments Centralized data in GCP for improved customer experience.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-well-architected-review",
		client: "Well Architected Review",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Well Architected Review",
		summary:
			"Covers the 5 Pillars of the Well Architected Framework which include; operational excellence, security, reliability, performance efficiency, and cost optimization.",
		businessContext:
			"Covers the 5 Pillars of the Well Architected Framework which include; operational excellence, security, reliability, performance efficiency, and cost optimization.",
		solution:
			"APAC The customer reached out to us for help in cost optimization and also for additional AWS credits as their consumption was going up every month. Searce recommended performing a WAR activity which involves reviewing the entire AWS account for cost optimization and to prevent additional cost on unused resources",
		impact: "Cleaned up all the unused and old snapshots of the Ec2 instances Enabled lifecycle management for the infrequently accessed data in S3 buckets which brought down the storage cost Also, suggested reserving the Ec2 and RDS instances to bring down the cost of running production workloads upto 55% ITES & Professional Services| Infra Modernization",
		metricHeadline:
			"Cleaned up all the unused and old snapshots of the Ec2 instances Enabled lifecycle management for the infrequently accessed…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-default-security-settings-on-gke",
		client: "Default security settings on GKE",
		region: "EMEA",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Optimizing Cloud Spend for a Car Rental Company",
		summary:
			"Implementing GKE best practices to resolve the security issues and optimize the cost",
		businessContext:
			"Default security settings on GKE was a primary concern. The team needed a GKE certified partner to step in to resolve the security issues. Cost Savings on Infrastructure as Business scales. Cost implications and effort required to recreate the clusters that are already in product is a challenging task",
		solution:
			"Security issues such as Brute force attacks and other vulnerabilities that come with using public clusters were identified when Searce ran an Infrastructure security risk analysis report. Proposed an optimal way of recreating applications already in production. Consultation provided on other ad hoc requests like Scaling issues due to IP addresses limitation to accommodate more PODs, choosing the right Machine type, use of PMVs for Cost cutting, etc.",
		impact: "Security crisis averted with the implementation of customized security settings in GKE Overall reduction in MoM billing ITES & Professional Services| Infra Modernization",
		metricHeadline:
			"Security crisis averted with the implementation of customized security settings in GKE Overall reduction in MoM billing ITES &…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-boomtown",
		client: "Boomtown",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Seamless architecture for real estate software",
		summary:
			"Using Terraform to provision infrastructure and creating a centralized logging for all projects",
		businessContext:
			"Boomtown wanted a script which they can re-use in multiple project/environment to deploy resources. Boomtown wanted to replicate their on-prem reverse proxy setup on GKE Team has desired a single pipeline which can deploy their complete application stack when setting up a new environment. Boomtown wanted a centralized logging.",
		solution:
			"Complete infrastructure provisioning was done using Terraform. Created modules that can be reused to replicate complete environments. Nginx Ingress Controller was deployed to replicate their on-prem reverse proxy setup on GKE. We created a Multi-project pipeline which can deploy the complete application stack on GKE. Deployed graylog for centralized logging.",
		impact: "Reusable and automated infrastructure provisioning. Deployed the NGINX Ingress for better application workload along with well-architected framework Developed Multi project Pipeline for deploying complete application stack with single pipeline Centralized logging project provides a single portal to view activities for all projects.",
		metricHeadline: "Reusable and automated infrastructure provisioning.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-infra-mod-for-a-hr-and-compliance-organization",
		client: "Infra Mod for a HR and Compliance organization",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Infra Mod for a HR and Compliance organization",
		summary:
			"Containerizing the dotnet based application to optimize the cost and securing the environment",
		businessContext:
			"Containerize their legacy dotnet framework + dotnet core to run on Kubernetes. Managing network configuration within the Kubernetes environment with best practices to secure the environment. Application insights for Kubernetes based workloads. Release management for packaging, managing and deploying their legacy applications on GKE on multiple environments with ease.",
		solution:
			"GCP infrastructure as per best practices using IaaC. Containerization of their legacy applications to run on Kubernetes environment. Secure deployments of legacy applications on GKE with best practices. Jenkins + ArgoCD pipelines for easy deployment of new application versions on different environments. Running their SQL & No SQL databases on GKE. Telemetry of applications using Prometheus, Grafana & Jaeger.",
		impact: "Running their application on containerised environment along with databases to reduce overall cost of Infrastructure. Secure environment with zero trust model for running applications on Google Cloud. Managing their multi-environment release cycle for new application versions. ITES & Professional Services| Infra Modernization",
		metricHeadline:
			"Running their application on containerised environment along with databases to reduce overall cost of Infrastructure.",
		techStack:
			"GCP infrastructure as per best practices using IaaC. Containerization of their legacy applications to run on Kubernetes",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-gke-without-dev-efforts-axcient",
		client: "GKE without dev efforts Axcient",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Modernizing the infrastructure for DR solution",
		summary:
			"Implementing the monolithic to microservices based architecture using GKE in 4 weeks",
		businessContext:
			"Migrate a C++ based application to kubernetes without dev efforts Multiple services powering the platform, some of them without proper documentation as to how they connect and work as whole.",
		solution:
			"Converted the C++ based monolith inform of Docker artifacts to be moved to GKE Deployed this application on GKE to leverage it's autoscaling capabilities without management overhead Application layer communicates with the Cloud SQl in the backend Implemented scaled infrastructure in 4 weeks end-to-end",
		impact: "Successful deployment of the axcient x360Sync application (aka Anchor) to GKE without dev efforts Axcient is now setup with scaled and optimised infrastructure to increase capacity on demand in reliable manner for Anchor application. Axcient and Searce to get engaged with subsequent such project to migrate existing on-prem applications to GCP",
		metricHeadline:
			"Successful deployment of the axcient x360Sync application (aka Anchor) to GKE without dev efforts Axcient is now setup with…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-cd-frapp",
		client: "CD Frapp",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Solving Scaling for a Growing Startup",
		summary:
			"Leveraging GKE for better scaling, GCS for better archival storage and saving costs on infra and managing CI/CD",
		businessContext:
			"Frapp is a growing startup and the users on their mobile and web applications are increasing exponentially. With their old platform on AWS with docker swarm and RDS as the backend, scaling and manageability were two main challenges.",
		solution:
			"GKE for hosting all their services, improved manageability and decreased operational overhead. GCS in place of S3 for as a better archival storage option. Google Compute Engine in place of EC2 is used",
		impact: "Reduction in cloud spend by at least 10-12% Better manageability of the applications Ability to roll out updates on the app quickly Reduced operational overhead on the DevOps ITES & Professional Services| Infra Modernization",
		metricHeadline:
			"Reduction in cloud spend by at least 10-12% Better manageability of the applications Ability to roll out updates on the app…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-terragrunt",
		client: "Terragrunt",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Reliable Production Env for Contact Center Client",
		summary:
			"Leveraging GKE for better scaling, automating infra with IaC to save costs and implementing other best practices",
		businessContext:
			"Setting up a multi-tier, production grade environment to deploy their demo and live customer environments on Google Cloud. Building Terragrunt automation scripts for multiple services that will be leveraged configuring all essential building blocks of the environment as per best practices.",
		solution:
			"Successful deployment of GCP infrastructure as per best practices adhering compliance requirements. Deployment scripts for Terragrunt, Vault cluster, Atlantis configurations are in place for repetitive deployments for setting up multiple environments. Well defined method to manage access to the infrastructure. Deployment of application and database as per compliance requirements. Running the containerized stack of UJET on GKE. Secret Management using Hashicorp Vault.",
		impact: "Successful deployment of GCP infrastructure as per best practices adhering compliance requirements. Managing infrastructure and application deployment at scale across multi-environments using IaC scripts. ITES & Professional Services| Infra Modernization",
		metricHeadline:
			"Successful deployment of GCP infrastructure as per best practices adhering compliance requirements.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-dr-solution-for-human-resource-organization",
		client: "DR solution for Human resource organization",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "DR solution for Human resource organization",
		summary: "MSSQL mirroring to setup DR along with RPO and RTO achievement",
		businessContext: "MSSQL mirroring to setup DR along with RPO and RTO achievement",
		solution:
			"The client had no disaster recovery for their primary database system. They had been running with this risk. Beyond Impact was asked to determine what the effort and ongoing cost would be for a cloud-based disaster recovery position and plan. The client was also looking for lower/minimal possible RTO and RPO.",
		impact: "Platform Tech Stack VPC Peering MSSQL and Mirroring ITES & Professional Services| Infra Modernization Quick and easy continuous replication of MSSQL DBs between Primary and DR region Sub-second recovery point objectives(RPOs) achieved Recovery time objectives (RTO) of minutes Able to perform DR Drill without any disruptions to business operations",
		metricHeadline:
			"Platform Tech Stack VPC Peering MSSQL and Mirroring ITES & Professional Services| Infra Modernization Quick and easy…",
		techStack: "VPC Peering MSSQL and Mirroring",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-time-to-production-release",
		client: "Time to production release",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Infra modernization for a Tech Organization",
		summary:
			"Automating workflows to optimizing cost by 20-30% by creating CI/CD pipeline and automating workflows",
		businessContext:
			"Time to production release was high No standardized machine image creation process Time taken to create a staging environment for a developer was high High infra cost Running hadoop clusters to crunch data was costly",
		solution:
			"Setup new CI/CD pipeline for faster release process. Setup process to create a faster machine image. Moved the repos to Nexus. Setup pipeline to create staging environments based on the need of developer in a mins time Leveraging Bigquery to run SQL based workloads on raw data Setting up workflows to automate metrics generation using Cloud Composer",
		impact: "Automated machine image creation process to host applications Automated data processing workflow Increased speed of deployment Agile and a robust Infrastructure 20-30% reduced infra cost ITES & Professional Services| Infra Modernization",
		metricHeadline:
			"Automated machine image creation process to host applications Automated data processing workflow Increased speed of deployment…",
		techStack: "Composer",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-azure-to-gcp-csb",
		client: "AZURE to GCP CSB",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Infrastructure Migration of AZURE to GCP",
		summary:
			"Deployment of GCP Infrastructure as per best practices and migration of workload from AZURE to GCP",
		businessContext:
			"CSB was facing higher latency in their current AZURE systems AZURE was giving higher cost for its services",
		solution:
			"GCP infrastructure provided better performance GCP migration provided better cost optimization for their workload For protecting public facing web application we implemented Cloud Armor",
		impact: "Optimised infrastructure Affordable costing as against other domains Data loss prevention & advanced Security ITES & Professional Services| Infra Modernization",
		metricHeadline:
			"Optimised infrastructure Affordable costing as against other domains Data loss prevention & advanced Security ITES &…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-sicepat",
		client: "Sicepat",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Scalable DWH for a Logistics Client",
		summary:
			"Leverage Airbyte for ingesting the historical & incremental data from MongoDB into BigQuery",
		businessContext:
			"Sicepat Ekspres is a provider of logistics and shipping services intended to support trade-in and between emerging markets. Sicepat wanted to move all of the MongoDB Atlas workloads to BIgquery in order to build a system for analytics. Tableau & DOMO is used to build dashboards for all the internal demos purpose right now and is also competing against some home grown reports/dashboards have done on the map",
		solution:
			"Migrated historical data from 10 collections in MongoDB to BigQuery using Airbyte Leveraged Airbyte to develop automated pipelines to fetch all the incremental data at 5 minutes interval. Handled complex data types like STRUCT, RECORD using Stored Procedures in the data pipeline Data in staging is loaded into the analytics dataset in BigQuery using upsert (merge sp), dynamically inserting/updating the new records",
		impact: "Leveraging wider capabilities of BigQuery as an analytics backend as compared to MongoDB. No infrastructure overhead. Scalable data and analytics solution enabled on GCP for the delivery centers. ITES & Professional Services| Infra Modernization",
		metricHeadline:
			"Leveraging wider capabilities of BigQuery as an analytics backend as compared to MongoDB.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-digitalapicraft",
		client: "DigitalAPICraft",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Listed One APIMarketplace in Google Cloud Marketplace",
		summary: "Maximising SaaS based Service Usage for Google Cloud Clients",
		businessContext:
			"As part of its SaaS offering, DigitalAPICraft is looking for ways to help their Google Cloud based clients to maximize their usage of the service. Through the Google Cloud marketplace, DigitalAPICraft will be able to acquire customers from a wide range of industries.",
		solution:
			"Incorporated the SaaS product into Google marketplace listings Enhanced the product's sign-up process by utilising the marketplace solution. Designed and developed a solution that allows Google to bill customers based on the One APIMarketplace.",
		impact: "Through the implementation of the marketplace, DigitalAPICraft will be able to attract customers who already use the services of Google Cloud and scale up with ease.",
		metricHeadline:
			"Through the implementation of the marketplace, DigitalAPICraft will be able to attract customers who already use the services…",
		techStack:
			"App Engine, Pub/sub, Secret Manager, Cloud Engineering | Cloud Modernization, Datastore",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-enterprise-bot",
		client: "Enterprise Bot",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Listing Enterprise Bot CX GCP in Marketplace",
		summary: 'Enlisting of "Enterprise Bot CX" Product into GCP Marketplace',
		businessContext:
			"As part of its SaaS offering, Enterprise Bot was looking for ways to help their Google Cloud based clients maximize their usage of the service. Through the Google Cloud marketplace, Enterprise Bot would be able to acquire customers from a wide range of industries",
		solution:
			"Incorporated the SaaS product into Google marketplace listings Enhanced the product's sign-up process by utilizing the marketplace solution. Designed and developed a solution that allows Google to bill customers based on the Enterprise Bot CX product.",
		impact: "Through the implementation of the marketplace, Enterprise Bot will be able to attract customers who already use the services of Google Cloud. By reducing the calculations involved in billing, Enterprise Bot can reduce the overall cost of the CX used by its customers.",
		metricHeadline:
			"Through the implementation of the marketplace, Enterprise Bot will be able to attract customers who already use the services…",
		techStack: "App Engine, Secret Manager, Datastore, Pub/Sub",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-key-goal",
		client: "key goal",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "GCP Marketplace Integration",
		summary:
			"Listing of the Client's Virtual Machine solution in the Google Cloud Marketplace.",
		businessContext:
			"Diamanti aimed to make it easy for Google Cloud Platform (GCP) users to embrace their VM offerings Ultima Enterprise with Spektra (BYOL). The key goal was to seamlessly integrate with the Google Cloud Marketplace, enhancing visibility and attracting more GCP users.",
		solution:
			"Diamanti achieved effortless integration, enabling GCP users to discover and access their VM products directly within the marketplace. The streamlined process ensures that GCP users can quickly and intuitively find and deploy Diamanti's VM products without unnecessary complications.",
		impact: "Diamanti's integration with the Google Cloud Marketplace significantly expanded their visibility among GCP users. With a simplified user experience and faster time-to-value, businesses can enhance productivity. Teams can quickly deploy and manage VM offerings, reducing the time spent on manual and complex processes.",
		metricHeadline:
			"Diamanti's integration with the Google Cloud Marketplace significantly expanded their visibility among GCP users.",
		techStack: "Google Cloud Platform, Deployment Manager, Compute Engine, Cloud Storage",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-dbs-rds-will-ensure-the-db",
		client: "DBs RDS will ensure the DB",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Infrastructure and Database Modernisation",
		summary:
			"tristancorp.com Tristan has developed application to serve business and ensure to have a seamless experience migrated the existing databases to AWS RDS. APAC",
		businessContext:
			"Tristancorp hosted all 3 MSSQL server databases in EC2 instances Autoscaling and HA for the Ec2 instance will increase the costs Ensure the application supports the new database post migration",
		solution:
			"Migration of MSSQL Server to Postgresql was performed using AWS DMS tool Identified all the inline sql queries in the application code and made changes line by line and tested against the old database for data correctness",
		impact: "Reduced cost of managing multiple Ec2 instance for DBs RDS will ensure the DB is available at all times and lower administrative burden. Improved application performance after the query change in the code. Technology Services | Cloud Modernization",
		metricHeadline:
			"Reduced cost of managing multiple Ec2 instance for DBs RDS will ensure the DB is available at all times and lower…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-kpis-to-overcome-this-they",
		client: "KPIs. To overcome this they",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Driving data driven decisions for a vehicle portal",
		summary:
			"Creating a centralized single source of truth in Bigquery from multiple sources for better data decision making",
		businessContext:
			"iCarAsia teams had business KPIs that were tracked and derived through a lot of manual processes to finally being presented in an excel sheet. This resulted in operational inefficiency, data lineage issues, data sanity and also limited the business analysts to a limited number of KPIs. To overcome this they wanted to capture all data points, leverage automated data pipelines to have operational and predictive insights into their business operations.",
		solution:
			"Data was ingested from multiple sources i.e Google Analytics, MySQL Database(s) & Spreadsheet in streaming/batch mode to GCS/ BigQuery Dimensions & fact tables were combined using SQL queries to fit in the designed data model structure (15 datamarts as per modules). Created Airflow Dags which incrementally pulled data from GCS, created staging tables & updated data mart tables every 30 minutes. Datamart views refreshed as soon as incremental data loaded into BigQuery base tables. This served as source data for Google Data Studio where reports were created. GDS was integrated with BI Engine to improve performance, scalability & data freshness",
		impact: "Single source of truth for all the data sources. Automated process to track and measure the business KPIs in real time. Flexibility for business analysts to create custom and ad-hoc reports by leveraging the centralized data warehouse. Deeper and key insights for top management to make data driven decisions.",
		metricHeadline: "Single source of truth for all the data sources.",
		techStack: "Google data studio Airflow",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-lifesight",
		client: "Lifesight",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Optimizing Query time for better performance",
		summary:
			"Reducing the query time by 75% to analyze petabytes of data within matter of minutes",
		businessContext:
			"Lifesight wanted to adopt a data platform that supports building a Data Warehouse for external and internal use cases, They wanted to run ad-hoc queries on data sitting in storage using a powerful querying engine, data transformation, and cleaning in a faster and effective way using a spark or traditional MapReduce based pipeline.",
		solution:
			"The Searce team used BigQuery to build a Data Warehouse and migrated the EMR data processing frameworks to handle the analytical processing part. The application stack was moved to GKE for seamless scalability and better usage of the underlying infrastructure. All AWS services like S3, Route53, SES, Elasticsearch were migrated to corresponding GCP services as well.",
		impact: "Robust Data Platform - With BigQuery as the Data Warehouse, Lifesight could now analyze petabytes of data within a matter of minutes Better and Faster Query Time - The average query processing time was reduced by 75% due to BigQuery and d-hoc queries could now be easily performed ITES & Professional Services | Data & Analytics",
		metricHeadline:
			"Robust Data Platform - With BigQuery as the Data Warehouse, Lifesight could now analyze petabytes of data within a matter of…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-oakbrook-finance-2",
		client: "Oakbrook Finance",
		region: "EMEA",
		industryCode: "FSI",
		industryName: "Financial Services & Insurance (FSI)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Azure Databricks to GCP Databricks Migration",
		summary: "Migrate Azure hosted Databricks environment to GCP (Replatform)",
		businessContext:
			"Oakbrook Finance runs a multi-cloud environment in Microsoft Azure and Google Cloud Platform (GCP) Oakbrooks finds it cumbersome to have two separate platforms for data management in Azure and GCP for their applications",
		solution:
			"Discovery & Assessment for migration activities Migrate Azure hosted Databricks environment to GCP Migrate Azure SQL database instances & Workloads to a GCP hosted Databricks environment Migration of Azure Event Landing to GCP",
		impact: "Data Platform and Application platform are on same cloud platform, maintenance has become easier Compute and Operational cost dropped down drastically",
		metricHeadline:
			"Data Platform and Application platform are on same cloud platform, maintenance has become easier Compute and Operational cost…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-enterprise-edition-app-engine-find-out-who",
		client: "Enterprise Edition App Engine Find out who",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Conversational Bot",
		summary:
			"Developed HappierBot to simplify user experience by performing tasks via Google Chat",
		businessContext:
			"Happierwork sought for an bot that could perform simpler/regular tasks such as apply a leave, find contact details , view calendar events,etc directly through google chat without logging into the happierwork application",
		solution:
			"Created a chatbot on Google Dialogflow to perform the day to day tasks of happierwork Seamlessly link Google Account to happierwork Availability on Google Chat",
		impact: "Platform Tech Stack Delivered a personal assistant which can perform the following tasks: Apply/Cancel a leave Get information about your leave balance Find contact details(email/extension/manager/location Dialog Flow Enterprise Edition App Engine Find out who is on leave from your team View your calendar events Attendance regularization (Working while out of office/Attending an official event) ITES & Professional Services | Applied AI Speech-to-Text Text-to-Speech",
		metricHeadline:
			"Platform Tech Stack Delivered a personal assistant which can perform the following tasks: Apply/Cancel a leave Get information…",
		techStack: "Find contact details(email/extension/manager/location, App Engine",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-snow",
		client: "SNOW",
		region: "AMER",
		industryCode: "HLS",
		industryName: "Healthcare, Pharma & Life Sciences (HPL)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Google Cloud Multi-Cloud Replication & Data Lake Setup",
		summary:
			"Searce replicated Hippocratic AI's AWS setup on Google Cloud, delivering GKE environments and Fivetran-BigQuery data pipelines.",
		businessContext:
			"Hippocratic AI needed a compliant multi-cloud footprint on Google Cloud to host its safety-focused healthcare LLMs alongside its existing AWS setup. The client required real-time synchronization of 51 tables from AWS AlloyDB to support Google Cloud-native healthcare analytics. Secure, cross-cloud access to application images was required without manual migration from AWS ECR.",
		solution:
			'Searce delivered "one-click" GKE deployments for SNOW, ICE, and Model platforms using refactored Terraform and Helm. Searce built Fivetran pipelines into a BigQuery Data Lake with landing and curated zones to maintain schema integrity. Searce implemented Google Cloud Workload Identity Federation, enabling GKE to securely pull images directly from AWS via SSL/TLS.',
		impact: 'Established a compliant multi-cloud footprint, reducing platform dependency on AWS. Achieved "one-click" infrastructure deployment using modular Terraform scripts. Automated data replication for 114 tables into BigQuery, enabling advanced healthcare analytics. Successfully deployed SNOW, ICE, and Model platforms on GKE for Dev and Prod.',
		metricHeadline:
			"Automated data replication for 114 tables into BigQuery, enabling advanced healthcare analytics.",
		techStack: "Cloud Memorystore Kubernetes, Engine",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-manipal-hospitals",
		client: "Manipal Hospitals",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "An AI platform to automate call center tasks",
		summary:
			"AI platform automates call transcription, summarization & quality audits for Manipal's MARS using Google Cloud and Vertex AI using Gemini 2.5 Flash Model",
		businessContext:
			"As a leading healthcare provider in India, Manipal Hospitals operates the critical 24/7 Manipal Ambulance Response Service (MARS) In this high-stakes environment, where every second impacts patient outcomes, the efficiency of the emergency call center is paramount Business need was to integrate intelligent technology that serves as a force multiplier for the frontline team",
		solution:
			"We developed the MARS AI Platform, a suite of AI-powered tools designed to augment the call center's capabilities The solution integrates into the existing workflow to provide automated call summarization, a comprehensive dashboard for automated quality audits, and a real-time agent assistance tool This platform empowers agents and supervisors, driving efficiency and improving service quality",
		impact: "The platform delivered a significant operational uplift. It is projected to reduce the manual effort for agents and supervisors by 70-80%, allowing them to focus on more critical, patient-facing tasks By automating the audit process, it ensures 100% of calls are monitored for quality and compliance This leads to more consistent, reliable, and high quality emergency response service for all patients",
		metricHeadline:
			"It is projected to reduce the manual effort for agents and supervisors by 70-80%, allowing them to focus on more critical,…",
		techStack: "Vertex AI",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-find-out-who",
		client: "Find out who",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Personal assistant to simplify user experience",
		summary: "Chatbot created using dialogflow that can help personal assistant apply/reject",
		businessContext:
			"Happierwork sought for an bot that could perform simpler/regular tasks such as apply a leave, find contact details , view calendar events,etc directly through google chat without logging into the happierwork application",
		solution:
			"Created a chatbot on Google Dialogflow to perform the day to day tasks of happierwork Seamlessly link Google Account to happierwork Availability on Google Chat",
		impact: "Delivered a personal assistant which can perform the following tasks: Apply/Cancel a leave Get information about your leave balance Find contact details(email/extension/manager/location Find out who is on leave from your team View your calendar events Attendance regularization (Working while out of office/Attending an official event)",
		metricHeadline:
			"Delivered a personal assistant which can perform the following tasks: Apply/Cancel a leave Get information about your leave…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-manual-process",
		client: "Manual process",
		region: "APAC",
		industryCode: "TSS",
		industryName: "ITES & Professional Services",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Detection Modelling and Text Extraction",
		summary:
			"Automated extraction of critical fields in documents that helps in accelerated account payables and receivables",
		businessContext:
			"Manual process is recruited for extracting details from the account payables and receivables documents including invoices, bills, purchase orders and receipts. Manual errors in multiple line items,VAT,GST dual systems Tally Prime aims to automate the process considering Invoices and Purchase Orders with the following considerations",
		solution:
			"Training documents are uploaded to a GCS bucket and sent to Doct AI OCR for text extraction Custom model deployed on App Engine processes the documents and classifies them into different categories, such as Invoice (VAT), Invoice (CGST/SGST), Invoice (IGST), and Purchase Order (purchase_order) Users can upload documents via API, which will extract results in JSON format",
		impact: "Reduced the need for manual intervention, optimizing resource allocation, and minimizing human effort. Time to process one file manually is 5 to min min now it is done in less than a min This is a reusable solution that could be easily configured and customized to extract data for different purposes and generate various JSON output for each document Enterprise resource planning | Applied AI",
		metricHeadline:
			"Time to process one file manually is 5 to min min now it is done in less than a min This is a reusable solution that could be…",
		techStack: "Document AI App Engine Cloud Storage",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-ai-translation-for-audio-and-video",
		client: "AI Translation for Audio and Video",
		region: "APAC",
		industryCode: "RCE",
		industryName: "Retail, CPG & E-commerce (RCE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AI Translation for Audio and Video",
		summary:
			"DMart launched Polysync via Google Cloud AI to automate video dubbing into regional languages, boosting training clarity and pan-India consistency.",
		businessContext:
			'Contextual Accuracy: Ensuring translations remain meaningful within a retail specific context. Glossary Management: Maintaining strict consistency for technical retail terminology and acronyms. Visual Alignment: Synchronizing localized audio with "On-Screen Text" (OST) and maintaining 1:1 visual fidelity with the original media.',
		solution:
			"Microservices: Decoupled ingestion, validation, and generation prevent AI tasks from blocking UI. Ingestion: Users upload ZIP files and glossaries via Frontend to trigger the processing pipeline. Transcription: Cloud Run uses FFmpeg and Vertex AI to decouple media and generate draft JSONs. Review: Trainers use a UI with Gemini-powered suggestions to finalize context-aware rewrites.",
		impact: "Rapid Deployment: Automates L&D translation for simultaneous rollout in multiple regional languages. Glossary Adherence: Uses strict business glossaries to eliminate AI hallucinations and ensure accuracy. Visual Fidelity: Employs Cloud Vision tracking to maintain 1:1 alignment of localized on-screen text.",
		metricHeadline:
			"Visual Fidelity: Employs Cloud Vision tracking to maintain 1:1 alignment of localized on-screen text.",
		techStack: "Cloud Vertex AI Storage, Cloud Build",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-workspace-connectors-kala-genset-pvt-ltd",
		client: "Workspace connectors. Kala Genset Pvt Ltd",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Gemini Enterprise Workplace AI Enablement",
		summary:
			"Enabled secure enterprise search and no-code AI agents using Gemini Enterprise and Google Workspace connectors.",
		businessContext:
			"Kala Genset Pvt Ltd operates across key business functions including sales, production, quality, and procurement. KGPL currently manages highly fragmented ERP data distributed across multiple departmental Excel extracts. The organization is adopting Google Cloud Gemini Enterprise to centralize and simplify business intelligence processes.",
		solution:
			"Kala Genset Pvt Ltd deployed Google Cloud Gemini Enterprise integrated with Google Workspace and ERP Excel data. Secure IAM access was managed through Google Groups with No-Code AI agents for performance and trend analysis. AI assistants unified fragmented data and generated automated insights, reports, and dashboards for business leaders.",
		impact: "Kala Genset Pvt Ltd transformed ERP spreadsheets into instant business insights. Leaders can query sales, production, quality, and procurement data using natural language with automated summaries and charts. The solution removed manual reporting, unified cross-functional tracking, and improved decision-making speed. Manufacturing and Power Generation industry | Practice SBU - To be Discarded",
		metricHeadline:
			"Kala Genset Pvt Ltd transformed ERP spreadsheets into instant business insights.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-improving-customer-travel-experience-with-li",
		client: "Improving Customer Travel Experience with LI",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Improving Customer Travel Experience with LI",
		summary: "Use GMP to accurately find nearby places, manage travel bookings and measure ETA",
		businessContext:
			"Make online properties more relevant and useable for travellers Create the best customer experience in order to drive traffic to its site Enhance customer satisfaction Identify tools that would allow maps to zoom in and out and provide accurate location of the hotels and places nearby",
		solution:
			"Explained the full capabilities of Google Maps APIs and how best to use them with our code Developed use cases that demonstrated how services such as redBus would be more beneficial to customers with Google Maps Platform Discussed adding enhanced features to record greater return on its investment in the product",
		impact: "Customers could locate desired hotels and manage bus bookings and journeys efficiently Reduced guest queueing times significantly at hotels Improved net promoter scores by ~20-25% Customer can view the number of kilometers between destinations and the fare for each journey thus reducing search times and improving accuracy ITES & Professional Services | Location Intelligence",
		metricHeadline:
			"Customers could locate desired hotels and manage bus bookings and journeys efficiently Reduced guest queueing times…",
		techStack: "Google Maps Platform, Google places API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-connecting-professionals-with-accurate-locations",
		client: "Connecting professionals with accurate locations",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Connecting professionals with accurate locations",
		summary:
			"Use GMP to optimize the spend by 30% and helping teams on basic and advanced distance matrix API",
		businessContext:
			"Connect Urban Company professionals to the nearby user service location Maintain effective & timingly distribution of workload amongst the Urban Company professionals Ensure accuracy of the start and end time of the service",
		solution:
			"Helped the team make the most of out of Basic and advanced Distance matrix API calls Educated them oxn the Google OR tools to batch multiple service ensuring all tasks start on time",
		impact: "Reduced the wastage of resources by fetching accurate locations of the users Reduced the overall spend by 30% through effective implementation of the APIs keeping the use cases consistent",
		metricHeadline:
			"Reduced the wastage of resources by fetching accurate locations of the users Reduced the overall spend by 30% through…",
		techStack: "Directions API Autocomplete API Roads API Geocoding API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-oracle-and-more-cloud-spanner",
		client: "Oracle and more. Cloud Spanner",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Collaborating with GCP Product Teams: Spanner",
		summary:
			"Guided Schema Conversion and Data Migration tool for Cloud Spanner from various databases like PostgreSQL, MySQL, MSSQL, Oracle and more.",
		businessContext:
			"Cloud Spanner is gaining popularity and many customers want to take the advantage of it's features by migrating their existing database to Cloud Spanner With the existing databases support, huge requirement is there for MSSQL and Oracle Need for an improved schema assistant tool with modern UI Need a way to save the schema conversion progress",
		solution:
			"In this phase schema and data migration support added for MSSQL and Oracle. As a result total supported data sources are PostgreSQL, MySQL, MSSQL, Oracle, DynamoDB, CSV Rebuilt the UI with material design and added a lot of features. Introduced sessions to save and resume a schema conversion progress Introduced rules to apply changes in multiple places easily",
		impact: "It's an open source tool so now customers have a better free tool with the new features to migrate their existing DB to Spanner Schema assistant tool is made more intelligent and shows errors, warnings, hints etc. and as a result schema conversion is much more user friendly With the use of sessions progress can be saved and resumed easily allowing other users to participate in the schema conversion ITES & Professional Services | Software Engineering",
		metricHeadline:
			"It's an open source tool so now customers have a better free tool with the new features to migrate their existing DB to…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-usd-this-project",
		client: "USD This project",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Collaborating with GCP Product Teams: AlloyDB",
		summary:
			"Running real world scenarios to stress test the database and find errors/bugs USD",
		businessContext:
			"This project is an initiative to identify bugs and gaps in the product offering prior to GA release for the NewDatabase(AlloyDB) project The initiative involves real world scenario testing on the private preview released version of the NewDatabase project The database should act like a PostgreSQL database and give should follow the same functionalities",
		solution:
			"Build, Validate & Deliver Real world applications with NewDatabase private preview release as database backend service Includes both Transactional and Analytical workloads with the help of Jmeter The workloads should be highly intensive with a complete check of all the monitoring metrics Automate the correctness checks to prove validity of the data with shell, bash and Python scripting",
		impact: "The development team was able to provide 150+ bug before the product going GA(General Availability) Discovered 40+ P0(Highest Priority) and P1 bugs and helped Google team with it's analysis Created a more smoother user(developer) experience by identifying critical blockers Developed and deployed automated Docker scripts to run through different user journey's",
		metricHeadline:
			"The development team was able to provide 150+ bug before the product going GA(General Availability) Discovered 40+ P0(Highest…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-cloud-sql-in-bigquery-the-migration",
		client: "Cloud SQL in BigQuery The migration",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Optimizing terabyte-scale PostgreSQL migrations to Cloud SQL",
		summary:
			"Migrating 100+ databases ranging from 2 TB to 26 TB in size to Cloud SQL using DMS SYNOPSYS",
		businessContext:
			"Synopsis wants to migrate 100+ databases from self managed PostgreSQL to Cloud SQL in BigQuery The migration had to happen with minimal downtime and no data loss These databases had LOB objects and tables without primary keys which were not supported by DMS tool",
		solution:
			"Built a wrapper around DMS tool to cover the functionality that DMS did not support Tuned the source and target parameters at PostgreSQL level for efficient migration Created scripts for data validation, supporting tables with primary keys and LOBs Tweaked pgdumper to enable multi-threading and speed up LOB migration",
		impact: "Reduces the manual work on configuring the DMS jobs and prerequisites. Validate all the prerequisites are done before migration. Lob tables migration and data validation after migration. Near zero downtime for migration ITES & Professional Services | Software Engineering",
		metricHeadline: "Reduces the manual work on configuring the DMS jobs and prerequisites.",
		techStack: "Python",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-enhancement-of-document-management-system",
		client: "Enhancement of Document Management System",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Enhancement of Document Management System",
		summary:
			"Portal Implementation where managed versions of documents can be stored using Google Drive and Google Docs",
		businessContext:
			"The DMS (Document Management System) system needs to have modifications with respect to the approval and revision history added to the approved documents as new pages. The same Information of the revision needs to be added to the admin dashboard of the DMS.",
		solution:
			"Google drive will be used to manage and keep record of documents There will be 3 different version of files in different folders Each file will have different rules of usage and accessibility to users It will be managed by the administrator of the application The files will be mapped using the add-on functionality of the Google docs The PDFs and google documents will be created from Python scripts",
		impact: "The users of the application will have different files for different use case and access provided by the admin The older version of the documents will be archived and can be pulled up in case of a roll back The add-ons will provide seamless integration between Google drive and Google docs The users will be provided with documents and PDFs which will be auto generated through python scripts ITES & Professional Services | Software Engineering",
		metricHeadline:
			"The users of the application will have different files for different use case and access provided by the admin The older…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-business-imperative",
		client: "Business imperative",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AI-powered talent sourcing & screening",
		summary:
			"We engineered a custom AI model for X0PA's platform, boosting candidate matching accuracy and automating key recruitment workflows for their clients",
		businessContext:
			"In the hyper-competitive HR Tech market, X0PA AI required a significant enhancement to its core platform Business imperative was to increase the predictive accuracy and sophistication of their AI engine Project is initiated to create a key differentiator that would attract premier enterprise clients and solidify their position as an innovator in AI-powered talent acquisition solutions",
		solution:
			"We delivered a full-stack, conversational AI module for X0PA's platform. Solution is architected with a Node.js backend, a responsive React.js frontend, and a PostgreSQL database At its core, the system leverages Google Dialogflow to provide real-time, context-aware candidate conversations, featuring seamless Speech-to-Text (STT) and Text-to-Speech (TTS) capabilities for an interactive experience",
		impact: "Enabled X0PA's clients to automate initial screening, significantly reducing the time to identify and engage top candidate Provided an instant, 24/7 interactive point of contact for applicants, improving engagement and brand perception Freed up recruitment teams from manual, repetitive tasks, allowing them to focus on interviewing and strategic hiring",
		metricHeadline:
			"Enabled X0PA's clients to automate initial screening, significantly reducing the time to identify and engage top candidate…",
		techStack: "Dialogflow",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-developed-multipart-upload-signed-url-api",
		client: "Developed multipart upload signed url API",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Cloud Migration from Azure to GCP",
		summary:
			"Migration of the On-site environments, the online portal & API from Azure to GCP.",
		businessContext:
			"Create boilerplate code for GCP Services in Python, GO and .NET: Google Cloud Storage(GCS) Pub/Sub Cloud Operations Logging(formerly Stackdriver) GCP Secret Manager Integration of the boilerplate code with existing application",
		solution:
			"Developed boilerplate code for GCP services such as Google Cloud Storage(GCS), Pub/Sub, Cloud Operations Logging(formerly Stackdriver), GCP Secret Manager using Python, GO and .NET following the best practices from the respective languages Integrated the boilerplate code with the existing application",
		impact: "Developed multipart upload signed url API's using GCS for faster uploads of large size of data Developed APIs for other services following the best practices from respective languages for easier integration with existing applications. ITES & Professional Services | Software Engineering",
		metricHeadline:
			"Developed multipart upload signed url API's using GCS for faster uploads of large size of data Developed APIs for other…",
		techStack: "Python",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-spanner-spanner-evaluation-and-migration",
		client: "Spanner Spanner Evaluation and Migration",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Open Source Tool for Data migration to Spanner",
		summary: "Creation of User Interface, schema and data migration, with rigorous testing",
		businessContext:
			"To increase the support for widely used databases so that more users can migrate to Spanner using the tool. A graphical user interface was needed to assist users with schema conversion from various sources to Spanner",
		solution:
			"Added Schema Conversion and Data Migration support for Oracle in the CLI and GUI Added Schema Conversion and Data Migration support for SQL Server in the CLI and GUI A very user friendly interface is developed using modern design for better assistance and user experience",
		impact: "Spanner Evaluation and Migration is even more accessible for Oracle and SQL Server Database object exploration and schema modification is now easier with the new graphical user interface ITES & Professional Services | Software Engineering",
		metricHeadline:
			"Spanner Evaluation and Migration is even more accessible for Oracle and SQL Server Database object exploration and schema…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-china-the-application-itself",
		client: "China. The application itself",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Providing access to GCP from mainland China",
		summary:
			"A solution to communicate with GCP infrastructure hosted in us-central from mainland China.",
		businessContext:
			"How WaitWhile could bring their services to mainland China. The application itself is a single page web app hosted on Firebase Hosting that is relying on Firebase Authentication, Cloud Firestore and our REST API hosted on App Engine Flex. The main challenge was that web app client was using websockets to query and stream data in realtime from Firestore. Google is blocked in china so cannot access Firebase static web hosting application and App Engine endpoints.",
		solution:
			"Data center in mainland china that hosted nginx proxy and a VM that was used for firebase static web hosting. Created an on-premise dns server and a dns host as a google endpoint The respective vpn gateway was able to egress the routing to the vpn so that it gets resolved to the gcp endpoint. Replaced the public google/firebase dns urls with our custom dns urls in the SDK/CDN. Demonstrated one sample application that uses all the firebase services and one sample chat application that uses websockets to be accessible in mainland china with the help of this solution",
		impact: "More business opportunity for WaitWhile for their queue management SaaS solution for businesses to manage their lines and bookings. ITES & Professional Services | Software Engineering",
		metricHeadline:
			"More business opportunity for WaitWhile for their queue management SaaS solution for businesses to manage their lines and…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-landing-zone-pidilite-industries-limited",
		client: "Landing Zone Pidilite Industries Limited",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Advanced Tier Google Cloud Landing Zone",
		summary:
			"Pidilite Industries Limited: Enhancing Pidilite's GCP footprint with Landing Zone",
		businessContext:
			"Pidilite Industries Limited is an Indian Manufacturing company. Pidilite currently hosts their applications leveraging Azure and on-prem infrastructure. By using the GCP Landing Zone framework, Pidilite aims to achieve a more scalable, agile, and secure cloud environment that can support their future growth and innovation initiatives.",
		solution:
			"Crafted & Implemented organizational hierarchy of GCP Account. Establish strong user access controls, project isolation and workload security measures in the Landing Zone setup. GCP Network incorporating Hub & Spoke Shared VPC model for central management Cloud Armor security policies with rules to safeguard web applications from common OWASP attacks.",
		impact: "Platform Tech Stack Identity & Cloud Access Armor Management Cloud DNS Compute Cloud Load Engine Balancing Simplifying GCP network management by adopting shared VPC. Established GCP Infrastructure for new set of green field Pidilite applications for hosting on GCP. Strong security posture by adopting latest frameworks to GCP. Visibility to High-risk misconfigurations, compliance based on industry standards and benchmarks. Manufacturing | Cloud Modernization",
		metricHeadline:
			"Platform Tech Stack Identity & Cloud Access Armor Management Cloud DNS Compute Cloud Load Engine Balancing Simplifying GCP…",
		techStack: "Cloud DNS, Compute Cloud Load Engine Balancing",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-aashiyana-application-platform-which",
		client: "Aashiyana application platform which",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Lift, Shift and Modernize on Google Cloud",
		summary:
			"Azure to GCP migration followed by modernizing the applications to make them more agile",
		businessContext:
			"Tata Steel Limited would like to move their workload related to Aashiyana application platform which is currently hosted on Azure to GCP for enhanced efficiency and stability. During this migration, they would also like to improve and modernize the existing infrastructure to ensure that the system is able to handle the increasing amount of users on the platform.",
		solution:
			"GKE hosts the application Aashiyana in the form of container connected to Cloud SQL DB. Secure, global, high-performance, cost-effective and constantly improving infrastructure of Google will help Tata Steel attain the required performance. Tata Steel migrated from Azure to GCP into GKE based architecture.",
		impact: "Agile and a Robust Infrastructure Lifting & Shifting was the first step in their continued journey of App and Infra modernization. Reduced management overhead Manufacturing I Infra Modernization Non -",
		metricHeadline:
			"Agile and a Robust Infrastructure Lifting & Shifting was the first step in their continued journey of App and Infra modernization.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-real-time-insights-for-epl",
		client: "Real Time Insights for EPL",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Real Time Insights for EPL",
		summary:
			"Utilizing AWS data solutions like Redshift, AWS glue jobs and integrating them with power PI for actionable insights",
		businessContext:
			"Migrate the data from on-prem databases to Cloud Transform and perform analytics on IOT data coming from different factories into on-premise databases - MongoDB, Postgres and SAP Database. Centralized platform for data consolidation and reporting Intelligent insights on transformed data and dashboards for exploring and visualizing the data to allow business users for daily monitoring of processes",
		solution:
			"Developed data pipelines using DMS to migrate real-time data from MongoDB and Postgres to AWS Redshift. AWS Glue jobs to transfer data from SAP to AWS Redshift using OData connectivity, scheduled to run twice in a day. Integrated Redshift with Power BI, one real time and one batch dashboard that provides end to end monitoring of various business processes at machine and plant level. Optimization of the SQL Queries to enhance the performance of the dashboards on the Power BI Service",
		impact: "Deployment of AWS infrastructure as per best practices Near real-time data sync from Postgres & MongoDB to Redshift, along with data integration with SAP Deployment of dashboards in PowerBI to showcase insights on real-time data for actionable insights Manufacturing I Infra Modernization",
		metricHeadline:
			"Deployment of AWS infrastructure as per best practices Near real-time data sync from Postgres & MongoDB to Redshift, along…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-coromandel",
		client: "Coromandel",
		region: "India",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Data Lake Implementation for a Fertilizer Company",
		summary: "Deployment of the Redshift and migration to cloud data lake",
		businessContext:
			"Coromandel had multiple data sources in their infrastructure. Digital transformation to be done with the migration of the on-premise MySQL databases to cloud data lake / warehouse. Current reporting framework was manual which had to be automated. Data pipelines commencing from the base data sources till the final dashboard to be implemented",
		solution:
			"Amazon Redshift was the proposed data warehouse AWS Glue / EMR was used to process and transform the data AWS DMS was used for the historical load and incremental load Amazon Sagemaker can be used for developing and deploying analytical models Power BI visualizations were developed on Redshift data for different analytical use cases",
		impact: "Efficient monitoring of the regional sales performance More control on the data-pipelines. Centralized data in AWS. Historical data analytics helped in getting important insights Optimization of data model and operational efficiency. Manufacturing | Data & Analytics",
		metricHeadline:
			"Efficient monitoring of the regional sales performance More control on the data-pipelines.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-bi-coromandel",
		client: "BI Coromandel",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Data Warehouse for fertilizer company",
		summary:
			"Improved customer experience and real time analytics for decision making with Redshift, sagemaker and power BI",
		businessContext:
			"Coromandel had multiple data sources in their infrastructure. Digital transformation to be done with the migration of the on-premise MySQL databases to cloud data lake / warehouse. Current reporting framework was manual which had to be automated. Data pipelines commencing from the base data sources till the final dashboard to be implemented",
		solution:
			"Amazon Redshift was the proposed data warehouse AWS Glue / EMR was used to process and transform the data AWS DMS was used for the historical load and incremental load Amazon Sagemaker can be used for developing and deploying analytical models Power BI visualizations were developed on Redshift data for different analytical cases",
		impact: "Improved customer experience. More control on the data-pipelines. Centralized data in Cloud. Real-time analytics and quick decision making. Optimization and operational efficiency. Manufacturing | Data & Analytics",
		metricHeadline: "Improved customer experience.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-firebase-arlo",
		client: "Firebase Arlo",
		region: "AMER",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Flexible & Improved Analytics for Arlo",
		summary:
			"Leverage BQ with Tableau for faster and improved insights integrating using Firebase",
		businessContext:
			"Arlo decided to improve their existing capabilities on Firebase by: Building a data warehouse on GCP to ingest data from Firebase while optimizing cost and efficiency. Integrating Firebase with BigQuery for deeper analytics and creating dashboards of key performance metrics on Tableau with the end goal to improve Arlo's end-user experience.",
		solution:
			"Firebase is considered as an input from where the data is being ingested into a pre-processed dataset of BigQuery. From the pre-processed dataset, the data is refined through pipelines and the processed dataset is staged in a master dataset in BigQuery. Materialized views are created on the master dataset keeping cost optimization in consideration. Tableau is integrated with BigQuery and the views are used as data source for the visualization dashboards.",
		impact: "Integrating Firebase data helped in demonstrating user experience journeys. This data is crucial to analyze and find patterns that can help Arlo improve their processes and codebase. Since the Firebase console limits the flexibility to query data at will, we ingested data into Bigquery to further build dashboards in Tableau. Manufacturing | Data & Analytics",
		metricHeadline:
			"Integrating Firebase data helped in demonstrating user experience journeys.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-central-data-lake-colive",
		client: "Central Data Lake Colive",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Monitoring Sales Performance for Rental Service",
		summary:
			"Creating ETL pipelines to push data from multiple data sources to Amazon S3 & Redshift to create a Central Data Lake",
		businessContext:
			"Colive had multiple data sources in their infrastructure during project execution phase on which they wanted to implement a data lake solution. Implement ETL pipelines to integrate all their unstructured and semi structured data. Leverage AWS components that can scale up or down based on demand and being backed by highly scalable infrastructure, so that they can have access to compute and storage resources when needed.",
		solution:
			"Data replication using Matillion from the data sources in Google Analytics, Google Adwords, MS SQL to Amazon Redshift and then unload to S3, thereby setting up a Data Lake. Integrated Redshift with Microsoft Power BI and worked towards creating a data model as per the business wireframes designed by BI team on basis of requirements shared..",
		impact: "Efficient monitoring of the regional sales performance More control on the data-pipelines. Centralized data in AWS. Historical data analytics helped in getting important insights Optimization of data model and operational efficiency. Manufacturing | Data & Analytics",
		metricHeadline:
			"Efficient monitoring of the regional sales performance More control on the data-pipelines.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-report-generation",
		client: "Report generation",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Migration of Oracle BI reports to BigQuery",
		summary:
			"Migrated required data from Oracle SaaS to BigQuery & subsequently optimised the report query in BigQuery to generate the desired output.",
		businessContext:
			"Report generation was taking several hours (7-8hrs) in Oracle ERP SaaS. Client wanted to optimise the query and improve the report performance Client wanted to check feasibility and technical fitment of BigQuery for faster analytics & reporting",
		solution:
			"One time historical load of 26 tables data from Oracle SaaS ( via Oracle BI Publisher in CSV format) to BigQuery Created micro batches using ESS jobs based on date & org name to extract data from transactional tables Replaced several subqueries with temporary tables to reduce resource consumption and simplify data analysis GDS was integrated with BigQuery to showcase visualization capabilities",
		impact: "Shifted the report workloads to GCP, saved overall cost and accelerated their operational performance Query execution time on BigQuery reduced to ~40 seconds compared to 7-8 hrs on Oracle BI Publisher Scalable data & analytics solution to support future growth Manufacturing | Data & Analytics",
		metricHeadline:
			"Shifted the report workloads to GCP, saved overall cost and accelerated their operational performance Query execution time on…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-data-warehouse-modernization",
		client: "Data Warehouse Modernization",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Data Warehouse Modernization",
		summary:
			"Built a centralized data warehouse on BigQuery by ingesting data from multiple sources for reporting and analytical purposes.",
		businessContext:
			"A centralized data warehouse is needed to ingest data from multiple sources including SAP, MongoDB, Firebase and various other in-house APIs which can be used for analytics and reporting. Customer data from multiple sources needs to be aggregated and send to an object storage, which can be used as a source for the Customer Data Platform.",
		solution:
			"Implement a centralized Data Warehouse on Bigquery, either pulling data from multiple sources using cloud functions, or data being pushed into a cloud functions endpoint from external sources. Developed data pipeline using workflows and Cloud Functions to ingest CDP data incrementally into GCS, which is being used as a source by Salesforce. Developed data pipelines to Ingest bike booking data from Firebase Firestore to BigQuery.",
		impact: "Modernized data warehouse. Various campaign use-cases keep customers involved with specialized offers, and updated from the retailer. Scalable data & analytics solution for future growth Manufacturing | Data & Analytics",
		metricHeadline: "Modernized data warehouse.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-connecting-wind-turbines-to-increase-productivity",
		client: "Connecting Wind Turbines to Increase Productivity",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Connecting Wind Turbines to Increase Productivity",
		summary: "Better efficiency in energy, productivity, finance - Cloud IOT exhibition",
		businessContext:
			"Operational issues, problems of scale and requirement to derive more and better insights from realtime Data issues related to IoT devices going offline Handle data gaps/discrepancies in all calculations",
		solution:
			"Consolidating multiple data stores into fewer by leveraging data suite of services like BigQuery, Bigtable for time series data The platform supports both batch and streaming analytics workloads with the use of Cloud Dataflow The platform supports hosting the presentation layer along with the data processing layers in a highly available, scalable and secure manner",
		impact: "Supports monitoring, reporting, and analytics for 2,000 wind turbines generating energy across several countries Gains ability to increase power generation, predict component failures, calculate remaining useful life of components, and reduce maintenance costs Increases manufacturing productivity by at least 5% and reduces costs by 10%.",
		metricHeadline:
			"Supports monitoring, reporting, and analytics for 2,000 wind turbines generating energy across several countries Gains ability…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-the-searce",
		client: "The Searce",
		region: "AMER",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "AI enabled robot on GCP for Massage Robotics",
		summary:
			"An intuitive experience created for customers with recommendation engine capabilities on Google Cloud",
		businessContext:
			"The robotic massage service sought to create an touchless robot with the help of real time bot that responds to user queries in real time using Google's Speech to Text capabilities and DialogFlow to create intent based responses reducing operational cost and increased user experience.",
		solution:
			"Searce Team collaborated with Massage Robotics and executed alongside their team to build a solution: The Searce team helped creating a connection of Dialog Flow and Robot using RTDE We created a pipeline for flow of queries using Google's STT capabilities to the Dialog Flow Searce also build Recommendation Engine on top of Google Cloud ML Services facilitating seamless experience to the end user",
		impact: "Massage Robotics has deployed it's smart, AI enabled Robot on GCP. Simplified yet intuitive experience for end customers. Ease of use for customers leveraging speech to text interaction. This will be potentially disrupting a $12billion industry that has regularly received backlashes from users around economics, convenience, reputation and privacy Manufacturing | Applied AI",
		metricHeadline:
			"This will be potentially disrupting a $12billion industry that has regularly received backlashes from users around economics,…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-a-custom-model-to-identify-scrap",
		client: "A custom model to identify scrap",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "A custom model to identify scrap",
		summary:
			"A custom model built on Google Cloud ML/AI capabilities to automate the visual inspection of scrap materials for steel manufacturing",
		businessContext:
			"A custom model built on Google Cloud ML/AI capabilities to automate the visual inspection of scrap materials for steel manufacturing",
		solution:
			"Currently, the value of scrap is based on visual inspectors assessment. The visual inspection is not an accurate way to identify and quantify different type of scrap present in a truckload. Built a Custom Model based on Mask R-CNN Architecture to identify various types of scrap in image and generate instance segmentation mask for them. Calculated percentage value for each type of scrap in the input image of the truck load based on the model output.",
		impact: "Reproducible results Reducing the error rate caused by existing process of visual inspection. Reducing the overall OPEX by automating the process of image capturing, processing and prediction. Manufacturing | Applied AI",
		metricHeadline:
			"Reproducible results Reducing the error rate caused by existing process of visual inspection.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-visual-inspection",
		client: "visual inspection",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Prescriptive ML Model for NAT Steel",
		summary:
			"ML prescriptive model trained to reduce the dependency on performing predictive analytics",
		businessContext:
			"Currently, the value of scrap is based on visual inspectors assessment. The visual inspection is not an accurate way to identify and quantify different type of scrap present in a truckload.",
		solution:
			"Deployed ML Prescriptive Model on GCP's AI Platform. The prescriptive model is to predict top 3 buyers based on the pattern of behaviour Automated the process of preprocessing, training, and prediction of model on a regular interval.",
		impact: "Reduced the manual dependency to perform predictive analysis on the data that gets generated/updated in BigQuery on regular basis. Create a process layer for production deployment modernizing the existing process Make model more robust to add impurity layer and increase accuracy The model identifies the grade constituent with <5% error rate for each category",
		metricHeadline:
			"Create a process layer for production deployment modernizing the existing process Make model more robust to add impurity layer…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-it-also",
		client: "It also",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Solar Energy Provider deploys conversational Chatbot",
		summary:
			"Dialogflow utilized to create a chatbot that provides quick and automated answers to 15+ solar plans",
		businessContext:
			"The solar energy provider sought to create an interactive conversational bot using Dialogflow to answer questions around the different energy plans and solar services provided reducing manual interventions across the organization",
		solution:
			"Created a conversational bot on Facebook Messenger & Custom web portal integrated with the client website. The bot was trained with 150+ FAQs & 20+ intents with detailed answers to energy plans & solar services provided. Created custom web chat client that provides the same user experience as Google Assistant in terms of rich response formats to users. Used Dialogflow to create FAQs & other questions by defining the right entities for handling complex questions. User conversations stored in the GCP datastore to monitor queries & measure bot efficiency",
		impact: "Simplified yet intuitive Dialogflow experience for end customers. It also provides quick and automated answers to questions related to 15+ solar plans using Dialogflow. Manufacturing | Applied AI",
		metricHeadline:
			"It also provides quick and automated answers to questions related to 15+ solar plans using Dialogflow.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-data",
		client: "data",
		region: "AMER",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Data Warehouse for faster user insights",
		summary:
			"Arlo works with Searce to drive downstream business use-cases leveraging customer data",
		businessContext:
			"Building a data warehouse on GCP to ingest data from Firebase while optimizing cost and efficiency. Integrating Firebase with BigQuery for deeper analytics and creating dashboards of key performance metrics on Tableau with the end goal to improve Arlo's end-user experience.",
		solution:
			"NOT applied AI use case Firebase is considered as an input from where the data is being ingested into a pre-processed dataset of BigQuery. From the pre-processed dataset, the data is refined through pipelines and the processed dataset is staged in a master dataset in BigQuery. Materialized views are created on the master dataset keeping cost optimization in consideration. Tableau is integrated with BigQuery and the views are used as data source for the visualization dashboards.",
		impact: "Integrating Firebase data helped in demonstrating user experience journeys. This data is crucial to analyze and find patterns that can help Arlo improve their processes and codebase. Since the Firebase console limits the flexibility to query data at will, we ingested data into Bigquery to further build dashboards in Tableau. Manufacturing | Applied AI",
		metricHeadline:
			"Integrating Firebase data helped in demonstrating user experience journeys.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-it-also-2",
		client: "It also",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Intuitive Chatbot Improves Customer Experience",
		summary: "Dialogflow used to train a bot on 300+ FAQs and 350+ queries",
		businessContext:
			"The manufacturer sought to create an interactive conversational bot using dialogflow to answer questions around HR policies and IT approval process reducing manual interventions across the organization.",
		solution:
			"Created a conversational bot on top of Google Assistant and Custom web portal which was integrated with client's intranet portal. The bot was trained with 300+ FAQs and 100+ intents with detailed answers related to various HR policies and IT approval processes. Created a custom web chat client which provides same user experience as Google Assistant in terms of rich response formats to users. Used Dialogflow to create FAQs and other questions by defining right entities for handling complex questions.",
		impact: "The intuitive conversation bot has significantly improved customer engagement for the automobile manufacturer. It also provides quick and automated answers to questions related to 65+ policies using Dialogflow Manufacturing | Applied AI",
		metricHeadline:
			"It also provides quick and automated answers to questions related to 65+ policies using Dialogflow Manufacturing | Applied AI",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-conversational-bot-to-handle-customer-queries",
		client: "Conversational Bot to handle customer queries",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Conversational Bot to handle customer queries",
		summary:
			"Developed a conversational bot for Mahindra & Mahindra using Google Diaglogflow to handle customer queries",
		businessContext:
			"Developed a conversational bot for Mahindra & Mahindra using Google Diaglogflow to handle customer queries",
		solution:
			"The customer wants to build a chatbot using Dialogflow. This system should be faq based and integrated with their existing setup. Built a Faq based chatbot using Dialogflow. Used Knowledge-Base functionality provided by Dialogflow. Deployed the chatbot with a frontend on GCP's App Engine",
		impact: "The chatbot system we built were used as a backend integration for their Speech to text and text to speech Digital Avatar setup where the responses were coming from the chatbot trained by us. Speech-to-Tex Text-to-Spee t ch Non-",
		metricHeadline:
			"The chatbot system we built were used as a backend integration for their Speech to text and text to speech Digital Avatar…",
		techStack: "App Engine",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-it-also-3",
		client: "It also",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Conversational Chatbot",
		summary:
			"Developed an interactive conversational bot using Dialogflow to answer about different energy plans and solar services",
		businessContext:
			"The solar energy provider sought to create an interactive conversational bot using Dialogflow to answer questions around the different energy plans and solar services provided reducing manual interventions across the organization",
		solution:
			"Created a conversational bot on Facebook Messenger and Custom web portal which was integrated with the client website. The bot was trained with 150+ FAQs and 20+ intents with detailed answers related to various energy plans and solar services provided. The user conversations will be stored in the GCP datastore to monitor user queries and measure the efficiency of the bot.",
		impact: "Simplified yet intuitive Dialogflow experience for end customers. It also provides quick and automated answers to questions related to 15+ solar plans using Dialogflow. Speech-to-Text Text-to-Speech",
		metricHeadline:
			"It also provides quick and automated answers to questions related to 15+ solar plans using Dialogflow.",
		techStack: "App Engine",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-accurately-pinpoint-customer",
		client: "Accurately pinpoint customer",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Locating Broken Down Vehicles for Pickup",
		summary:
			"Accurately pinpoint customer's location when in need and identify nearest pickup vehicle and ETA",
		businessContext:
			"Get accurate customer's location where their car has broken down Identify nearby pickup trucks and route them to the customer location with the least possible time Calculate accurate ETAs and distances.",
		solution:
			"Assisted with identifying the correct APIs for their use-cases Helped optimize the usage on Google Maps Platform by suggesting tweaks in use-cases and logic in API consumption Assisted with understanding the API console better and put limits and restrictions on the API consumption",
		impact: "Accurately locate the customer location and easily route service trucks to customer location Decrease in the service time to cater to customer requests Manufacturing | Location Intelligence",
		metricHeadline:
			"Accurately locate the customer location and easily route service trucks to customer location Decrease in the service time to…",
		techStack: "Geocoding API Dynamic Map API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-at-the-control-centre",
		client: "At the control centre",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Employee Tracking for Better Management",
		summary:
			"Track field force by mapping the entire control center for making informed employee management decisions",
		businessContext:
			"Create a location-based solution to track field force employees that will help in employee management and increase productivity At the control centre - Provide visibility across multiple divisions, business units, and distribution channel through fleet tracking",
		solution:
			"Helped them to leverage relevant Google Maps functions to achieve the desired use case in the most optimum way possible Optimized API calls to smoothen the variations in GPS reading for accurate visualization of the field force employee with the help of Roads API and Geolocation API",
		impact: "Efficient API mapping for the control center use case that enable mapping of central hub, distributors and helps the team in making informed strategic decisions Manufacturing | Location Intelligence",
		metricHeadline:
			"Efficient API mapping for the control center use case that enable mapping of central hub, distributors and helps the team in…",
		techStack: "Directions API Autocomplete API Roads API Geocoding API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-accurately-pinpoint-broken-down-vehicle",
		client: "Accurately pinpoint broken down vehicle",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Breakdown Assistance Program for Trucks on Road",
		summary: "Accurately pinpoint broken down vehicle's location to reduce down time and costs",
		businessContext:
			"Breakdown assistance programme - Looking to reduce down time, NH the lowest possible cost. Identify strategic locations for service center to fulfill SLAs",
		solution:
			"Effectively implement Distance Matrix and Directions APIs that ensures uptime in reaching the customer and guarantees shortest possible time to put vehicle on the road Optimized API calls to smoothen the variations in GPS reading for accurate visualization of the vehicle with the help of Roads API, and Geolocation API",
		impact: "Timely service maintenance delivered with higher uptimes The strategic locations, 24/7 call center services and factory-certified technicians ensure that they reach the customer within 4 hours of breakdown, and put them back on the road within 48 hours Manufacturing | Location Intelligence",
		metricHeadline:
			"Timely service maintenance delivered with higher uptimes The strategic locations, 24/7 call center services and…",
		techStack: "Autocomplete API Roads API Geocoding API Directions API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-graphical-visualization-on-cloud-search",
		client: "Graphical visualization on Cloud Search",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "devops_platform_engineering",
		practiceLabel: "Software Engineering",
		title: "Graphical visualization on Cloud Search",
		summary:
			"KPI data integration & its graphical representation on Cloud Search for a Steel Manufacturing Company",
		businessContext:
			"Department wise KPI (Key Performance Indicator) data gets uploaded on BigQuery & SAP Hana database. Tata Steel wants to integrate the KPI data from these sources to Cloud Search and analyse the KPI trend in the form of graphs.",
		solution:
			"Fetching the KPI data from different sources to a centralized table in the BigQuery henceforth indexing the data to the Cloud Search via connector. Developed searchable interface for the presentation of KPI data in the form of Line graphs, Bar graphs and Box Plot. Created visualization for real-time and historical data along with comparison of planned versus actual KPI values.",
		impact: "Improved insight of departmental KPI values. Enables to make improved decision and keep track of the performance of the department 32% faster time to result for a search query using Cloud Search",
		metricHeadline:
			"Enables to make improved decision and keep track of the performance of the department 32% faster time to result for a search…",
		techStack: "Google Cloud Search",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-kirloskar-group",
		client: "Kirloskar Group",
		region: "APAC",
		industryCode: "MCM",
		industryName: "Manufacturing & Mining (MM)",
		service: "enterprise_transformation",
		practiceLabel: "Future of Work",
		title: "Merger of multiple domains under one family",
		summary: "All Sister concern companies and entities were merged under one Kirloskar group",
		businessContext:
			"Before the pandemic hit, all of the Kirloskar Group was on a variety of different messaging, document editing, and sharing platforms. Was facing challenges with a cluttered email storage, unfriendly video conferencing tools and absence of reliable cloud storage. Need for tools related to streamlining communication and better internal collaboration. With the lockdown in place, Kirloskar wanted a platform that could support their new work from home norms with better cost optimization and increased data security",
		solution:
			"Migrated 4000 users from On-Prem Exchange 2010, 2016 and M365 Kirloskar Group wanted to eliminate the flaws and costs of their existing platform. With these concerns in mind, Searce introduced the group to Google Workspace, an integrated platform with the best-in-class collaboration tools for business productivity. Simple and efficient collaboration tools Allowed better, faster ways to communicate More than 6 different BU's to be merged under one tree for centralized management of messaging system",
		impact: "60% reduction for cloud storage 50% improvement in collaboration Streamlining management operations Reducing dependency on third-party platforms Seamless and secure access Increased Collaboration (video and asynchronous) Change Management Manufacturing | Future of Work",
		metricHeadline:
			"60% reduction for cloud storage 50% improvement in collaboration Streamlining management operations Reducing dependency on…",
		techStack: "Tech Stack GSMME",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-difficulty-with-scaling",
		client: "Difficulty with scaling",
		region: "APAC",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Complete Revamp on GCP with Searce",
		summary:
			"Reduce costs, improve developer productivity on cloud and support scaling for a growing company using GKE, CloudSQL, etc",
		businessContext:
			"Increasing costs with the growth in the user base Difficulty with scaling - rapid changes in demand Management Overhead - restricted from global rollouts Reduced developer productivity - Difficulty to iterate faster",
		solution:
			"Thorough POC was executed by deploying one of the critical applications to benchmark several performance metrics on GCP Once the success criteria met, migrated 25 different applications to GCP by deploying the application layer on GKE and its database on Cloud SQL, while using Pub/Sub and Firebase to compare and verify information in real time across most of its applications.",
		impact: "Enabled 24% savings on infrastructure costs per month Helps increase throughput by 8% to provide almost immediate insights for customers Improves latency time by 11% to run applications faster and at scale Enables business simulation applications to scale on demand to serve more organizations that are training their employees",
		metricHeadline:
			"Enabled 24% savings on infrastructure costs per month Helps increase throughput by 8% to provide almost immediate insights for…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-current-infrastructure",
		client: "Current Infrastructure",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to GCP Migration for Global Ed Tech",
		summary:
			"AWS takeout for largest Edtech worldwide having collaborations with prestigious universities.",
		businessContext:
			"Largest global edtech platform with cutting-edge technology to offer best quality education. Current Infrastructure was hosted on AWS. Aims to transition from AWS to Google Cloud Platform (GCP). Planned prioritizing high availability for workloads and implementing disaster recovery (DR) for critical workloads of US region",
		solution:
			"Landing Zone setup via 9000+ lines TF scripts. NGFW solution for connectivity 40+ VM Migrated using M2VM. Microservices deployed on GCP GKE via Enhanced CI/CD Migrated 350 GB+ of Database via Backup - Restore & DMS method. Migrated 90 TB+ data from S3 to GCS via STS. 08 TB+ of data migration via RSYNC & BlueXP Video Streaming platform migrated to GCP via GCP MediaCDN",
		impact: "Secure and Scalable CICD & landing zone with Operational excellence. Increased observability via standardized monitoring. Infrastructure Standardization, Upgradation and Modernization with cost saving. Near Zero downtime migration from AWS to GCP. Faster Video content delivery, DR Drill without any disruptions to business operations. Ed Tech | Cloud Modernization Artifact Cloud Cloud Registry Deploy Run Pub/Sub",
		metricHeadline: "Secure and Scalable CICD & landing zone with Operational excellence.",
		techStack:
			"Google Compute Cloud Memory Kubernetes Engine SQL store Engine, Cloud Monitoring Build",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-technical",
		client: "Technical",
		region: "EMEA",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Improving Security Posture for Soccer Learning App",
		summary:
			"Filling the gaps in in-house cloud expertise on GCP and security resulting in better security posture and robust infra on GKE",
		businessContext:
			"Filling the gaps in in-house cloud expertise on GCP and security resulting in better security posture and robust infra on GKE",
		solution:
			"Searce's Technical team ran proactive Infra Sec reports that helped identify many issues in the client's security posture The Client used many default settings on GKE that could not be altered. Lack of certified GKE in-house engineers After careful assessment of the client's infrastructure, the GKE experts at Searce started the remediation process (the team created all resources from scratch with the right settings) GCP certified professionals provided impromptu consultative services for many small to medium issues",
		impact: "Fully Secured Infrastructure avoiding any security breaches Automated infrastructure provisioning and hence increased efficiency PS & E | Infra Modernization",
		metricHeadline:
			"Fully Secured Infrastructure avoiding any security breaches Automated infrastructure provisioning and hence increased…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-vms-from-multiple-sources-to-gcp",
		client: "VMs from multiple sources to GCP",
		region: "APAC",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Migrating to GCP and Saving Cloud Costs",
		summary:
			"Migrating a sizeable amount of VMs from multiple sources to GCP - improved CI/CD, automation and better security",
		businessContext:
			"Migrating a sizeable amount of VMs from multiple sources to GCP - improved CI/CD, automation and better security",
		solution:
			"Mindvalley's current infrastructure is spread across multiple providers such as AWS, Linode, and GCP. They wanted to consolidate multiple services and cloud providers into a better manageable GKE deployment on Google Cloud Platform. 170+ Linodes (VMs) & 37+ domains running closely dependent applications that were getting difficult to manage. A consolidated list of GCP projects was created to ensure a minimal number of projects are being used as per the defined hierarchy. Searce teams authored Terraform templates and infrastructure as a code was set up for ease of commissioning & decommissioning. Create Highly available & scalable Private GKE cluster & Enable Kubernetes Engine Operations (Monitoring and observability)",
		impact: "This helped the business to scale up easily with the complete infrastructure on GCP and automation through CI/CD pipelines & IaaC, this helped to reduce the time to market of the new releases. Reduction in the overall infrastructure cost. Improvement in the overall security and access management helped to secure the business and smoothen the process",
		metricHeadline:
			"This helped the business to scale up easily with the complete infrastructure on GCP and automation through CI/CD pipelines &…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-customer-2",
		client: "Customer",
		region: "APAC",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Optimizing IT for a Leading Online Coaching App",
		summary:
			"Implementing automation, better security posture and networking tools for an overall robust infrastructure",
		businessContext:
			"Customer was looking for cost saving and a easy solution to replace currently used Agora.io which controls all Digital Class Streaming Handling millions of requests of users on the website for video Streaming Live / VOD Significantly reducing cost Working Proof of Concept of Solution Proposed which they were not able to develop internally",
		solution:
			"Use of Terraform to automate resources creation in GCP. Strong security posture by connecting servers using Identity Aware Proxy (IAP). Implemented Load Balancer to distribute traffic among different backend Servers and SSL authentication through LB (Automated SSL Renewal and Management) Implemented Firebase as a message broker to handle requests and control messages Use of Red5Pro (based on Open Source Red5) to achieve millisecond latency",
		impact: "Enhanced performance and latency with the help of cloud solutions High Availability of the website to users spread across the world ~20-30% reduction in Cloud Spends vs previous Cloud Platform PS & E | Infra Modernization",
		metricHeadline:
			"Enhanced performance and latency with the help of cloud solutions High Availability of the website to users spread across the…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-migration-of-applications-to-gcp-app-engine-vm",
		client: "Migration of applications to GCP app engine & VM",
		region: "AMER",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Migration of applications to GCP app engine & VM",
		summary:
			"Deployment of GCP infrastructure as per best practice, implementation of Google App Engine and CDN",
		businessContext:
			"Costing on AZURE App service Automate Infrastructure deployment for multiple environments Ensure current deployment process remains the same as AZURE deployment",
		solution:
			"Provide solution of GCP migration and Migration of applications to GCP app engine and VM Authored and Provided Terraform scripts Replicated the deployment process on App engine",
		impact: "Post migration on GCP app engine it helps to Prof Jim save upto 95 % savings on cost. PS & E | Infra Modernization",
		metricHeadline:
			"Post migration on GCP app engine it helps to Prof Jim save upto 95 % savings on cost.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-gcp-client",
		client: "GCP Client",
		region: "APAC",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Cost Efficient Analytics for a Leading Ed-App",
		summary:
			"Comparing multiple analytics technologies and choosing the best for client, deploying the same on GCP",
		businessContext:
			"Client was looking for an analytical platform which will help them with their existing workload, keeping in mind cost, performance and storage. Client shortlisted multiple technologies and they required our help in evaluating these for their business requirements",
		solution:
			"Deployed Trino cluster on private GKE regional cluster and allowed to autoscale as per cpu and memory utilization. Deployed Hive data warehouse on top of GCP Dataproc Cluster. Created external tables in Hive on top of GCS and made tables available on Trino for analysis . Created BigQuery tables from Parquet metadata . Benchmarking of query execution analysis between BigQuery and Trino",
		impact: "Enabled decision making on which analytics platform to choose based on cost, performance, storage and time PS & E | Data & Analytics",
		metricHeadline:
			"Enabled decision making on which analytics platform to choose based on cost, performance, storage and time PS & E | Data &…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-data-2",
		client: "data",
		region: "APAC",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Improving Recommendations for Coaching Website",
		summary:
			"Familiarize client with the market leading AI capabilities of GCP by a successful POC of recommendations using AI use-case",
		businessContext:
			"Familiarize client with the market leading AI capabilities of GCP by a successful POC of recommendations using AI use-case",
		solution:
			"Building a data warehouse in GCP, integrating the application data in DynamoDB with BigQuery for deeper analytics and ML uses case to improve the overall data latency and end-user experience. Migrate the applications from DynamoDB to Firestore for scalability and future growth as next steps. For the Proof of Concept, one-time data pipelines were setup for transforming and uploading semi-structured data (JSON in gzip format) from DynamoDB to BigQuery and Firestore. Data was sourced from AWS S3 into GCS buckets using Cloud Transfer Service and loaded into BigQuery and Firestore using Cloud Dataflow pipelines. Data explorations and an ML model for personalization use case was built and trained using the BigQuery dataset.",
		impact: "To help GeeksforGeeks to familiarise with the landscape and further use GCP as a platform for data and AI use cases, improving their customer experience and business growth. This data is crucial to analyze and find user patterns on the application that can help improve their content and user recommendations. PS & E | Data & Analytics",
		metricHeadline:
			"To help GeeksforGeeks to familiarise with the landscape and further use GCP as a platform for data and AI use cases, improving…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-poi-information-ryde",
		client: "POI information Ryde",
		region: "APAC",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Pick up & drop for ride sharing",
		summary: "Using GMP APIs to get accurate address and POI information",
		businessContext:
			"Ryde is a carpooling and ridesharing app headquartered in Singapore As their core business revolves around sending and picking up from precise locations, address is one of the main business requirement",
		solution:
			"Ryde uses Location intelligence services to solve Inadequate address by using Google's rich places dataset Lack of POI coverage Incorrect location for some addresses and POIs Google Maps Platform is able to provide up to date data therefore overcoming lack of improvements by other mapping providers, especially for Singapore region",
		impact: "Riders face least possible issue in terms of missing or incorrect address and POIs which helps with higher retention on Ryde platform Less manpower allocation from our Customer Excellence team to resolve missing or incorrect address issues faced by riders and drivers PS & E | Location Intelligence",
		metricHeadline:
			"Riders face least possible issue in terms of missing or incorrect address and POIs which helps with higher retention on Ryde…",
		techStack: "Directions API Geocoding API Roads API Autocomplete API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-university",
		client: "University",
		region: "APAC",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Indoor Mapping Solution for NTU Singapore",
		summary:
			"Indoor navigation solution to help students find their way within the large campus",
		businessContext:
			"Large size of the campus and tricky terrain - challenging for new students and visitors to navigate Provide seamless outdoor to indoor navigation to enhance visitor experience Need for a mobile responsive solution that matched the quality of the University's personable service for all visitors, students, and stakeholders",
		solution:
			"Mapsindoors SDK built on Google Maps for seamless outdoor to indoor navigation Content Management System for easy maintenance Integration of existing applications, kiosks and website with the mapping solution",
		impact: "Reduced student anxiety to reach classroom or any new location within campus Better navigation experience for visitors and new staff PS & E | Location Intelligence",
		metricHeadline:
			"Reduced student anxiety to reach classroom or any new location within campus Better navigation experience for visitors and new…",
		techStack: "Mapspeople SDK Places API Directions API",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-atlan",
		client: "Atlan",
		region: "APAC",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Multi-Cloud options for Atlan’s clients",
		summary: "Deploying EKS stack into GCP GKE separate vClusters via Terraform.",
		businessContext:
			"Atlan wants to explore GCP/GKE environment leveraging their existing AWS/EKS setup. They wanted to offer their tenant an option to opt for AWS or GCP for deploying the tenant’s application.",
		solution:
			"Automated the entire Infra setup using Terraform. Automated Application deployment using Argo Workflow and ArgoCD based on customer subscription. Used open source GToken for achieving the secure way to authenticate AWS env from GKE. Modified existing Helm charts with latest version.",
		impact: "Atlan is now able to offer their tenants multi-cloud options for the Atlan products deployment. Provided download of GCP Ecosystem for their stack with respect to their Business objectives. Seamless integration of Tech Stack across cloud environment considering best practices and minimal overhead of Infra management.",
		metricHeadline:
			"Atlan is now able to offer their tenants multi-cloud options for the Atlan products deployment.",
		techStack: "Terraform, GKE, vClusters, Argo Workflow, ArgoCD, GToken, Helm",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-arkham",
		client: "Arkham",
		region: "APAC",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "GCP to GCP Infra Migration",
		summary: "Migrating organizational accounts and a single 64TB DB via Striim.",
		businessContext:
			"Arkham wanted an improved, more secure and scalable landing zone with best policies and practices applied. Migration of all services and data to the new environment. Migration of 1 big DB of 64TB while all apps connected to this single instance.",
		solution:
			"Created new Landing Zone with best practices with integration of monitoring & logging for applications & systems on Google Cloud. Successfully migrated applications, databases, BQ datasets, GCS Buckets & Secrets. Implemented autoscaling for GKE cluster, & upgraded container registry to artifact registry with cleanup policies attached. Completed the complex migration of single DB of 64TB using Striim.",
		impact: "A more secure and scalable landing zone with centralised networking control and standardisation of the environment. Cost optimisations through GKE cluster autoscaling and cleanup policy applied on artifact registry. IAM access controlled at group level.",
		metricHeadline:
			"A more secure and scalable landing zone with centralised networking control and standardisation of the environment.",
		techStack:
			"Compute Engine, Kubernetes Engine, Cloud SQL, BigQuery, Cloud Storage, Striim, Artifact Registry",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-elasticsearch",
		client: "Elasticsearch",
		region: "AMER",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Migrating to GCP for Performance Optimization",
		summary: "Migrated from AWS to GCP. Achieved efficiency in CI/CD and saved costs",
		businessContext:
			"Migrate their new and upcoming public cloud infrastructure to GCP to accommodate their technology & business needs in accordance with their growth plans. Move their existing AWS stack to GCP and leverage more GCP services as the business grows. Meet the performance of these migrated services on GCP.",
		solution:
			"GCP infrastructure as per best practices using IaaC. Golden image creation for Elasticsearch, Solr, Zookeeper and Wingman services. Deploying Cloud Memorystore(Redis), Cloud SQL MySQL, Solr, Zookeeper, Elasticsearch and deploy Wingman application on GCE. Deploying SSD backed Cloud Filestore, Provisioning GKE cluster and configuring Spot.io Elasticgroup for running PVM based nodes. Deploying Applications to GKE as per best practices.",
		impact: "Successful deployment of GCP infrastructure as per best practices. Achieved operational and deployment efficiency and achieve minimum repeatability of DevOps tools. Achieved latency and acceptance test results on the Google Cloud. ISVs | Infra Modernization",
		metricHeadline: "Successful deployment of GCP infrastructure as per best practices.",
		techStack:
			"Elasticsearch and deploy Wingman application on GCE. Deploying SSD backed Cloud Filestore, Provisioning GKE cluster and",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-building-a-global-infrastructure-for-anti-piracy",
		client: "Building a Global Infrastructure for Anti Piracy",
		region: "AMER",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Building a Global Infrastructure for Anti Piracy",
		summary:
			"Leveraging GKE, automation with IaaC and GCP DevOps tool to achieve global availability as well as dev efficiency",
		businessContext:
			"Leveraging GKE, automation with IaaC and GCP DevOps tool to achieve global availability as well as dev efficiency",
		solution:
			"Infrastructure and DevOps practices necessary to allow PACE Anti-Piracy, Inc to operate a multi-regional, high-availability presence in GCP, leveraging Kubernetes and Spanner. Build a best-practices global Kubernetes presence for their cloud authorization endpoint. GCP infrastructure as per best practices using IaaC. Multi-Regional GKE Auto-Pilot presence. Cloud Build driven GKE deployment mechanisms for easy deployment of new application versions. Regional GKE Auto Pilot clusters in each region across continents. MultiCluster Ingress service to have global presence.",
		impact: "Global presence of application. Successful deployment of application and capability to manage each region through Cloud Build CI/CD. GCP Spanner for Multi-Regional SQL operations. ISVs | Infra Modernization",
		metricHeadline: "Global presence of application.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-existing-infrastructure",
		client: "Existing infrastructure",
		region: "AMER",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Improving Scaling for AI Powered Interpretation",
		summary:
			"Using multi-regional GKE, GCP Load Balancing for global availability and scaling for Wordly",
		businessContext:
			"Scaling GCP infrastructure to meet the spike as per the demand Existing infrastructure was running on VMs with WebSocket protocol for prolonged connection to support end users for complete meeting durations. Expanding to multi region deployments - US, Europe and Asia",
		solution:
			"GCP infrastructure as per best practices using IaaC. Containerizing existing applications to leverage GKE for multi regional deployments as well as scaling Implementing Multi Cluster Ingress to combine workloads in all regions under a single Load Balancer",
		impact: "Optimised multi region deployment with scaling and rollouts for applications Improved and automated deployment for applications ISVs | Infra Modernization",
		metricHeadline:
			"Optimised multi region deployment with scaling and rollouts for applications Improved and automated deployment for…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-apigate",
		client: "APIGATE",
		region: "APAC",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Implementing Best Practices on K8s with Searce",
		summary:
			"Used scaling policies, IaaC to improve GKE performance. Searce provided automation support to increase dev efficiency",
		businessContext:
			"Used scaling policies, IaaC to improve GKE performance. Searce provided automation support to increase dev efficiency",
		solution:
			"APAC Frontend for APIGATE was hosted on AWS while the backend was on GCP which resulted in latency, egress and integration challenges for the applications. They faced frequent downtime during deployments and higher cost due to no scaling policies on GKE Searce provided IaC leveraging Terraform for overall infrastructure, Jenkins and Spinnaker for DevOps automation. Searce also helped in modernization of GKE cluster supporting HPA and VCA with Istio Platform ISVs | Infra Modernization",
		impact: "Improved security, management and better performance Searce helped APIGATE have a fully scalable and automated architecture on GCP. This resulted in reduced cost due to autoscaling and the right cloud foundation best practices",
		metricHeadline:
			"Improved security, management and better performance Searce helped APIGATE have a fully scalable and automated architecture on…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-they-have-workloads-that",
		client: "They have workloads that",
		region: "EMEA",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Scaling up on GCP effortlessly",
		summary: "Implemented preemptible GPUs that increased 10x capacity",
		businessContext:
			"Scaling GCP infrastructure to meet 10x spike in demand in economical and reliable manner They have workloads that needed high power machines, and wanted to check on GPUs.",
		solution:
			"Recommended provisioning of new resources basis the custom metrics captured on Stackdriver Implemented Preemptible GPUs (as an alternative to On-Demand GPUs and upto 50% cheaper) for ML workloads while taking measures to ensure the service reliability Implemented GPUs on GKE to harness benefits of managed services & auto-scaling capabilities",
		impact: "10x increase in capacity while the right tradeoff between cost and performance. Optimised and modern architecture to roll out new features and services in 2021 and beyond. ISVs | Infra Modernization",
		metricHeadline:
			"10x increase in capacity while the right tradeoff between cost and performance.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-improving-scalability-dr-on-gcp",
		client: "Improving Scalability & DR on GCP",
		region: "AMER",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Improving Scalability & DR on GCP",
		summary:
			"Leveraging GKE with Terraform for minimal ops overhead. Enabling best practices to ensure cost optimization and security",
		businessContext:
			"Improve Scalability: The optimization activities through their application could take up to 12 hours leading to most Devops activities to be outsourced Setup Failover and DR: Opsramp have primary & secondary pods deployed across regions / data centers and cloud providers",
		solution:
			"By leveraging Terraform IaC, OpsRamp can continuously integrate & deploy their pods with minimal operational overhead, enabling their adoption of GCP and moving away from other public clouds Scheduling, right-sizing and suggesting appropriate GCP resources for compute & storage based on requirements to ensure cost-optimization By following best practices for naming conventions, networking and IAM, resource hierarchy, live migration etc. - Searce is enabling OpsRamp to function with no downtime on GCP.. They will be able to move future client workloads with the same conventions and easily expand the infrastructure.",
		impact: "Platform Tech Stack Increased scalability with reduced operational overhead ~20% Cost Reduction Seamless Transition ISVs | Infra Modernization",
		metricHeadline:
			"Platform Tech Stack Increased scalability with reduced operational overhead ~20% Cost Reduction Seamless Transition ISVs |…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-improving-performance-for-saas-platform",
		client: "Improving Performance for SaaS Platform",
		region: "AMER",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Improving Performance for SaaS Platform",
		summary:
			"Leveraging IaaC for automation, robust DR setup and monitoring of applications in place to optimize performance",
		businessContext:
			"Currently hosted on heroku, Inmotion hosting and Rackspace and are looking forward to use the services offered by GCP to optimise the performance and working of their infrastructure. Develop an effective and efficient engagement road-map to ensure that the client's team is positioned for success during and after the project delivery.",
		solution:
			"GCP infrastructure as per best practices using IaaC. Highly available applications and databases. Ability to restore a corrupted or lost application within 2-4 hours from a previous snapshot. Similar or better performance of applications and database than current. Daily full backups with database log backups up to 15-minute intervals. Monitoring of production applications. Scheduled maintenance during non-critical working hours.",
		impact: "Successful running of application and databases on GCP cloud. Achieved better performance compared to existing cloud vendors with optimised cost. Visibility of applications and databases with monitoring & logging capabilities ISVs | Infra Modernization",
		metricHeadline: "Successful running of application and databases on GCP cloud.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-moving-elasticsearch-to-gcp-alphasense",
		client: "Moving Elasticsearch to GCP Alphasense",
		region: "AMER",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Going Cloud Agnostic with GCP",
		summary:
			"Migrated from AWS ECS clusters to superior GKE. Leverage IaaC to automate infrastructure. Moving Elasticsearch to GCP",
		businessContext:
			"Alphasense runs its production Infra on Kops cluster on AWS and has an intricate infrastructure comprising numerous tightly-coupled components. The team has a vision to make their infrastructure cloud agnostic and running a mini-version of their infrastructure is the first step in realizing the vision",
		solution:
			"Successful deployment of GCP infrastructure as per best practices keeping security as a focal point of concern. Deployment of GKE, GKE connect to AWS Deployment of microservices/applications in GKE on AWS cluster using ACM Gitops Installed & Configured Prometheus, Grafana & Jaeger for Service mesh and Telemetry for Anthos cluster on AWS Secret Management using Hashicorp Vault on AWS.",
		impact: "Platform Tech Stack Successful deployment of GCP infrastructure as per best practices adhering compliance requirements. AlphaSense is now able to run applications on GKE on AWS and use ACM Gitops for deployment. This help them achieve their goal of being cloud agnostic Prometheus, Grafana, Jaeger, Hashicorp vault, Nginx, GCP & AWS native services. ISVs | Infra Modernization",
		metricHeadline:
			"Platform Tech Stack Successful deployment of GCP infrastructure as per best practices adhering compliance requirements.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-overall-gcp-cost-of-ownership",
		client: "Overall GCP cost of ownership",
		region: "AMER",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Leveraging the Best of Kubernetes with GCP",
		summary:
			"Migrated from AWS ECS clusters to superior GKE. Leverage IaaC to automate infrastructure. Moving Elasticsearch to GCP",
		businessContext:
			"Migrated from AWS ECS clusters to superior GKE. Leverage IaaC to automate infrastructure. Moving Elasticsearch to GCP",
		solution:
			"Onclusive currently runs their infrastructure on AWS. All of the services are containerized and deployed on ECS clusters. Being a data intensive business, Onclusive processes huge amounts of data and runs a large deployment of 90+ nodes of ElasticSearch. Optimizing the overall costs. GCP infrastructure as per best practices using IaaC. Modernize their infrastructure by moving away from proprietary container orchestration platforms and deploying their services in an open and Kubernetes based environment. Implementation of Elasticsearch clusters on GCP. Demonstrate GKE scaling based on Celery queue depth.",
		impact: "Achieved scalability of applications on GKE using PVMs based on Celery queue depth. Overall GCP cost of ownership is 20%+ less than the existing setup on AWS. ElasticSearch performance is comparable to that of AWS cluster.",
		metricHeadline:
			"Overall GCP cost of ownership is 20%+ less than the existing setup on AWS.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-searce-team",
		client: "Searce team",
		region: "APAC",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "GCP infrastructure deployment automation",
		summary:
			"Searce team had to standardise resource deployment process for Networking & Project creation for MerkleScience APAC",
		businessContext:
			"MerkleScience runs many applications, which need to be deployed frequently depending upon the business needs There was also a need to build automation for Doppler Provider, Secrets, Resources Automation of database instance provisioning & dump and restore was to be performed Configure Trigger for production deployments",
		solution:
			"Deploy all four application to app engine triggering deployment through Celery Author terraform for Doppler Author terraform script to create PostgreSQL private instance and backup scripts for database migration Configure trigger for production deployment on CloudBuild",
		impact: "Ease of management of infrastructure Automation of complete business use-case Effective utilization of Resources ISVs | Infra Modernization",
		metricHeadline:
			"Ease of management of infrastructure Automation of complete business use-case Effective utilization of Resources ISVs | Infra…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-polygon",
		client: "Polygon",
		region: "APAC",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "$23mn/5 Years Greenfield GCP Commit",
		summary:
			"An AWS takeout for one of the largest Web3 Ecosystems worldwide with 200M unique addresses, 100+ validators and 960M total transactions processed",
		businessContext:
			"Polygon, a Layer 2 blockchain, aims to make blockchain technology accessible to the masses Wanted to expand their GTM strategy by listing their products on GCP Marketplace and further partner with Alphabet on consumer initiatives to increase their market share As a long-term AWS customer, Polygon needed more confidence on GCP infrastructure capabilities, especially for their new product roll-out (zkEVM)",
		solution:
			"Listed Polygon POS and Edge in GCP Marketplace Delivered comprehensive GCP training workshops to the Polygon Infra and Data team Searce was instrumental in developing a series of successful POCs for various Polygon tooling/stress tests which highlighted our enterprise-grade technical capabilities as well as GCP's superior performance and cost-savings over AWS Strong alignment with Polygon's Engineering and Business Development team to influence their product and future roadmap",
		impact: "Platform ISVs | Infra Modernization Tech Stack Successful listing of Polygon POS and Edge in GCP Marketplace drove top-line impact for Polygon Polygon was confident in our technical and delivery capabilities for a full migration of their AWS to GCP for Polygon's various workstreams (AWS Web3 tech infra, DevNets, Web2 Tech Stack, and New Business). Migration kicked off Google's infra tech stack was chosen to optimize hardware acceleration and algorithmic optimization to foster innovation in",
		metricHeadline:
			"Platform ISVs | Infra Modernization Tech Stack Successful listing of Polygon POS and Edge in GCP Marketplace drove top-line…",
		techStack:
			"Stack, and New Business). Migration kicked off, Google's infra tech stack was chosen to optimize hardware",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-kanarys",
		client: "Kanarys",
		region: "AMER",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Developed & Upgraded Looker Dashboards",
		summary:
			"Developed & upgraded Looker dashboards for different product lines with a final aim to embed them in client's native application. These dashboards are used by external users for data insights & decision making.",
		businessContext:
			"Kanarys had a roadmap for developing, upgrading and deploying advanced and intuitive Looker dashboards on their platform Development of advance KPIs in lookml, which were originally built in python Data availability to the users based on their company ID and permissions in the application.",
		solution:
			"Built explores and dashboards based on the business requirements for Product owners to explore data and make quicker decisions. Created multiple Derived tables to meet the business needs and get the KPIs correct Built Demo Dashboards in looker for clients to showcase Business impacts with provided analysis",
		impact: "New explores and additional KPIs enabled real-time data explorations and analysis through Looker Python Algorithms were migrated to lookml which was much easier for the users to explore Users were able to explore the data for added analysis Business Dashboards were embedded in the front-end application which could be shared with their respective clients",
		metricHeadline:
			"New explores and additional KPIs enabled real-time data explorations and analysis through Looker Python Algorithms were…",
		techStack: "Looker",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-workload",
		client: "Workload",
		region: "APAC",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Improving Security for Customer Analytics",
		summary:
			"Implementing security best practices by a cloud audit resulting into improved latency, better security posture",
		businessContext:
			"Customer wants an audit and implementation of security best practices. Data (GCS, GCE, SQL) encryption via Customer managed encryption method. Workload was spread across the multiple regions that needed to be migrated in single region. Control over the internal use web tools. Looking for real time network threat detection and monitoring.",
		solution:
			"Performed security audit and configuration of security best practices. Segregation of duties is implemented for KMS and changed the encryption methods for all data (GCS. GCE, SQL) and migrate all the workload in a single region. Configured IAP to secure internal web tools, and redesign the network. IDS setup and detailed monitoring of infra is configured.",
		impact: "Improved latency. Secured data and infrastructure. Better access and management control on various resources. Separate environments for production and staging. ISVs | Data & Analytics",
		metricHeadline: "Improved latency.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-robust-scalable-infra-for-cdp-client",
		client: "Robust Scalable Infra for CDP Client",
		region: "APAC",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Robust Scalable Infra for CDP Client",
		summary:
			"GKE with autoscaling to host microservices. Highly scalable database to process, store billions of IDs. BQ for analytics",
		businessContext:
			"GKE with autoscaling to host microservices. Highly scalable database to process, store billions of IDs. BQ for analytics",
		solution:
			"APAC Migrate entire infrastructure consisting of 100+ microservices and all complex data workflows running on Oozie to GCP Require high memory and row oriented database to process and store 20+ Billion ID's in a scalable and cost effective way Reduce management overhead with autoscaling. Optimize code changes and run data workflows for 50+ data partners. GDPR compliant Upgrade spark 2.1 to spark 2.4. Migrate 80+ spark jobs running on EMR Enabled our customer to leverage the scalability of high memory database to cater to the growing demand of processing and storing billions of IDs. Migrated Aerospike clusters to achieving 1 million writes/sec on GCP Deployed all 100+ microservices in GKE, migrated 500TB data using STS and integrated monitoring with infrastructure/application and reduced operational overhead Successfully Migrated 80+ spark jobs and ran all data workflows on dataproc and integrated with BigQuery for analyzing terabytes of ETL data for business reporting",
		impact: "Platform ISVs | Data & Analytics Tech Stack",
		metricHeadline: "Platform ISVs | Data & Analytics Tech Stack",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-model-training-time",
		client: "Model training time",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Refactor fastai-Resnet34 model to run on A100 GPU",
		summary:
			"Picquora Slashes Training Time by 46% with A100 GPUs for Faster Automobile Inspections",
		businessContext:
			"Picquora's existing P100 GPUs, while functional, were not powerful enough to handle the heavy compute and memory requirements of their models These also demanded more processing power for complex tasks",
		solution:
			"Established meticulous A100 development environment to ensure compatibility with all essential libraries required for car inspections Implemented code refactoring with A100 optimization, allowing the code to take full advantage of the hardware's capabilities Unlocked advanced techniques for efficiency such as distributed training, multi-worker data loading, and mixed precision",
		impact: "Model training time was slashed by nearly 50% - originally taking 70 minutes for 20 epochs, this was brought down to just 38 minutes Achieved 46% improvement using single-machine multi-GPU training Accuracy remained high throughout at 97%, all enabling faster analysis and model performance, & lower operational costs Vehicle inspection | Applied AI",
		metricHeadline:
			"Model training time was slashed by nearly 50% - originally taking 70 minutes for 20 epochs, this was brought down to just 38…",
		techStack: "Vertex AI, Cloud GPU Cloud TPU",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-zolo-wants-to-migrate-its-infra-from-aws-to-gcp",
		client: "Zolo wants to migrate its infra from AWS to GCP",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Zolo wants to migrate its infra from AWS to GCP",
		summary: "Searce to perform AWS EKS to Google GKE and RDS to Cloud SQL migrations.",
		businessContext:
			"Zolostays used to manage their entire infrastructure manually in AWS. Manually scaling up/down EKS nodes before/after business hours for cost optimization. High latency on external endpoints while running workload on EKS. Absence of backup and restore service for EKS.",
		solution:
			"Automated Infrastructure management of GCP resources using IaC Terraform. Automated GKE node scheduling process using Cloud Function and Cloud Scheduler. After migrating workloads to GKE, latency on external endpoints has been reduced significantly. Implemented backup and restore plan for Staging and Production GKE clusters.",
		impact: "Cost optimization from a on Premise setup Efficiency in Latency PG Accomodation | Infra Modernization",
		metricHeadline:
			"Cost optimization from a on Premise setup Efficiency in Latency PG Accomodation | Infra Modernization",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-eztech",
		client: "EZTech",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "RackWare RMM is the solution provided.",
		summary:
			"Seamlessly migrate EZTech's on-prem infra to Google Cloud using RackWare RMM for better scalability and performance with low downtime.",
		businessContext:
			"EZTech is migrating its on-premise infrastructure to Google Cloud. The goal is to enhance scalability, reliability, and performance RackWare RMM is used to replicate VM workloads to GCE The plan focuses on a low-downtime migration with minimal disruption",
		solution:
			"RackWare RMM migrates EZTech's on-premise infrastructure to Google Cloud It replicates VM workloads to Compute Engine via secure OS-level SSH tunnel The tool is origin-agnostic, performing file-level sync for VMs or physical machines This ensures a low-downtime migration to enhance scalability and performance",
		impact: "Migration enhances EZTech's scalability, reliability, and performance RackWare RMM ensures low-downtime with minimal operational disruption Google Cloud tools like IAP and SCC provide secure access and threat detection Provides centralized visibility for improved compliance and risk management and Cost optimisation by disk resizing during migration.",
		metricHeadline:
			"Migration enhances EZTech's scalability, reliability, and performance RackWare RMM ensures low-downtime with minimal…",
		techStack: "Security Command Center, Compute Engine",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-aws-to-gcp-migration-for-location-intelligence",
		client: "AWS to GCP Migration for Location Intelligence.",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to GCP Migration for Location Intelligence.",
		summary:
			"AWS Takeout for Retail Expansion Platform: Migrated data and applications to GCP for improved scalability and cost-efficiency.",
		businessContext:
			"GeoIQ migrated non-prod and prod environments from AWS to GCP for enhanced APAC and US customer service.",
		solution:
			"GCP LZ Setup, 40+ VM Migration, 350GB Data Migration to GCP. 55+ TB Data Transfer (S3 to GCS), 120+ GB File System Migration (EFS to Filestore), Places-Roads Migration to Cloud Run with CI/CD.",
		impact: "Secure GCP LZ, Scalability, Enhanced Security, Improved Observability, Reduced Overhead, Efficient CI/CD. AI based Prediction | Cloud Modernization Compute Cloud Cloud Cloud Cloud RPuunb/Sub Engine SQL Storage Build Cloud Filestore Cloud Cloud Functions CDN Armor",
		metricHeadline:
			"Secure GCP LZ, Scalability, Enhanced Security, Improved Observability, Reduced Overhead, Efficient CI/CD.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-platform-currently",
		client: "platform currently",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Consultation on Azure to GCP Migration",
		summary: "Provided consultation on infra and Data services offered in GCP",
		businessContext:
			"CustomerXI's platform helps restaurants improve customer engagement. The platform currently runs on Azure Cloud. CustomerXi's team needs Searce's help to migrate compute workload and data from Azure to GCP quickly.",
		solution:
			"Help customer to design solution for migration of non-prod env using GCP best practices. Assisted with GCP migration, including a review of the Landing Zone and recommendations for best practices. Assisted with IaC standards using Terraform and developed manifest files for GKE Application Deployment. Migrated CICD from Azure DevOps to GCP Cloud Build and migrated DNS.",
		impact: "CustomerX.i Team was provided with a detailed approach to GCP infrastructure deployments. CustomerX.i was informed about GCP's segregated organizational structure for potential future benefits. CustomerX.i was guided on GCP infrastructure optimization and FinOps using billing alerts and resource monitoring. CustomerXi provided Terraform code and docs to replicate their Production environment. Restaurent | Cloud Modernization Cloud Dataflow CDN",
		metricHeadline:
			"CustomerX.i Team was provided with a detailed approach to GCP infrastructure deployments.",
		techStack: "Engine Engine, Artifact Cloud Registry Armor",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-otto-js",
		client: "Otto-JS",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to GCP Migration & Code Refactoring",
		summary:
			"Otto-JS wanted to migrate the existing Infra and application from AWS to GCP and leverage GCP Infra and Data services",
		businessContext:
			"Otto-JS aimed to migrate applications, Lambda functions, and EventBridge rules from AWS to GCP Migration was intended to harness GCP's cost-efficient, robust infrastructure & serverless capabilities Otto-JS sought to extend its services by integrating with GCP's serverless architecture Key GCP data services like Cloud Run, Cloud Functions, Pub/Sub, BigQuery & Cloud SQL were chosen in this transition",
		solution:
			"Set up Dev and Prod environments to support Otto's migration from AWS to GCP Deployed scalable, serverless Cloud Run services for cost-effective, easy app deployment Leveraged STS for quick data transfer from AWS S3 to GCS buckets and Pub/Sub for messaging. Used DMS for seamless database migration to Cloud SQL, ensuring primary propagation for a smooth cutover",
		impact: "Automation: Infra hosted on GCP platform with resources being deployed through Terraform. Cloud Run Serverless framework to ensure the high availability of services. Secured the Cloud Run services with Cloud Armor along with features like DDOS/OSWAP top 10 attacks Seamless refactoring of Lambda code to Cloud Run jobs with Event driven architecture for scheduling tasks. Digital Security and Compliance | Cloud Modernization Pub/Sub Cloud Cloud Storage Armor Cloud VPN",
		metricHeadline:
			"Secured the Cloud Run services with Cloud Armor along with features like DDOS/OSWAP top 10 attacks Seamless refactoring of…",
		techStack:
			"Compute Database Artifact Cloud Cloud RMuenmorystore Engine Migration Registry SQL, Service",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-sourseai",
		client: "SourseAI",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "SaaS on GCP Marketplace",
		summary: "Enlisting Atlas Production Pilot on GCP Marketplace",
		businessContext:
			"Decision intelligence platform to optimize work capital with Business As part of its SaaS offering, SourseAI was looking for ways to help their GCP based clients to maximize their usage of the service. SourseAI was to have customer visibility and revenue generation. Through the GCP marketplace Integration, SourseAI will be able to onboard customers from a wide range of industries.",
		solution:
			"Searce offered a streamlined billing and notification process to simplify client onboarding on Atlas Production Pilot. Enhanced the product's sign-up process by utilizing the marketplace solution. Incorporated and Integrated the SaaS product into Google marketplace listing.",
		impact: "Through the implementation on the marketplace, SourseAI will be able to onboard customers who already use the services of Google Cloud Platform. PreBuilt AI for customer lifecycle Model Easy 1 Click SaaS Decision Intelligence Platform Global presence of Atlas Production Pilot on GCP Geo locations",
		metricHeadline:
			"PreBuilt AI for customer lifecycle Model Easy 1 Click SaaS Decision Intelligence Platform Global presence of Atlas Production…",
		techStack: "Google Cloud Marketplace",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-zoko",
		client: "Zoko",
		region: "APAC",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Replatforming & Consolidation to GCP GKE",
		summary: "Consolidating AWS and GCE workloads into GKE for multi-channel sales hub.",
		businessContext:
			"Zoko provides a central hub for Whatsapp based sales, marketing & customer support to its end users by integration with Whatsapp, Facebook & Instagram and the ecommerce integration with Shopify. Zoko wanted to migrate their existing services from AWS to GKE & replatform their existing workloads from GCE to GKE with the aim to consolidate their multi-cloud environment to GCP.",
		solution:
			"Zoko’s Facebook and WhatsApp related 24 services were swiftly migrated to GKE. The CI/CD was setup enabling quick & automated deployments. Migration of elastic from AWS marketplace to GCP marketplace was successfully done. IAM & Network best practices were followed to ensure secure & seamless connectivity.",
		impact: "Facebook & WhatsApp workloads migrated to GCP GKE providing faster & automated code release with near zero downtime. Fully automated CI-CD pipeline. Secure connectivity between applications and GCP resources. Reduced latency due to private connection between services and increase in performance.",
		metricHeadline:
			"Facebook & WhatsApp workloads migrated to GCP GKE providing faster & automated code release with near zero downtime.",
		techStack: "Google Kubernetes Engine, Cloud SQL, Elastic, GCE",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-gwi",
		client: "GWI",
		region: "EMEA",
		industryCode: "TSS",
		industryName: "ISVs & Emerging Tech",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "App and Database Modernization for GWI",
		summary: "Migrating applications and ScyllaDB from GCE VMs to GKE cluster.",
		businessContext:
			"GWI runs their applications and databases on compute engine VMs. The VMs creating has spiralled out of control resulting in a large VM fleet. ScyllaDB is hosted on VMs and GWI is not successful in using Scylla manager in GCE. Multiple copies of the databases in multiple VMs. GWI wants to modernize and get better control of the infra, by moving to managed kubernetes for app and db.",
		solution:
			"Searce has identified a solution through R&D, to place ScyllaDB in the same GKE cluster. ScyllaDB deployment was done using Helm charts, which minimize operation overhead. Executed migration using Backup & restore in staging environment first and then in production successfully. Leverage Scylla manager for scheduling backups to GCS buckets.",
		impact: "Modernized applications hosted on managed Kubernetes clusters. 30% reduction in duplicate data and better control, scalability and performance at the database level by moving to GKE. Agility in scaling the infrastructure based on requirement.",
		metricHeadline:
			"30% reduction in duplicate data and better control, scalability and performance at the database level by moving to GKE.",
		techStack: "ScyllaDB, Helm charts, Google Kubernetes Engine, Cloud Storage, Scylla Manager",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-automated-tenant-onboarding-using-cdktf-and-terraform",
		client: "Automated Tenant Onboarding using CDKTF and Terraform",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Automated Tenant Onboarding using CDKTF and Terraform",
		summary:
			"Development friendly CDK for Terraform using Python to deploy Google Cloud for creating multiple environment the app control plane & app node deployment to setup multi-cloud setup",
		businessContext:
			"Automate Google Cloud resources deployment for multiple environments Creating Python compatible scripts for automating the infrastructure deployment process via Terraform(IaC) for multiple environments and the tenant onboarding. Integrating Google Cloud Storage(GCS) as a storage client for the application",
		solution:
			"Creating the Abstraction class to use GCS as the storage client with the methods already existing for AWS/Azure for the CRUD operation as a GCS connector Designing the flow of the IaC implementation using CDK for terraform via Python programming language. integration with the CI/CD flow with the business logic to provision GCS buckets for each clients/tenants/environments",
		impact: "Extension of the application to Google Cloud ensuring seamless integrations with the Google Cloud Services and security best practices Availability of multi-environment and automated tenant onboarding process and managing the infrastructure using Python as programming language for CDKTF for state management Real Time Data Cloud | Infra Modernization",
		metricHeadline:
			"Extension of the application to Google Cloud ensuring seamless integrations with the Google Cloud Services and security best…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-migration-chapter-apps-the-customer",
		client: "Migration - Chapter Apps The customer",
		region: "APAC",
		industryCode: "PSE",
		industryName: "Public Sector & Education (PSE)",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "AWS to Google Cloud Migration",
		summary: "AWS to Google Cloud Migration - Chapter Apps",
		businessContext:
			"The customer wanted to migrate customer applications from AWS to Google Cloud for improved agility, cost and security optimization. APAC",
		solution:
			"Migration of Chapter Apps from AWS to Google Cloud (Database + Application ) Jenkins CICD configuration S3 to GCS data migration",
		impact: "Cost optimisation Improved performance and scalability Enhanced security Training & Learning applications | Cloud",
		metricHeadline:
			"Cost optimisation Improved performance and scalability Enhanced security Training & Learning applications | Cloud",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-azure-to-gcp-migration",
		client: "Azure to GCP Migration",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Azure to GCP Migration",
		summary: "Migration from Azure to Google Cloud Platform",
		businessContext:
			"Wobot Infrastructure hosted in Azure cloud and they want to migrate Workloads to GCP. Wobot wants to migrate Azure devops pipelines to Bitbucket Pipelines. APAC",
		solution:
			"Established the landing zone and deployed services in GCP. Configured networking and enforced security policies to ensure a robust infrastructure. Utilized GCP's managed tools to seamlessly migrate VMs and GCS buckets. Developed Bitbucket pipelines to correspond with Azure DevOps pipelines.",
		impact: "With Landing Zone implementation Wobot workloads got more security. Migrated workloads and pipelines with best practices. Modernization and improving the infrastructure. Software Development | Cloud Modernization",
		metricHeadline: "With Landing Zone implementation Wobot workloads got more security.",
		techStack: "Cloud Compute GKE, Engine, GCS",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-cloud-armour-policy",
		client: "Cloud armour policy",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Real Estate",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "Application Modernization for SquareYards",
		summary:
			"Cloud armour policy is implemented to improve security and Cloud build used for CI-CD deployment",
		businessContext:
			"Squareyards has it's infrastructure on AWS and they were exploring a cost effective and efficient platform alternative to AWS Squareyards wants to modernize their cloud infrastructure, get a better grasp of their cloud cost and introduce DevOps culture to their engineering team. Squareyards partnered with Searce to migrate from AWS to GCP for high availability, operational efficiency and better cost visibility and optimization",
		solution:
			"The primary webapp of Squareyards was deployed on GKE, in highly available and scalable manner. The application could scale both at the node level and also at the pod level, bringing better availability to the application. Cloud Armor policies were implemented to protect website from well known website vulnerabilities and to protect it from the potential attackers Introduced DevOps culture to the company by implementing CI/CD pipelines using GCP native tool - CloudBuild.",
		impact: "Cost efficiency achieved with high performance Operational efficiency and increased availability with GKE DevOps culture ensured near zero downtime deployments and greater stability Real Estate | Data & Analytics",
		metricHeadline:
			"Cost efficiency achieved with high performance Operational efficiency and increased availability with GKE DevOps culture…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-load-testing-strategy",
		client: "Load testing strategy",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Database Audit and Performance Optimization",
		summary:
			"Successfully audit various areas of databases, gather metrics and document issues and recommendations",
		businessContext:
			"Evaluating the impact of memory consuming Instances and suggesting parameters to decrease memory usage / CPU usage across staging & production Instances. Increasing query handling across all the environments. Load testing strategy was un-defined which is systematically required to evaluate server performance.",
		solution:
			"Ran load tests using the open source tool, sysbench. The performance impact of changing some of the parameters were demonstrated to the customer which enabled them to make better decisions on which parameter values to use in production Identified TokuDB as the performance bottleneck through a series of tests and observation. TokuDB was the main memory hogger. Resolved the TokuDB related memory issue by performing a manual upgrade to the newer version",
		impact: "Better query performance. 35% faster query processing time. Improved server / database performance. Moving to SSD's & increasing RAM along with upgrading MySQL database to percona 8.0.30 improved performance on the production serve multifold. Marketing | Data & Analytics",
		metricHeadline: "35% faster query processing time.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-aws-dynamodb-to-bigquery-alphasense",
		client: "AWS DynamoDB to BigQuery AlphaSense",
		region: "AMER",
		industryCode: "TSS",
		industryName: "ITES & Professional Services",
		service: "data_analytics",
		practiceLabel: "Data & Analytics",
		title: "AWS DynamoDB to GCP BigQuery Migration",
		summary:
			"Created a scalable, robust & cost-effective solution using GCP-native services, which migrate data from AWS DynamoDB to BigQuery",
		businessContext:
			"AlphaSense is currently using the AWS DynamoDB. Create a single source of truth for this data which can be utilized by their BI and Analytical platforms. Successfully migrate data from DynamoDB to Google Cloud BigQuery",
		solution:
			"Understood DynamoDB schema and create data models on BigQuery. Used Google cloud-native services to replicate historical data from the DynamoDB table (prod_stored_meta) to GCP BigQuery. Implemented batch data pipeline and streaming data pipeline. Migrated historical data from DynamoDB to GCP BigQuery.",
		impact: "Created a single source of truth for this data that can be utilized by their BI & Analytics platforms. AlphaSense can derive more insights from this data and can make them available to their stakeholders. Market Intelligence | Data & Analytics",
		metricHeadline:
			"Created a single source of truth for this data that can be utilized by their BI & Analytics platforms.",
		techStack: "Dataflow Pub/sub, Cloud Storage",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-property-guru",
		client: "Property Guru",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Real Estate",
		service: "location_intelligence",
		practiceLabel: "Location Intelligence",
		title: "Helping Real estate convert online customers",
		summary: "Give online customer local location context",
		businessContext:
			"Property Guru is the number 1 real estate aggregator headquartered in Singapore where you can find thousands of properties for sale and rent with detailed information about each property, including maps and photos In order to convert online customers, they need to be given a lot of context about the property which can be achieved through surrounding locational intelligence of the property",
		solution:
			"Property Guru's focus is on improving customer experience when users visit their online platform to evaluate properties. This is done by giving more context about the property's location, distances to nearby POI (like hospital, school etc) Transit time can be calculated from the property User can view street view images for outer look and feel",
		impact: "User find it easier to evaluate a property based on local location and nearby point of interest context Better user experience means more conversions and better user retention Real Estate | Location Intelligence",
		metricHeadline:
			"User find it easier to evaluate a property based on local location and nearby point of interest context Better user experience…",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-ems-integration-ott",
		client: "EMS integration OTT",
		region: "APAC",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Agentic AI Document Processing on Google Cloud",
		summary:
			"Serverless Agentic AI solution on Google Cloud to automate extraction of Agency, PTAX, and Business property documents with real-time EMS integration",
		businessContext:
			"OTT is a leading Singapore-based real estate agency leveraging PropTech tools to empower agents and manage residential, commercial, and industrial properties Processes high volumes of agreements, tax notices, business listings Manual data entry was time-consuming and error-prone The initiative aimed to digitize document workflows, improve productivity, and integrate extracted data directly into EMS",
		solution:
			"A serverless, event-driven architecture on Google Cloud using Cloud Storage triggers, Cloud Functions orchestration, Vertex AI Gemini 2.5 Flash agents for document extraction. Solution processes Agency, PTAX, Business documents via specialized AI agents, applies business validations, standardizes formats, integrates directly with Fitprise EMS APIs in real time",
		impact: "Eliminated manual data entry for Agency, PTAX, Business documents, significantly improving operational efficiency Ensured standardized data formatting, high extraction accuracy through deterministic LLM configurations, and real-time EMS synchronization Parallel chunking enabled processing of 50+ page PDFs without performance degradation Real estate agency and property services sector | Practice SBU - To be Discarded",
		metricHeadline:
			"Eliminated manual data entry for Agency, PTAX, Business documents, significantly improving operational efficiency Ensured…",
		techStack: "Cloud Run, Cloud Cloud, BigQuery",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-recommendation-engine-using-vertex-vector-search",
		client: "Recommendation Engine using vertex vector search",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Recommendation Engine using vertex vector search",
		summary: "Built a vector search engine using Vertex AI services",
		businessContext:
			"Current keyword-based search fails to fully capture the nuances of user preferences, resulting in less relevant recommendations Requires a search capability that can efficiently incorporate the user preferences and intent, beyond the simple keyword matching",
		solution:
			"Used Gemini 1.5 Pro to improve classifications by leveraging insights from previous categories Employed Gemmi Flash model to generate relevant tags for easy searchability Developed a pipeline integrating text and image embedding models for enhanced recommendations Integrated image recommendations with text embedding to provide refined, relevant results",
		impact: "Enhanced user experience and engagement supported by robust search engine technology Significantly improved search accuracy and the efficiency to better match user's queries with relevant places Enabling GenAI generated additional tags of places based on the existing data and user metrics. Reduce search response times by 20-30%, leading to quicker results and a smoother user experience",
		metricHeadline:
			"Reduce search response times by 20-30%, leading to quicker results and a smoother user experience",
		techStack: "Vertex AI, Cloud Run",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-thetalake",
		client: "ThetaLake",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Audio/video summarization & diarization via Gemini",
		summary:
			"Automated processing and analysis for pre-recorded videos/audios using Gemini-based summarization, diarization, language and bad audio detection",
		businessContext:
			"ThetaLake's existing methods for video and audio analysis and summarization lacked the necessary accuracy for their use cases They required better evaluation of pre-recorded videos and audios Searce used Gemini for summarization, diarization, language and bad audio detection, while optimizing token usage and reducing processing time.",
		solution:
			"Developed code and prompts for Gemini-based analysis Summarized video recordings, flagged risky behaviour, removed silences to reduce tokens and optimized processing speed, implemented audio diarization and labelled speakers, implemented language and bad audio detection Fine-tuned prompts and handled accent, noise and multi language speakers Shared outputs and code notebooks with the client",
		impact: "The solution optimized the token usage, thus improving processing speeds and reducing the costs. Despite Gemini's limitations, the accuracy of the outputs produced were significantly better than the client's existing methods for most of the deliverables, thus meeting their requirements effectively.",
		metricHeadline:
			"The solution optimized the token usage, thus improving processing speeds and reducing the costs.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-main-challenge",
		client: "Main challenge",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Real Estate",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Parsing unstructured documents",
		summary:
			"Automate the process of extracting relevant fields from various structured & unstructured documents",
		businessContext:
			"Customer wants to extract relevant fields like address, price, building size, etc. from various documents having structured & unstructured fields. Main challenge is to identify patterns within the documents in order to accurately extract the unstructured fields.",
		solution:
			"Extracted key-value pairs using Google Doc AI form parser. Identified patterns & accordingly extracted fields from the documents using Google Doc AI OCR parser. Accurately parsed address from text by using required libraries like pyap and usaddresss. Successfully extracted fields like Email and phone number by using regex expression.",
		impact: "Automated the manual process of reviewing documents. Reduced time taken to process the document from ~ 10 mins to 30-45 seconds Saved cost & increased profitability by processing more documents in less time. Real Estate | Applied AI",
		metricHeadline:
			"Reduced time taken to process the document from ~ 10 mins to 30-45 seconds Saved cost & increased profitability by processing…",
		techStack: "Cloud Functions Cloud SQL",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-streamflow-forecasting-using-automl",
		client: "Streamflow Forecasting using AutoML",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Real Estate",
		service: "ai_automation",
		practiceLabel: "Applied AI",
		title: "Streamflow Forecasting using AutoML",
		summary:
			"Developed an AutoML Forecasting model with training and inference pipeline, to predict streamflow based on historical data.",
		businessContext:
			"Developed an AutoML Forecasting model with training and inference pipeline, to predict streamflow based on historical data.",
		solution:
			"The Client wants to develop a state of the art Deep Learning model capable of predicting streamflow on gauges based on historical data. The Client also wants us to build a training and inference pipeline on Google Cloud Platform so that they can focus more on experimentation part. Performed EDA on the Streamflow data, this helped in selecting the important features and also the Forecast horizon and Context window. Trained an AutoML Forecasting model on the Streamflow data. Built Training and Inference pipeline which triggers when a csv is uploaded to the target bucket. Also added email notification service for training completion and batch prediction.",
		impact: "Can focus more on the experimentation part as the training and inference pipeline is in place. Cloud Functions Vertex AI Auto ML Real Estate | Applied AI",
		metricHeadline:
			"Can focus more on the experimentation part as the training and inference pipeline is in place.",
		techStack: "",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
	{
		id: "ref-swimply-s-search-gets-smarter-with-searce",
		client: "Swimply's Search Gets Smarter with Searce",
		region: "AMER",
		industryCode: "MISC",
		industryName: "Other Industries",
		service: "cloud_modernization",
		practiceLabel: "Infrastructure Modernization",
		title: "Swimply's Search Gets Smarter with Searce",
		summary: "Building a GenAI powered Search Engine on Google Cloud Platform",
		businessContext:
			'Swimply, a leading online marketplace for pool and sports venue rentals, faced a hurdle with its existing search functionality. Traditional keyword-based search struggled to capture the nuances of user queries, particularly those involving visual elements like "sunset view" or amenities like "seating areas." This resulted in a less than ideal user experience and potentially missed booking opportunities.',
		solution:
			"Built a Generative AI-powered search engine built on GCP. The solution leverages Vertex Embeddings API and Vertex Vector Search to create a multi-modal search space that considers both text data (property descriptions, amenities) and image data.",
		impact: "Enhanced Search Relevance: User queries are now matched against a richer data pool, leading to more relevant and accurate search results. Swimply users can now find their perfect pool or court based on specific criteria that extend beyond simple keywords. Improved User Experience: With a more intuitive search experience, Swimply users can discover hidden gems and unique offerings they might have missed with a traditional search. This empowers them to make informed booking decisions and ultimately enjoy a more fulfilling experience.",
		metricHeadline:
			"Enhanced Search Relevance: User queries are now matched against a richer data pool, leading to more relevant and accurate…",
		techStack: "Google Cloud Platform, Apigee API Management, VertexAI",
		cloudProvider: "gcp",
		url: "https://www.searce.com/insights/case-studies",
	},
];
