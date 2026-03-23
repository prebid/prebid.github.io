---
layout: page_v2
title: Prebid Sales Agent - Deploy to Google Cloud Run
description: Deploy the Prebid Sales Agent on Google Cloud Run with Cloud SQL for PostgreSQL
sidebarType: 10
---

# Prebid Sales Agent - Deploy to Google Cloud Run
{: .no_toc}

- TOC
{:toc}

## Overview

Google Cloud Run provides a serverless container platform that scales automatically based on traffic. This guide walks through deploying the Prebid Sales Agent on Cloud Run with Cloud SQL for PostgreSQL as the database backend.

This deployment is well-suited for organizations already in the Google Cloud ecosystem, particularly those using Google Ad Manager as their ad server.

## Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud`) installed and authenticated
- A GCP project with billing enabled
- The following APIs enabled:
  - Cloud Run
  - Cloud SQL Admin
  - Artifact Registry
  - Secret Manager
  - Serverless VPC Access (for private Cloud SQL connections)

Enable the required APIs:

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  vpcaccess.googleapis.com \
  --project=your-project-id
```

## Step 1: Create a Cloud SQL Instance

Create a PostgreSQL instance:

```bash
gcloud sql instances create adcp-sales-db \
  --database-version=POSTGRES_17 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-size=10GB \
  --storage-auto-increase \
  --project=your-project-id
```

Create the database and user:

```bash
# Set the default user password
gcloud sql users set-password postgres \
  --instance=adcp-sales-db \
  --password=your-db-password \
  --project=your-project-id

# Create the application database
gcloud sql databases create adcp_sales \
  --instance=adcp-sales-db \
  --project=your-project-id
```

Note the instance connection name for later:

```bash
gcloud sql instances describe adcp-sales-db \
  --format="value(connectionName)" \
  --project=your-project-id
# Output: your-project-id:us-central1:adcp-sales-db
```

## Step 2: Build and Push the Docker Image

### Create an Artifact Registry Repository

```bash
gcloud artifacts repositories create adcp-sales \
  --repository-format=docker \
  --location=us-central1 \
  --project=your-project-id
```

### Build and Push

```bash
# Configure Docker for Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build the image
docker build -t us-central1-docker.pkg.dev/your-project-id/adcp-sales/adcp-sales-agent:latest .

# Push the image
docker push us-central1-docker.pkg.dev/your-project-id/adcp-sales/adcp-sales-agent:latest
```

## Step 3: Create Secrets

Store sensitive values in Secret Manager:

```bash
# Database URL
echo -n "postgresql+asyncpg://postgres:your-db-password@/adcp_sales?host=/cloudsql/your-project-id:us-central1:adcp-sales-db" | \
  gcloud secrets create adcp-database-url --data-file=- --project=your-project-id

# Encryption key
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode(), end='')" | \
  gcloud secrets create adcp-encryption-key --data-file=- --project=your-project-id

# Google OAuth credentials (for Admin UI)
echo -n "your-oauth-client-id" | \
  gcloud secrets create adcp-oauth-client-id --data-file=- --project=your-project-id

echo -n "your-oauth-client-secret" | \
  gcloud secrets create adcp-oauth-client-secret --data-file=- --project=your-project-id
```

## Step 4: Create a VPC Connector

A VPC connector allows Cloud Run to connect to Cloud SQL via private IP:

```bash
gcloud compute networks vpc-access connectors create adcp-vpc-connector \
  --region=us-central1 \
  --range=10.8.0.0/28 \
  --project=your-project-id
