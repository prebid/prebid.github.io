---
layout: page_v2
title: Paywalls RTD Provider
display_name: Paywalls RTD Provider
description: VAI (Validated Actor Inventory) classification for Prebid.js — enriches ORTB2 and GAM targeting with actor-type and confidence signals.
page_type: module
module_type: rtd
module_code: paywallsRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Paywalls RTD Provider
{:.no_toc}

The Paywalls RTD module integrates [VAI (Validated Actor Inventory)](https://paywalls.net/docs/publishers/vai) into Prebid.js. VAI helps publishers distinguish **human traffic** and **AI agents** from **non-human automation** (sharing/preview bots, search crawlers, AI training scrapers, etc.) so they can make better-informed economic decisions about their inventory.

Each page impression is classified by **actor type** (`vat`) and **confidence tier** (`act`), producing a cryptographically signed assertion that SSPs and DSPs can independently verify via a standard JWKS endpoint.

* TOC
{:toc}

## Overview

The module reads VAI classification from `window.__PW_VAI__` (populated by the publisher's vai.js script) and injects it into bid requests and ad server targeting:

* **ORTB2 enrichment** — VAI signals are split across `site.ext.data.vai` (domain provenance), `user.ext.data.vai` (actor classification + signed assertion), and `imp[].ext.vai` (pageview correlation), available to all ORTB2-native bid adapters.
* **GAM targeting** — `vai_vat` and `vai_act` key-value pairs are set per ad unit for Google Ad Manager line item targeting.
* **Graceful degradation** — if VAI is unavailable (publisher did not load vai.js, or it returned an invalid/expired response), the auction proceeds normally without enrichment.

## Prerequisites

Load vai.js **before** Prebid.js initializes so that `window.__PW_VAI__` is populated when the RTD module runs:

```html
<script src="/pw/vai.js"></script>
<script src="prebid.js"></script>
```

{: .alert.alert-warning :}
The module does **not** inject vai.js itself. Publishers must add the script tag to their page. See [VAI Documentation](https://paywalls.net/docs/publishers/vai) for setup details.

## Integration

Build the Paywalls RTD module into your Prebid.js package:

```bash
gulp build --modules=rtdModule,paywallsRtdProvider
```

{: .alert.alert-info :}
The global RTD module (`rtdModule`) is a required dependency.

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object:

```javascript
pbjs.setConfig({
  realTimeData: {
    dataProviders: [
      {
        name: 'paywalls'
      }
    ]
  }
});
```

### Parameter Descriptions

{: .table .table-bordered .table-striped }

| Name | Type | Scope | Description | Default |
| :--- | :--- | :---- | :---------- | :------ |
| name | `String` | Required | RTD sub module name | Always `'paywalls'` |

## Output

### ORTB2 — `site.ext.data.vai` (Domain Provenance)

Fields that describe the assertion context. The `dom` value can be cryptographically verified through the signed `jws` in `user.ext.data.vai`.

```json
{
  "site": {
    "ext": {
      "data": {
        "vai": {
          "iss": "paywalls.net",
          "dom": "example.com"
        }
      }
    }
  }
}
```

{: .table .table-bordered .table-striped }

| Field | Description |
| :---- | :---------- |
| `iss` | Issuer — bare domain (e.g. `paywalls.net`) |
| `dom` | Domain the assertion covers |

### ORTB2 — `user.ext.data.vai` (Actor Classification)

Fields that describe the classified actor and the signed assertion:

```json
{
  "user": {
    "ext": {
      "data": {
        "vai": {
          "iss": "paywalls.net",
          "mstk": "01J4X9K2ABCDEF01234567",
          "vat": "HUMAN",
          "act": "ACT-1",
          "jws": "eyJhbGciOiJFZERTQSIs..."
        }
      }
    }
  }
}
```

{: .table .table-bordered .table-striped }

| Field | Description |
| :---- | :---------- |
| `iss` | Issuer — bare domain (e.g. `paywalls.net`) |
| `vat` | Validated Actor Type — one of `HUMAN`, `AI_AGENT`, `SHARING`, `OTHER` |
| `act` | Actor Confidence Tier — one of `ACT-1`, `ACT-2`, `ACT-3` |
| `mstk` | Micro-session token — unique per assertion |
| `jws` | Full JWS (compact serialization) for SSP/DSP verification |

### ORTB2 — `imp[].ext.vai` (Pageview Correlation)

Set on each ad unit’s `ortb2Imp` when `pvtk` is available from the VAI payload:

```json
{
  "imp": [{
    "ext": {
      "vai": {
        "pvtk": "01J4X9K2ABCDEF01234567/3"
      }
    }
  }]
}
```

{: .table .table-bordered .table-striped }

| Field | Description |
| :---- | :---------- |
| `pvtk` | Pageview token — client-derived, unsigned; correlates impressions within a pageview using the `mstk` root |

### GAM Targeting

The module sets key-value pairs on every ad unit for Google Ad Manager targeting:

{: .table .table-bordered .table-striped }

| Key | Example Value | Description |
| :-- | :------------ | :---------- |
| `vai_vat` | `HUMAN` | Actor type |
| `vai_act` | `ACT-1` | Confidence tier |

These are available via `pbjs.getAdserverTargeting()` and are compatible with standard GPT integration.

## How It Works

1. **`init()`** — Always returns `true`; the module is always available.
2. **`getBidRequestData()`** — Reads `window.__PW_VAI__`. If a valid, unexpired payload is found, merges ORTB2 fragments (`site.ext.data.vai`, `user.ext.data.vai`, `imp[].ext.vai`) and calls back immediately. If VAI is absent or invalid, calls back without enrichment.
3. **`getTargetingData()`** — Returns `{ vai_vat, vai_act }` for each ad unit from the current VAI payload.

## Privacy

* **No user identifiers** — VAI does not collect, store, or transmit user IDs, cookies, or fingerprints.
* **No PII** — The classification is based on aggregate session-level behavioral signals, not personal data.
* **Browser-side only** — All signal extraction runs in the browser; no data leaves the page except the classification result.
* **Signed assertions** — SSPs can independently verify the `jws` via the JWKS endpoint pulled from the JWS header (typically `https://example.com/pw/jwks.json`).

## Support

For questions or integration help, contact [engineering@paywalls.net](mailto:engineering@paywalls.net).

## Further Reading

* [VAI Documentation](https://paywalls.net/docs/publishers/vai)
* [Paywalls Analytics Adapter](/dev-docs/analytics/paywalls.html)
* [Prebid RTD Module Documentation](/dev-docs/add-rtd-submodule.html)
* [How Bid Adapters Should Read First Party Data](/features/firstPartyData.html#how-bid-adapters-should-read-first-party-data)
