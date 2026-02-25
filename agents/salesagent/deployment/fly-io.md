---
layout: page_v2
title: Prebid Sales Agent - Deployment - Deploy to Fly.io
description: Step-by-step guide for deploying the Prebid Sales Agent to Fly.io
sidebarType: 10
---

# Deploy to Fly.io
{: .no_toc}

This guide walks you through deploying the Prebid Sales Agent to Fly.io, a platform that runs Docker containers on servers close to your users. Fly.io is a good option for teams that want a managed platform without the complexity of Kubernetes.

- TOC
{:toc}

## Prerequisites

{: .table .table-bordered .table-striped }
| Requirement | Notes |
|-------------|-------|
| Fly.io account | [Sign up at fly.io](https://fly.io) |
| `flyctl` CLI | [Install instructions](https://fly.io/docs/hands-on/install-flyctl/) |
| Authenticated CLI | Run `fly auth login` |

## Step 1: Create the Fly App

Create a new Fly app in your preferred region:

```bash
fly apps create sales-agent --org personal
```

{: .alert.alert-info :}
Replace `personal` with your Fly.io organization name if applicable. Run `fly regions list` to see available regions.

## Step 2: Provision a Database

The Sales Agent requires PostgreSQL. Fly.io offers two options:

### Option A: Fly Managed Postgres (Recommended)

Fly's fully managed Postgres service includes automatic backups, failover, and monitoring:

```bash
fly postgres create --name sales-agent-db --region ord --vm-size shared-cpu-1x --volume-size 10
```

Attach the database to your app:

```bash
fly postgres attach sales-agent-db --app sales-agent
```

This automatically sets the `DATABASE_URL` secret on your app.

{: .table .table-bordered .table-striped }
| Resource | Estimated Cost |
|----------|---------------|
| Managed Postgres (shared-cpu-1x, 10GB) | ~$38/month |
| Automatic daily backups | Included |

### Option B: Fly Postgres (Self-Managed)

For lower cost, use Fly's self-managed Postgres option. This runs Postgres as a regular Fly app without managed backups or failover:

```bash
fly postgres create --name sales-agent-db --region ord --vm-size shared-cpu-1x --volume-size 1 --initial-cluster-size 1
```

Attach to your app:

```bash
fly postgres attach sales-agent-db --app sales-agent
```

{: .table .table-bordered .table-striped }
| Resource | Estimated Cost |
|----------|---------------|
| Self-managed Postgres (shared-cpu-1x, 1GB) | ~$5-7/month |
| Backups | Manual (your responsibility) |

{: .alert.alert-warning :}
With self-managed Postgres, you are responsible for backups. Set up `pg_dump` on a schedule or use Fly's volume snapshots.

## Step 3: Set Secrets

Configure the required secrets for your deployment:

```bash
# Generate and set the encryption key
fly secrets set ENCRYPTION_KEY="$(openssl rand -base64 32)" --app sales-agent

# Enable test mode for initial setup (remove later)
fly secrets set ADCP_AUTH_TEST_MODE="true" --app sales-agent
```

{: .alert.alert-danger :}
Record the `ENCRYPTION_KEY` value securely before proceeding. If lost, all encrypted data (API keys, adapter credentials) becomes unrecoverable. Run `fly secrets list --app sales-agent` to verify the secret is set, but note that Fly does not display secret values after creation.

## Step 4: Deploy

### From the Docker Image (Recommended)

Deploy using the published container image:

```bash
fly deploy --image docker.io/prebid/salesagent:latest --app sales-agent
```

### From Source

If you need to customize the build, clone the repository and deploy from source:

```bash
git clone https://github.com/prebid/salesagent.git
cd salesagent
fly deploy --app sales-agent
```

The repository includes a `Dockerfile` that Fly uses automatically.

## Step 5: Initial Setup

Once the deployment completes, open the Admin UI:

```bash
fly open /admin --app sales-agent
```

Or navigate to `https://sales-agent.fly.dev/admin` in your browser.

### Setup Mode

On first launch with no tenants configured, the Sales Agent enters Setup Mode. This provides a guided workflow:

1. Navigate to the Admin UI
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
Disable test mode before production use. Run `fly secrets unset ADCP_AUTH_TEST_MODE --app sales-agent` and configure SSO instead.

## Step 6: Configure SSO

For production authentication, configure an SSO provider:

1. In your identity provider (Google, Microsoft, Okta, Auth0, or Keycloak), create an OAuth application
2. Set the redirect URI to:

```text
https://sales-agent.fly.dev/auth/oidc/callback
```

3. In the Admin UI, go to **Settings > SSO Configuration**
4. Enter the Client ID and Client Secret
5. Save and test the login flow
6. Disable test mode:

```bash
fly secrets unset ADCP_AUTH_TEST_MODE --app sales-agent
```

## Database Migrations

Database migrations run automatically on each application startup. No manual intervention is needed for routine deployments.

To run migrations manually (e.g., for troubleshooting), open an SSH console:

```bash
fly ssh console --app sales-agent
```

Inside the console:

```bash
python -m alembic upgrade head
```

## Monitoring

### Viewing Logs

```bash
# Stream live logs
fly logs --app sales-agent

# View recent logs
fly logs --app sales-agent --no-tail
```

### Checking Status

```bash
# View app status and running instances
fly status --app sales-agent

# Check the health endpoint
curl https://sales-agent.fly.dev/health
```

### SSH Access

```bash
# Open an interactive shell
fly ssh console --app sales-agent

# Run a one-off command
fly ssh console --app sales-agent -C "python -m scripts.diagnostics"
```

## Scaling

### Horizontal Scaling (Instances)

Add more instances to handle increased traffic:

```bash
# Scale to 2 instances
fly scale count 2 --app sales-agent
```

### Vertical Scaling (CPU and Memory)

Increase resources per instance:

```bash
# Scale to 1 dedicated CPU and 1GB memory
fly scale vm shared-cpu-2x --memory 1024 --app sales-agent
```

{: .table .table-bordered .table-striped }
| VM Size | CPU | Memory | Estimated Cost |
|---------|-----|--------|---------------|
| `shared-cpu-1x` | Shared 1x | 256MB | ~$5/month |
| `shared-cpu-2x` | Shared 2x | 512MB | ~$10/month |
| `performance-1x` | Dedicated 1x | 2GB | ~$30/month |

## Custom Domain

To serve the Sales Agent on your own domain:

```bash
# Add a certificate for your domain
fly certs create ads.yourpublisher.com --app sales-agent
```

Then create a CNAME record in your DNS provider:

```text
ads.yourpublisher.com.  IN  CNAME  sales-agent.fly.dev.
```

Fly.io automatically provisions and renews the TLS certificate.

## Cost Estimate

{: .table .table-bordered .table-striped }
| Component | Managed Postgres | Self-Managed Postgres |
|-----------|------------------|-----------------------|
| App (shared-cpu-1x) | ~$5/month | ~$5/month |
| Postgres | ~$38/month | ~$5-7/month |
| Bandwidth (typical) | ~$2-5/month | ~$2-5/month |
| **Total** | **~$45-50/month** | **~$12-17/month** |

## Troubleshooting

### App Fails to Start

```bash
fly logs --app sales-agent
```

{: .table .table-bordered .table-striped }
| Symptom | Cause | Fix |
|---------|-------|-----|
| `ENCRYPTION_KEY not set` | Missing secret | Run `fly secrets set ENCRYPTION_KEY="$(openssl rand -base64 32)" --app sales-agent` |
| `connection refused` on database | Postgres not attached | Run `fly postgres attach sales-agent-db --app sales-agent` |
| OOM killed | Insufficient memory | Scale up: `fly scale vm shared-cpu-1x --memory 512 --app sales-agent` |
| Health check failures | App still starting | Wait 30-60 seconds; check logs for migration progress |

### Database Connection Issues

If the app cannot reach the database:

```bash
# Verify the database is running
fly status --app sales-agent-db

# Check the DATABASE_URL secret is set
fly secrets list --app sales-agent
```

If the database was recreated, you may need to re-attach it:

```bash
fly postgres attach sales-agent-db --app sales-agent
```

### Deployment Stuck

If a deployment hangs during health checks:

```bash
# Check what's happening
fly logs --app sales-agent

# Cancel and retry
fly deploy --image docker.io/prebid/salesagent:latest --app sales-agent --strategy immediate
```

## Next Steps

- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) -- Compare all deployment options
- [Configuration Reference](/agents/salesagent/deployment/configuration-reference.html) -- Full list of environment variables
- [Admin UI Guide](/agents/salesagent/operations/admin-ui.html) -- Configure products, advertisers, and settings