```

## Step 5: Deploy to Cloud Run

Deploy the container with all configuration:

```bash
gcloud run deploy adcp-sales \
  --image=us-central1-docker.pkg.dev/your-project-id/adcp-sales/adcp-sales-agent:latest \
  --platform=managed \
  --region=us-central1 \
  --port=8080 \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=1 \
  --max-instances=5 \
  --concurrency=80 \
  --timeout=300 \
  --allow-unauthenticated \
  --add-cloudsql-instances=your-project-id:us-central1:adcp-sales-db \
  --vpc-connector=adcp-vpc-connector \
  --set-env-vars="ENVIRONMENT=production,PRODUCTION=true,ADCP_SALES_PORT=8080,ADCP_SALES_HOST=0.0.0.0,ADCP_MULTI_TENANT=false,ADCP_AUTH_TEST_MODE=false,SKIP_NGINX=true,SKIP_CRON=false,CREATE_DEMO_TENANT=true" \
  --set-secrets="DATABASE_URL=adcp-database-url:latest,ENCRYPTION_KEY=adcp-encryption-key:latest,GAM_OAUTH_CLIENT_ID=adcp-oauth-client-id:latest,GAM_OAUTH_CLIENT_SECRET=adcp-oauth-client-secret:latest" \
  --project=your-project-id
```

<div class="alert alert-info" role="alert">
Set <code>SKIP_NGINX=true</code> on Cloud Run because Cloud Run handles TLS termination and load balancing. The internal nginx reverse proxy is not needed.
</div>

After deployment, note the service URL:

```bash
gcloud run services describe adcp-sales \
  --region=us-central1 \
  --format="value(status.url)" \
  --project=your-project-id
# Output: https://adcp-sales-xxxxxx-uc.a.run.app
```

## Step 6: Verify the Deployment

```bash
# Health check
curl https://adcp-sales-xxxxxx-uc.a.run.app/health

# View logs
gcloud run services logs read adcp-sales \
  --region=us-central1 \
  --project=your-project-id
```

Access the Admin UI at `https://adcp-sales-xxxxxx-uc.a.run.app/admin`.

## Step 7: Configure a Custom Domain

Map a custom domain to the Cloud Run service:

```bash
gcloud run domain-mappings create \
  --service=adcp-sales \
  --domain=adcp.yourcompany.com \
  --region=us-central1 \
  --project=your-project-id
```

Follow the output instructions to add the required DNS records. Cloud Run provisions a managed TLS certificate automatically.

Verify the mapping:

```bash
gcloud run domain-mappings describe \
  --domain=adcp.yourcompany.com \
  --region=us-central1 \
  --project=your-project-id
```

## IAM and Service Accounts

### Cloud Run Service Account

Create a dedicated service account for the Cloud Run service:

```bash
# Create service account
gcloud iam service-accounts create adcp-sales-runner \
  --display-name="ADCP Sales Agent Runner" \
  --project=your-project-id

# Grant Cloud SQL client role
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:adcp-sales-runner@your-project-id.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# Grant Secret Manager accessor role
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:adcp-sales-runner@your-project-id.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Update the Cloud Run service to use this service account
gcloud run services update adcp-sales \
  --service-account=adcp-sales-runner@your-project-id.iam.gserviceaccount.com \
  --region=us-central1 \
  --project=your-project-id
```

### GAM Service Account

If using Google Ad Manager, set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to a service account key file, or use Workload Identity Federation:

```bash
# Store the service account key as a secret
gcloud secrets create gam-service-account \
  --data-file=path/to/gam-service-account.json \
  --project=your-project-id

# Mount it as a volume in Cloud Run
gcloud run services update adcp-sales \
  --set-secrets="/app/gam-credentials.json=gam-service-account:latest" \
  --set-env-vars="GOOGLE_APPLICATION_CREDENTIALS=/app/gam-credentials.json,GCP_PROJECT_ID=your-project-id" \
  --region=us-central1 \
  --project=your-project-id
```

## Scaling Configuration

### Auto-Scaling Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| `--min-instances` | 1 | Minimum running instances (set to 0 for scale-to-zero) |
| `--max-instances` | 5 | Maximum instances under load |
| `--concurrency` | 80 | Requests per instance before scaling out |
| `--cpu` | 1 | CPU allocation per instance |
| `--memory` | 1Gi | Memory allocation per instance |
| `--timeout` | 300 | Maximum request duration in seconds |
{: .table .table-bordered .table-striped }

