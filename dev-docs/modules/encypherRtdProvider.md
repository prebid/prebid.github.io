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
        timeout: 300
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
| `params.adoptionReporting` | Optional | Boolean | `true` | Permit domain-level adoption observations on the existing lookup. Set exactly `false` to opt out |

The signal origin is fixed at `https://signals.encypher.com`. Publishers cannot configure a mirror, alternate subdomain, or path-prefix override.

## How it works

For each auction, the provider:

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
  "ref": "https://api.encypher.com/api/v1/public/provenance/attestations/epa_01J...",
  "att": "eyJhbGciOiJFUzI1NiIs..."
}
```

{: .table .table-bordered .table-striped }

| Field | Type | Description |
| - | - | - |
| `v` | Integer | Protocol version, exactly `1` |
| `id` | String | Stable provenance record identifier |
| `ref` | HTTPS URL | Deterministic public attestation resource bound to the signed record subject |
| `att` | Compact JWS | ES256 attestation binding the record to the canonical URL digest, publisher domain, policy version, revision, and expiration |

The serialized extension is limited to 1 KiB. Existing impression fields, including GPID, remain unchanged. Supply-chain data remains separate.

## Validation and freshness

The provider requires:

- A fixed `https://signals.encypher.com` decision with status `ready`, `miss`, `revoked`, or `stale`.
- `record` to be the exact compact carrier for `ready` and `null` for every other status.
- An ES256 signature from the selected P-256 key in the pinned JWKS.
- Exact issuer, subject, publisher domain, canonical URL digest, validation result, declaration, policy version, signed revision, and lifetime claims.
- Exact equality between `ref` and the pinned public attestation URL derived from the signed subject.
- At most 4 KiB of decoded decision JSON and 64 KiB of decoded JWKS JSON.

Signal and JWKS requests omit credentials and referrers, reject redirects, and bypass HTTP caches. A ready decision may be reused in page memory for at most 30 seconds, but its JWS and signed expiration are checked before every injection. JWKS entries expire after 60 seconds.

Page-lifetime dataset, status, and signed-revision watermarks prevent older or delayed responses from replacing newer decisions. `miss`, `revoked`, and `stale` decisions block equal or older ready responses. The provider also isolates carrier writes to the current auction, so a successful result cannot persist on reusable publisher ad-unit objects.

## Trust model

The record JWS authenticates the carrier and its signed claims. The pinned `https://api.encypher.com` JWKS origin supplies verification keys. The exact `https://signals.encypher.com` origin is the online authority for current ready, miss, revoked, or stale status and dataset version.

Current status is not separately signed for the browser. Compromise of the signal authority, its Cloudflare account or route, or its TLS control plane can replay a still-unexpired issuer-signed record. Compromise of the pinned JWKS origin can substitute verification keys. These authority compromises are outside the browser protocol's protection.

## Privacy and diagnostics

Lookup requests disclose the canonical URL digest, canonical publisher hostname, and module version to the fixed signal authority. They do not disclose the raw URL, page content, manifest, user or cookie identifier, bid, price, deal, or creative. Requests omit browser credentials and referrers.

When `params.telemetry` is `true`, the module sends one post-callback diagnostic event through Prebid's fetch wrapper. It contains only protocol and module versions, outcome, impression count, duration, and optional dataset version. Non-injected outcomes report an impression count of zero. Telemetry failure cannot affect the auction.

When adoption reporting is enabled, the edge records an observation only when the browser Origin hostname exactly matches the requested publisher hostname. Retained fields are limited to the publisher FQDN, first and last seen times, module version, aggregate lookup/hit/miss counts, and dataset version. `params.adoptionReporting: false` adds the opt-out to the existing lookup and creates no second request.

## Further reading

- [C2PA Specification](https://c2pa.org/specifications/)
- [Prebid Real-Time Data modules](https://docs.prebid.org/dev-docs/add-rtd-submodule.html)
