---
layout: bidder
title: Cortex
description: Prebid Cortex Adapter
biddercode: cortex
gpp_sids: usstate_all
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
deals_supported: false
floors_supported: true
fpd_supported: false
ortb_blocking_supported: false
media_types: banner, video, native
multiformat_supported: will-bid-on-one
userIds: all
pbjs: true
pbs: true
pbs_app_supported: true
safeframes_ok: true
sidebarType: 1
---

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example | Type       |
|---------------|----------|--------------|---------|------------|
| `placementId` | optional | Placement Id | `'0'`   | `'string'` |
| `endpointId`  | optional | Endpoint Id  | `'0'`   | `'string'` |

## Note

For the prebid server you only need to use one parameter: either `placementId` or `endpointId`

## Regional Endpoints

Cortex supports the following regional endpoint subdomains:

- `eu` — EU
- `us-east` — US East
- `apac` — APAC

### Prebid Server

The Prebid Server config endpoint is defined with a `REGION` placeholder:

```yaml
endpoint: "https://REGION.targetadserver.com/pserver"
```

Please deploy this config in each of your datacenters and replace `REGION` with the appropriate regional subdomain (`eu`, `us-east`, or `apac`).

### Prebid.js

The Prebid.js adapter automatically selects the regional endpoint based on the browser timezone:

- Europe / Africa / Atlantic / Arctic → `eu`
- Asia / Australia / Antarctica / Pacific / Indian → `apac`
- America / US / Canada → `us-east`
- Unknown / unresolved timezone → `eu` (fallback)