<div class="alert alert-info" role="alert">
Set <code>--min-instances=1</code> for production to avoid cold starts. The Sales Agent needs to run Alembic migrations and establish database connections on startup, which can take 10-30 seconds.
</div>

### Adjusting Scaling

```bash
gcloud run services update adcp-sales \
  --min-instances=2 \
  --max-instances=10 \
  --memory=2Gi \
  --cpu=2 \
  --region=us-central1 \
  --project=your-project-id
```

## Cloud SQL Configuration

### Connection Pooling

For high-traffic deployments, consider the Cloud SQL Auth Proxy with connection pooling, or use the built-in PgBouncer support:

```bash
gcloud run services update adcp-sales \
  --set-env-vars="USE_PGBOUNCER=true" \
  --region=us-central1 \
  --project=your-project-id
```

### High Availability

Upgrade the Cloud SQL instance for production workloads:

```bash
gcloud sql instances patch adcp-sales-db \
  --tier=db-custom-2-4096 \
  --availability-type=REGIONAL \
  --backup-start-time=02:00 \
  --enable-bin-log \
  --project=your-project-id
```

### Automated Backups

Enable automated backups:

```bash
gcloud sql instances patch adcp-sales-db \
  --backup-start-time=02:00 \
  --retained-backups-count=7 \
  --project=your-project-id
```

## Cost Estimate

| Component | Specification | Estimated Monthly Cost |
| --- | --- | --- |
| Cloud Run | 1 instance, 1 vCPU, 1 GB, always-on | ~$15 |
| Cloud Run | 2 instances, 1 vCPU, 1 GB, always-on | ~$30 |
| Cloud SQL | db-f1-micro, 10 GB | ~$10 |
| Cloud SQL | db-custom-2-4096, 20 GB, HA | ~$70 |
| Artifact Registry | 1 GB storage | ~$0.10 |
| Secret Manager | 5 secrets, 10K accesses | ~$0.03 |
| VPC Connector | Serverless VPC Access | ~$7 |
| Custom domain + TLS | Managed certificates | $0 |
| **Total (minimal)** | | **~$32/mo** |
| **Total (production)** | | **~$107/mo** |
{: .table .table-bordered .table-striped }

<div class="alert alert-info" role="alert">
Costs vary by region and usage. Check the <a href="https://cloud.google.com/pricing">GCP pricing calculator</a> for current rates. Scale-to-zero (<code>--min-instances=0</code>) can reduce costs significantly for low-traffic deployments but introduces cold start latency.
</div>

## Troubleshooting

### Deployment fails

```bash
# View detailed deployment logs
gcloud run services logs read adcp-sales --region=us-central1 --project=your-project-id --limit=50
```

Common causes:

- **Image pull failure**: Verify the image exists in Artifact Registry and the service account has `artifactregistry.reader` role
- **Secret access denied**: Ensure the service account has `secretmanager.secretAccessor` role
- **Health check timeout**: Increase `--timeout` and verify the `/health` endpoint works locally

### Cannot connect to Cloud SQL

- Verify the `--add-cloudsql-instances` flag matches your instance connection name
- Check that the VPC connector is in the same region as the Cloud SQL instance
- Verify `DATABASE_URL` uses the Unix socket path: `?host=/cloudsql/project:region:instance`
- Check Cloud SQL instance status: `gcloud sql instances describe adcp-sales-db --project=your-project-id`

### Cold start latency

- Set `--min-instances=1` or higher to keep instances warm
- Consider increasing `--cpu` to speed up startup
- Migrations run on first startup -- subsequent requests are fast

## Next Steps

- [Deployment Overview](deployment-overview.html) -- compare all deployment options
- [Multi-Tenant Deployment](multi-tenant.html) -- multi-tenant configuration on GCP
- [Security Model](../operations/security.html) -- IAM, encryption, and hardening
- [Monitoring & Audit Logging](../operations/monitoring.html) -- Cloud Run logging integration
