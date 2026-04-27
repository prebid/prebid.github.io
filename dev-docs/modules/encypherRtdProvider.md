---
layout: page_v2
title: Encypher Real Time Data Provider
display_name: Encypher C2PA Content Provenance
description: Injects C2PA content provenance signals into OpenRTB bid requests
page_type: module
module_type: rtd
module_code: encypherRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Encypher RTD Provider
{:.no_toc}

- TOC
{:toc}

## Description

The Encypher RTD provider injects [C2PA](https://c2pa.org/) content provenance signals into OpenRTB bid requests at `site.ext.data.c2pa`. This gives DSPs a cryptographic content-integrity signal they can use for brand safety and inventory quality decisioning.

The module detects whether article content already carries embedded provenance markers (from a CMS plugin, CDN worker, or direct API integration) and verifies them server-side. If no existing provenance is found, it signs the content via the Encypher public API. In both cases the result is injected into the bid request.

No external JavaScript is loaded. The module uses only Prebid.js core imports. Every code path calls `callback()`. The module never blocks an auction.

Contact [engineering@encypher.com](mailto:engineering@encypher.com) for more information.

## Integration

Compile the Encypher RTD module into your Prebid build:

```bash
gulp build -modules=rtdModule,encypherRtdProvider
```

## Configuration

Add the Encypher RTD provider to your Prebid config:

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 300,
    dataProviders: [{
      name: 'encypher',
      waitForIt: true,
      params: {
        // All optional. Free tier works with zero config.
      }
    }]
  }
});
```

### Parameters

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
| - | - | - | - |
| `name` | Required | String | Must be `'encypher'` |
| `waitForIt` | Optional | Boolean | Set to `true` to delay the auction until provenance data is available. Default: `false` |
| `params` | Optional | Object | Configuration parameters (see below) |
| `params.apiBase` | Optional | String | Override the API base URL (default: `https://api.encypher.com`). Useful for staging or development environments. |
| `params.manifestUrl` | Optional | String | Manual manifest URL. When set, the module fetches this URL directly instead of calling the signing API. |

## How It Works

The module runs once per page load through three paths in strict priority:

### Path A: Manifest Shortcut

If a `<meta name="c2pa-manifest-url">` tag or `params.manifestUrl` is present, the module fetches the manifest directly without calling the signing API.

### Path B: Cache

If provenance data for the current page exists in localStorage (30-day TTL, keyed by canonical URL hash), it is served immediately with no network call.

### Path C: API Signing and Verification

The module extracts article text from the DOM and sends it to the Encypher API. The API detects whether the content already contains embedded C2PA provenance markers:

- **If markers are present:** The API verifies them and returns the existing provenance data, including the original signer tier. No signing quota is consumed.
- **If no markers are found:** The API signs the content fresh and returns a new manifest.

The result is cached in localStorage and injected into the bid request.

## Content Extraction

Article text is extracted from the DOM in this priority order:

1. **JSON-LD structured data:** `application/ld+json` scripts containing schema.org `Article`, `NewsArticle`, `BlogPosting`, or `Report` types.
2. **`<article>` element:** `textContent` of the first `<article>` element.
3. **`[role="main"]` element:** `textContent` of the first element with `role="main"`.

Content shorter than 50 characters is skipped. Content longer than 50,000 characters is truncated.

## Data Injected

The following object is placed at `ortb2Fragments.global.site.ext.data.c2pa`:

```json
{
  "manifest_url": "https://api.encypher.com/api/v1/public/prebid/manifest/abc123",
  "verified": true,
  "signer_tier": "connected",
  "signed_at": "2026-04-01T10:00:00Z",
  "content_hash": "a1b2c3d4e5f6",
  "source": "auto",
  "extraction_method": "json-ld"
}
```

{: .table .table-bordered .table-striped }

| Field | Type | Description |
| - | - | - |
| `manifest_url` | String | URL to retrieve the C2PA manifest |
| `verified` | Boolean | `true` if provenance was successfully verified or signed |
| `signer_tier` | String | Signing identity tier (see table below) |
| `signed_at` | String | ISO 8601 timestamp of signing |
| `content_hash` | String | SHA-256 hash of article text |
| `source` | String | How provenance was obtained: `cms`, `cache`, or `auto` |
| `extraction_method` | String | DOM extraction method: `json-ld`, `article-element`, or `role-main` |

## Signer Tiers

The `signer_tier` field tells DSPs how the content was authenticated:

{: .table .table-bordered .table-striped }

| Tier | Meaning |
| - | - |
| `byok` | Publisher signed with their own key (strongest identity) |
| `connected` | Publisher authenticated with Encypher and signed at publish time |
| `encypher_free` | Content was auto-signed by Encypher at first pageview (no publisher authentication) |
| `local` | Manifest fetched from a local or self-hosted endpoint |

DSPs can use this field for differential bidding. Content signed by authenticated publishers carries stronger brand-safety guarantees than content attested by a third party at pageview time.

## Free Tier

The free tier provides 1,000 unique content signatures per publisher domain per month. Re-requests for the same content (deduped by content hash) do not count against quota. Verification of already-signed content does not count against quota. When the quota is exceeded, the module continues without injecting provenance data (fail-open).

## Privacy

The module uses Prebid's `getStorageManager` for localStorage access, which enforces GDPR/TCF consent. If consent is denied, caching is disabled and Path C (auto-sign) is skipped entirely, so no page content leaves the browser. When consent is granted but caching is unavailable, the module falls back to API calls on each page load. Article text sent to the Encypher API for signing is not stored on Encypher's servers. Only content hashes and metadata are persisted. A 2-second timeout ensures the module never blocks the auction.

## Further Reading

- [C2PA Specification](https://c2pa.org/specifications/)
- [Encypher Documentation](https://encypher.com/docs)
