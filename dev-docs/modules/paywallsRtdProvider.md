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

The module automates VAI loading, timing, and signal injection:

* **ORTB2 enrichment** — VAI signals are split across `site.ext.vai` (domain provenance), `user.ext.vai` (actor classification + signed assertion), and `imp[].ext.vai` (pageview correlation), available to all ORTB2-native bid adapters.
* **GAM targeting** — `vai_vat` and `vai_act` key-value pairs are set per ad unit for Google Ad Manager line item targeting.
* **Graceful degradation** — if VAI is unavailable or times out, the auction proceeds normally without enrichment.

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
    auctionDelay: 500,
    dataProviders: [
      {
        name: 'paywalls',
        waitForIt: true,
        params: {
          scriptUrl: '/pw/vai.js'
        }
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
| waitForIt | `Boolean` | Optional | Should be `true` when `auctionDelay` is set | `false` |
| params | `Object` | Optional | Provider configuration | `{}` |
| params.scriptUrl | `String` | Optional | URL of the VAI loader script | `'/pw/vai.js'` |
| params.waitForIt | `Number` | Optional | Max ms to wait for VAI before releasing the auction (distinct from the Boolean `waitForIt` above) | `100` |

### Hosting Modes

VAI supports two hosting modes for the loader script:

* **Publisher-hosted** (preferred) — The script is served from the publisher's own domain via a CDN or server integration. Use the default relative path `'/pw/vai.js'`. This keeps requests same-origin, avoids CORS, and ensures the assertion's `dom` claim matches the inventory domain.
* **Paywalls-hosted** — The script is served from `https://paywalls.net/pw/vai.js`. Set `scriptUrl` to the full URL. This requires paywalls.net configuration before usage. **Note:** The domain provenance claim (`dom`) will reflect `paywalls.net` rather than the inventory domain, which may affect SSP verification and buyer trust.

## Output

### ORTB2 — `site.ext.vai` (Domain Provenance)

Fields that describe the assertion context. The `dom` value can be cryptographically verified through the signed `jws` in `user.ext.vai`.

```json
{
  "site": {
    "ext": {
      "vai": {
        "iss": "paywalls.net",
        "dom": "example.com"
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

### ORTB2 — `user.ext.vai` (Actor Classification)

Fields that describe the classified actor and the signed assertion:

```json
{
  "user": {
    "ext": {
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

## Activity Controls

The module uses `loadExternalScript` to inject `vai.js`. If your activity configuration denies external scripts by default, explicitly allow the `paywalls` component:

```javascript
pbjs.setConfig({
  allowActivities: {
    loadExternalScript: {
      default: false,
      rules: [
        {
          condition: function (params) {
            return params.componentName === 'paywalls';
          },
          allow: true
        }
      ]
    }
  }
});
```

## Privacy

* **No user identifiers** — VAI does not collect, store, or transmit user IDs, cookies, or fingerprints.
* **No PII** — The classification is based on aggregate session-level behavioral signals, not personal data.
* **Browser-side only** — All signal extraction runs in the browser; no data leaves the page except the classification result.
* **Signed assertions** — SSPs can independently verify the `jws` via the JWKS endpoint pulled from the JWS header (typically `https://example.com/pw/jwks.json`).

## How It Works

1. **`init()`** — Checks `window.__PW_VAI__` and `localStorage` for an existing VAI payload. If present and unexpired, caches it for immediate use.
2. **`getBidRequestData()`** — If cached VAI exists, merges ORTB2 and calls back immediately (fast path). Otherwise, injects `vai.js` via `loadExternalScript`, sets up a callback hook, and polls until timeout (slow path). On timeout, the auction proceeds without enrichment.
3. **`getTargetingData()`** — Returns `{ vai_vat, vai_act }` for each ad unit from the current VAI payload.

## Support

For questions or integration help, contact [engineering@paywalls.net](mailto:engineering@paywalls.net).

## Further Reading

* [VAI Documentation](https://paywalls.net/docs/publishers/vai)
* [Paywalls Analytics Adapter](/dev-docs/analytics/paywalls.html)
* [Prebid RTD Module Documentation](/dev-docs/add-rtd-submodule.html)
* [How Bid Adapters Should Read First Party Data](/features/firstPartyData.html#how-bid-adapters-should-read-first-party-data)
