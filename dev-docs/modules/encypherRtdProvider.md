---
layout: page_v2
title: Encypher Real Time Data Provider
display_name: Encypher C2PA Content Provenance
description: Injects verified C2PA provenance references into OpenRTB impressions
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

The Encypher RTD provider performs a credentialless lookup for the canonical page, verifies the returned compact ES256 attestation, and adds the verified provenance reference to each OpenRTB impression at `imp.ext.c2pa`.

The module does not extract or upload article text, fetch page manifests, sign content in the browser, use cookies or localStorage, or load external JavaScript.

Contact [engineering@encypher.com](mailto:engineering@encypher.com) for more information.

## Integration

Compile the provider with the RTD core module:

```bash
gulp build --modules=rtdModule,encypherRtdProvider
```

Configure one Encypher data provider. `auctionDelay` must be at least as large as the provider timeout.

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 300,
    dataProviders: [{
      name: 'encypher',
      waitForIt: true,
      params: {
        timeout: 300,
        gamTargeting: {
          includeAttestationId: true,
          packages: ['VPP-V1']
        }
      }
    }]
  }
});
```

### Parameters

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Default | Description |
| - | - | - | - | - |
| `name` | Required | String | | Must be `'encypher'` |
| `waitForIt` | Required for asynchronous lookup | Boolean | `false` | Set to `true` so RTD core waits up to `auctionDelay` for the result |
| `params.timeout` | Optional | Number | `300` | Total provider deadline in milliseconds for URL hashing, signal lookup, JWKS retrieval, and verification. The effective budget is the smaller of this value and `auctionDelay` |
| `params.telemetry` | Optional | Boolean | `false` | Emit privacy-minimized diagnostic delivery events after the auction callback |
| `params.adoptionReporting` | Optional | Boolean | `true` | Permit domain-level adoption observations on consent-allowed lookups. Set exactly `false` to opt out |
| `params.gamTargeting` | Optional | Boolean or Object | `false` | Ad server key-values for Google Ad Manager line items. Either `false`, or an object with the optional `includeAttestationId` (Boolean, default `false`) and the optional `packages` (Array of String publisher package codes, each matching `[A-Za-z0-9_-]{1,32}`). A malformed value logs one warning and leaves targeting off |

The signal origin is fixed at `https://signals.encypher.com`. Publishers cannot configure a mirror, alternate subdomain, or path-prefix override.

## How it works

For each auction, the provider first checks consent. When transmission is allowed, it:

1. Selects the page's canonical URL, removes its fragment, normalizes percent encoding, and sorts query parameters.
2. Computes the SHA-256 URL digest with browser WebCrypto.
3. Requests the current decision from `https://signals.encypher.com/v1/attestations/{url_hash}`.
4. Requires an exact JSON decision with `v`, `status`, `dataset_version`, and `record`.
5. For a `ready` decision, verifies the compact JWS against the pinned issuer and JWKS at `https://api.encypher.com/api/v1/public/provenance/jwks.json`.
6. Adds the verified four-field carrier to auction-local copies of each ad unit.

`miss`, `revoked`, `stale`, malformed, oversized, unavailable, invalid, and timed-out results leave the auction unchanged.

## Data injected

The provider adds one compact object at `imp.ext.c2pa`:

```json
{
  "v": 1,
  "id": "epa_01J...",
  "ref": "https://api.encypher.com/api/v1/proof/bNv0YOZMqiDPmlW0hf0im_AkYKJ53GZxuJIsodyhMRg",
  "att": "eyJhbGciOiJFUzI1NiIs..."
}
```

{: .table .table-bordered .table-striped }

| Field | Type | Description |
| - | - | - |
| `v` | Integer | Protocol version, exactly `1` |
| `id` | String | Stable provenance record identifier |
| `ref` | HTTPS URL | Content-addressed public evidence URL derived from the signed manifest SHA-256 digest |
| `att` | Compact JWS | ES256 attestation binding the record to the canonical URL digest, publisher domain, manifest digest, policy version, revision, and expiration |

The serialized extension is limited to 1 KiB. Existing impression fields, including GPID, remain unchanged. Supply-chain data remains separate.

## Ad server targeting

With `params.gamTargeting` set to an object, the provider implements the RTD `getTargetingData` hook, so Prebid's ad server targeting carries the verified result for each ad unit that received `imp.ext.c2pa` in that auction. No extra request is made and no auction delay is added.

{: .table .table-bordered .table-striped }

| Key | Value | Emitted when |
| - | - | - |
| `encypher_verified` | `"1"` | The ad unit received `ortb2Imp.ext.c2pa` in this auction |
| `encypher_att` | Attestation ID, the same value as `ortb2Imp.ext.c2pa.id` | `includeAttestationId` is `true` and the ID matches `[A-Za-z0-9_-]{1,32}` |
| `encypher_pkg` | Publisher package codes, copied verbatim from `packages` | `packages` is non-empty |

