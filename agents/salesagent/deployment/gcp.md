---
layout: page_v2
title: Prebid Sales Agent - Deployment - Deploy to Google Cloud Run
description: Step-by-step guide for deploying the Prebid Sales Agent to Google Cloud Run with Cloud SQL
sidebarType: 10
---

# Deploy to Google Cloud Run
{: .no_toc}

This guide walks you through deploying the Prebid Sales Agent to Google Cloud Run backed by Cloud SQL for PostgreSQL. Cloud Run is a serverless container platform that scales automatically and charges per use.

- TOC
{:toc}

## Prerequisites

{: .table .table-bordered .table-striped }
| Requirement | Notes |
|-------------|-------|
| Google Cloud project | With billing enabled |
| `gcloud` CLI | [Install instructions](https://cloud.google.com/sdk/docs/install) |
| Authenticated CLI | Run `gcloud auth login` |

## Step 1: Enable Required APIs

Enable the APIs needed for Cloud Run and Cloud SQL:

```bash
gcloud services enable sqladmin.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable run.googleapis.com
```

## Step 2: Create a Cloud SQL Instance

Create a PostgreSQL instance. The `db-f1-micro` tier is sufficient for most deployments:

```bash
gcloud sql instances create sales-agent-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-size=10GB \
  --storage-auto-increase
```

Create the database and user:

```bash
# Create the database
gcloud sql databases create salesagent --instance=sales-agent-db

# Set a password for the postgres user
gcloud sql users set-password postgres \
  --instance=sales-agent-db \
  --password=YOUR_SECURE_PASSWORD
```

{: .alert.alert-danger :}
Replace `YOUR_SECURE_PASSWORD` with a strong password. If the password contains special characters (`@`, `#`, `%`, etc.), you must URL-encode them in the `DATABASE_URL` later. For example, `p@ss` becomes `p%40ss`.

Note the instance connection name for later:

```bash
gcloud sql instances describe sales-agent-db --format="value(connectionName)"
```

This returns a value like `your-project:us-central1:sales-agent-db`.

## Step 3: Deploy to Cloud Run

Deploy the Sales Agent container with the required configuration:

```bash
gcloud run deploy sales-agent \
  --image=docker.io/prebid/salesagent:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances=YOUR_PROJECT:us-central1:sales-agent-db \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=1 \
  --no-cpu-throttling \
  --set-env-vars="DATABASE_URL=postgresql://postgres:YOUR_SECURE_PASSWORD@/salesagent?host=/cloudsql/YOUR_PROJECT:us-central1:sales-agent-db" \
  --set-env-vars="ENCRYPTION_KEY=$(openssl rand -base64 32)" \
  --set-env-vars="ADCP_AUTH_TEST_MODE=true"
```

{: .alert.alert-danger :}
**Two flags are mandatory for the Sales Agent to function on Cloud Run:**

- `--no-cpu-throttling` -- The Sales Agent runs background services (MCP server, A2A server, scheduled tasks). Without this flag, Cloud Run throttles the CPU between requests, causing these services to stall.
- `--min-instances=1` -- Keeps at least one instance warm at all times. Without this, cold starts cause MCP clients and A2A integrations to time out.

Omitting either flag results in intermittent 502 errors and unresponsive background services.

{: .alert.alert-warning :}
Record the `ENCRYPTION_KEY` value before deploying. Run `echo $(openssl rand -base64 32)` first, save the output, then use it in the deploy command. If lost, all encrypted data becomes unrecoverable.

### DATABASE_URL Format

Cloud Run connects to Cloud SQL through a Unix domain socket. The `DATABASE_URL` format for this connection is:

```text
postgresql://USER:PASSWORD@/DATABASE?host=/cloudsql/PROJECT:REGION:INSTANCE
```

{: .table .table-bordered .table-striped }
| Component | Value | Example |
|-----------|-------|---------|
| `USER` | Database username | `postgres` |
| `PASSWORD` | URL-encoded password | `p%40ssword` |
| `DATABASE` | Database name | `salesagent` |
| `PROJECT` | GCP project ID | `my-project-123` |
| `REGION` | Cloud SQL region | `us-central1` |
| `INSTANCE` | Cloud SQL instance name | `sales-agent-db` |

### Password URL Encoding

If your database password contains special characters, URL-encode them:

{: .table .table-bordered .table-striped }
| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `/` | `%2F` |
| `:` | `%3A` |
| `?` | `%3F` |
| `=` | `%3D` |

For example, if your password is `my@pass#123`, the `DATABASE_URL` would use `my%40pass%23123`.

## Step 4: Verify the Deployment

After the deploy command completes, it prints the service URL. Verify the deployment:

```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe sales-agent \
  --region=us-central1 \
  --format="value(status.url)")

# Check the health endpoint
curl $SERVICE_URL/health
```

Expected response:

```json
{"status": "ok"}
```

{: .table .table-bordered .table-striped }
| Service | URL | Expected Result |
|---------|-----|-----------------|
| Admin UI | `$SERVICE_URL/admin` | Login page or setup wizard |
| MCP Server | `$SERVICE_URL/mcp/` | MCP endpoint (requires auth) |
| A2A Server | `$SERVICE_URL/a2a` | A2A endpoint (requires auth) |
| Health Check | `$SERVICE_URL/health` | `{"status": "ok"}` |
| Agent Card | `$SERVICE_URL/.well-known/agent.json` | JSON agent descriptor |

## Step 5: Initial Setup

### Setup Mode

On first launch with no tenants configured, the Sales Agent enters Setup Mode:

1. Navigate to `$SERVICE_URL/admin`
2. Log in with the test password `test123` (since `ADCP_AUTH_TEST_MODE=true`)
3. Complete the setup wizard to create your first tenant
4. Configure your publisher name, domain, and ad server adapter

### Test Credentials

When `ADCP_AUTH_TEST_MODE=true`, the following credentials are available:

{: .table .table-bordered .table-striped }
| Credential | Value | Purpose |
|------------|-------|---------|
| Admin UI password | `test123` | Access the admin dashboard |
| MCP auth token | `test-token` | Authenticate MCP tool calls |
| A2A bearer token | `test-token` | Authenticate A2A requests |

{: .alert.alert-warning :}
Disable test mode before production use. Update the environment variable: `gcloud run services update sales-agent --region=us-central1 --remove-env-vars=ADCP_AUTH_TEST_MODE`

## Step 6: Configure SSO

For production authentication, configure an SSO provider:

1. In your identity provider (Google, Microsoft, Okta, Auth0, or Keycloak), create an OAuth application
2. Set the redirect URI to:

```text
https://sales-agent-HASH-uc.a.run.app/auth/oidc/callback
```

Replace the URL with your actual Cloud Run service URL.

1. In the Admin UI, go to **Settings > SSO Configuration**
1. Enter the Client ID and Client Secret
1. Save and test the login flow
1. Disable test mode:

```bash
gcloud run services update sales-agent \
  --region=us-central1 \
  --remove-env-vars=ADCP_AUTH_TEST_MODE
```

## Database Migrations

Database migrations run automatically on each application startup. No manual intervention is needed for routine deployments.

To run migrations manually, use Cloud Run Jobs or exec into a running instance:

```bash
gcloud run services exec sales-agent \
  --region=us-central1 \
  -- python -m alembic upgrade head
```

## Custom Domain

To serve the Sales Agent on your own domain:

```bash
gcloud beta run domain-mappings create \
  --service=sales-agent \
  --domain=ads.yourpublisher.com \
  --region=us-central1
```

The command outputs DNS records to create. Add the specified records in your DNS provider, then wait for the mapping to become active:

```bash
gcloud beta run domain-mappings describe \
  --domain=ads.yourpublisher.com \
  --region=us-central1
```

Google Cloud automatically provisions and renews the TLS certificate for mapped domains.

{: .alert.alert-info :}
Custom domain mapping can take up to 15 minutes to provision the SSL certificate. During this time, HTTPS requests may return certificate errors.

## Monitoring

### Viewing Logs

```bash
# Stream live logs
gcloud run services logs tail sales-agent --region=us-central1

# View recent logs in the console
gcloud run services logs read sales-agent --region=us-central1 --limit=100
```

Logs are also available in the [Cloud Run console](https://console.cloud.google.com/run) and Cloud Logging.

### Checking Status

```bash
# View service details
gcloud run services describe sales-agent --region=us-central1

# Check revision status
gcloud run revisions list --service=sales-agent --region=us-central1
```

## Scaling

Cloud Run scales automatically based on request concurrency. The key configuration options:

{: .table .table-bordered .table-striped }
| Parameter | Default | Recommended | Description |
|-----------|---------|-------------|-------------|
| `--min-instances` | 0 | 1 | Minimum warm instances (required for background services) |
| `--max-instances` | 100 | 5-10 | Maximum instances |
| `--memory` | 512Mi | 1Gi | Memory per instance |
| `--cpu` | 1 | 1 | CPUs per instance |
| `--concurrency` | 80 | 80 | Max concurrent requests per instance |

Update scaling parameters:

```bash
gcloud run services update sales-agent \
  --region=us-central1 \
  --min-instances=1 \
  --max-instances=5 \
  --memory=1Gi
```

## Cost Estimate

{: .table .table-bordered .table-striped }
| Component | Estimated Monthly Cost |
|-----------|----------------------|
| Cloud SQL (db-f1-micro, 10GB) | ~$10/month |
| Cloud Run (1 vCPU, 1Gi, always-allocated) | ~$30-35/month |
| Egress (typical) | ~$1-5/month |
| **Total** | **~$40-50/month** |

{: .alert.alert-info :}
Cloud Run charges are higher when using `--no-cpu-throttling` and `--min-instances=1` because the CPU is always allocated rather than billed per-request. This is required for the Sales Agent's background services to function.

## Troubleshooting

### 502 Bad Gateway Errors

{: .table .table-bordered .table-striped }
| Cause | Fix |
|-------|-----|
| Missing `--no-cpu-throttling` | Redeploy with `--no-cpu-throttling` flag |
| Missing `--min-instances=1` | Update with `gcloud run services update sales-agent --region=us-central1 --min-instances=1` |
| Container crashing | Check logs: `gcloud run services logs read sales-agent --region=us-central1 --limit=50` |

{: .alert.alert-danger :}
The most common cause of 502 errors on Cloud Run is the missing `--no-cpu-throttling` flag. Without it, Cloud Run throttles CPU between requests, causing the Sales Agent's background services (MCP, A2A, scheduled tasks) to stall and time out.

### Database Connection Errors

```bash
# Verify the Cloud SQL instance is running
gcloud sql instances describe sales-agent-db --format="value(state)"

# Check the Cloud SQL connection is attached
gcloud run services describe sales-agent \
  --region=us-central1 \
  --format="value(spec.template.metadata.annotations['run.googleapis.com/cloudsql-instances'])"
```

Common database connection issues:

{: .table .table-bordered .table-striped }
| Symptom | Cause | Fix |
|---------|-------|-----|
| `could not connect to server: No such file or directory` | Cloud SQL instance not attached | Add `--add-cloudsql-instances` to the deploy command |
| `password authentication failed` | Incorrect password in `DATABASE_URL` | Check password URL encoding; update env var |
| `database "salesagent" does not exist` | Database not created | Run `gcloud sql databases create salesagent --instance=sales-agent-db` |

### Password Encoding Issues

If your database password contains special characters and the app cannot connect:

1. Verify the password works directly:

```bash
gcloud sql connect sales-agent-db --user=postgres
```

1. URL-encode all special characters in the `DATABASE_URL`
1. Update the environment variable:

```bash
gcloud run services update sales-agent \
  --region=us-central1 \
  --set-env-vars="DATABASE_URL=postgresql://postgres:ENCODED_PASSWORD@/salesagent?host=/cloudsql/YOUR_PROJECT:us-central1:sales-agent-db"
```

### Insufficient Memory

If the container is OOM-killed:

```bash
gcloud run services update sales-agent \
  --region=us-central1 \
  --memory=2Gi
```

The Sales Agent requires a minimum of 1Gi memory. If running with large datasets or concurrent users, 2Gi is recommended.

## Next Steps

- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) -- Compare all deployment options
- [Configuration Reference](/agents/salesagent/deployment/configuration-reference.html) -- Full list of environment variables
- [Admin UI Guide](/agents/salesagent/operations/admin-ui.html) -- Configure products, advertisers, and settings