Absence is the negative signal: miss, stale, revoked, invalid, and timed-out outcomes emit nothing, and so does an auction a consent gate suppressed. The serialized key map is limited to 256 bytes per ad unit; on overflow the provider drops `encypher_pkg`, then `encypher_att`, then `encypher_verified`. Package codes are publisher configuration and are never derived from provenance evidence. No URL, digest, price, deal, or user value appears in targeting.

On a page that runs more than one auction for the same ad unit code, clear these keys on the ad server slot before each set. `auctionManager.getAdUnits()` spans every retained auction and `targeting.getAdUnitTargeting` reads `adserverTargeting` from all of them, so an earlier verified auction keeps supplying `encypher_verified` after a later auction missed. A provider cannot correct that from `getTargetingData`: returning no entry leaves the earlier value in place, and returning an empty value reaches the ad server as a present key with an empty string.

## Validation and freshness

The provider requires:

- A fixed `https://signals.encypher.com` decision with status `ready`, `miss`, `revoked`, or `stale`.
- `record` to be the exact compact carrier for `ready` and `null` for every other status.
- An ES256 signature from the selected P-256 key in the pinned JWKS.
- Exact issuer, subject, publisher domain, canonical URL digest, manifest digest, validation result, declaration, policy version, signed revision, and lifetime claims.
- Exact equality between `ref` and `https://api.encypher.com/api/v1/proof/` followed by the signed `manifest_digest`, encoded as canonical unpadded base64url for 32 bytes. The browser does not fetch the evidence.
- At most 4 KiB of decoded decision JSON and 64 KiB of decoded JWKS JSON.

Signal and JWKS requests omit credentials and referrers, reject redirects, and bypass HTTP caches. A ready decision may be reused in page memory for at most 30 seconds, but its JWS and signed expiration are checked before every injection. JWKS entries expire after 30 seconds.

Page-lifetime dataset, status, and signed-revision watermarks prevent older or delayed responses from replacing newer decisions. `miss`, `revoked`, and `stale` decisions block equal or older ready responses. The provider also isolates carrier writes to the current auction, so a successful result cannot persist on reusable publisher ad-unit objects.

## Trust model

The record JWS authenticates the carrier and its signed claims. The pinned `https://api.encypher.com` JWKS origin supplies verification keys. The exact `https://signals.encypher.com` origin is the online authority for current ready, miss, revoked, or stale status and dataset version.

Current status is not separately signed for the browser. Compromise of the signal authority, its Cloudflare account or route, or its TLS control plane can replay a still-unexpired issuer-signed record. Compromise of the pinned JWKS origin can substitute verification keys. These authority compromises are outside the browser protocol's protection.

The evidence URL is cryptographically bound to the signed manifest digest. Substituting another syntactically valid evidence URL without changing the signed attestation causes rejection. Evidence retrieval still depends on the proof endpoint's availability and access controls; the browser does not treat a valid signature as proof of current availability.

## Privacy and diagnostics

The provider skips all work when COPPA applies, the US Privacy string records a sale opt-out, or GDPR applicability is true or unresolved. Encypher has no registered GVL ID, so a consent string or another vendor's consent cannot authorize transmission to Encypher. When GDPR consent management is enabled but supplies no data, the provider also skips the lookup. Builds without consent modules can perform the lookup.

GPP consent is checked independently of the legacy US Privacy string. Applicable US national and state sections 7-12 block transmission on sale, sharing, targeted-advertising opt-outs, or GPC. Object and segmented section representations are supported. Unknown applicable sections, missing or malformed consent fields, and unresolved configured GPP consent fail closed. Only applicable sections are inspected; an exact `[-1]` applicable-section list means no GPP section applies. Other privacy gates still apply.

Blocked calls complete the RTD callback without URL hashing, signal or JWKS requests, cached-signal injection, diagnostics, or adoption reporting. Ordinary auctions continue. Consent is checked again for every auction, including auctions that could otherwise reuse a cached signal.

Allowed lookup requests disclose the canonical URL digest, canonical publisher hostname, and module version to the fixed signal authority. They do not upload the raw URL, page content, manifest, cookies, bids, prices, deals, or creatives. Requests omit browser credentials and referrers. The URL digest is not an anonymization guarantee; canonical URLs can contain visitor-specific query values.

When consent permits transmission and `params.telemetry` is `true`, the module sends one post-callback diagnostic event through Prebid's fetch wrapper. It contains only protocol and module versions, outcome, impression count, duration, and optional dataset version. Non-injected outcomes report an impression count of zero. Telemetry failure cannot affect the auction.

When adoption reporting is enabled, the edge records an observation only when the browser Origin hostname exactly matches the requested publisher hostname. Retained fields are limited to the publisher FQDN, first and last seen times, module version, aggregate lookup/hit/miss counts, and dataset version. `params.adoptionReporting: false` adds the opt-out to the existing lookup and creates no second request.

## Further reading

- [C2PA Specification](https://c2pa.org/specifications/)
- [Prebid Real-Time Data modules](/dev-docs/add-rtd-submodule.html)
