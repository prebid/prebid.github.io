---
layout: page_v2
title: Agentic Audiences Real-Time Data Module
display_name: Agentic Audiences RTD
description: Injects Agentic Audiences embedding signals from browser storage into OpenRTB bid requests
page_type: module
module_type: rtd
module_code: agenticAudienceAdapter
enable_download: true
sidebarType: 1
---

# Agentic Audiences Real-Time Data Module

## Overview

This Real-Time Data (RTD) submodule reads **Agentic Audiences** embedding data from browser storage (localStorage or cookies) and merges it into the outbound bid request as OpenRTB `user.data` entries. It follows the community extension [**Agentic Audiences in OpenRTB**](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/agentic-audiences.md) (see [IAB Tech Lab — Agentic Audiences](https://iabtechlab.com/standards/agentic-audiences/) and the [reference repository](https://github.com/IABTechLab/agentic-audiences)).

You can configure **multiple providers** under a single module: each key in `params.providers` becomes the `name` on one `Data` object in `user.data`, with segments built from that provider’s stored payload. No separate Prebid module is required per vendor—only this submodule plus the correct `storageKey` for wherever each partner’s script writes data.

## Integration

1. Build the module into your Prebid.js bundle. The parent [**rtdModule**](/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData) is required. You may list both explicitly, or rely on `agenticAudienceAdapter` being registered as an RTD submodule so builds that include only `agenticAudienceAdapter` still pull in `rtdModule`:

   ```bash
   gulp build --modules=rtdModule,agenticAudienceAdapter,...
   ```

2. Register the data provider with `pbjs.setConfig({ realTimeData: ... })` as shown below.

### Configuration

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 300,
    dataProviders: [{
      name: 'agenticAudience',
      waitForIt: true,
      params: {
        providers: {
          partner_a: { storageKey: '_example_agentic_audiences_a_' },
          partner_b: { storageKey: '_example_agentic_audiences_b_' }
        }
      }
    }]
  }
});
```

The `realTimeData.dataProviders[]` entry for this submodule uses **`name: 'agenticAudience'`** (the RTD submodule name). Other fields such as `auctionDelay` and `waitForIt` are generic RTD behavior; see [Publisher Real-Time Data Configuration](/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData).

### Parameters under `params`

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
| :-- | :-- | :-- |
| `providers` | object | **Required** for initialization. Map from a provider label (string) to per-provider settings. The object key becomes `user.data[].name` in the bid request. If `providers` is missing, not a plain object, or has no enumerable keys, the submodule does not inject data. |
| `providers.<label>.storageKey` | string | Key used for `localStorage`; if absent there, the cookie API is tried. If missing or falsy for a given label, that provider is skipped (no `user.data` row for it). |

Provider labels are **chosen by the publisher** (or by convention with a data partner). The module does not whitelist names.

## Storage format

The value at each `storageKey` is expected to be **Base64-encoded JSON** (as produced by the Agentic Audiences client storage format). After `atob` and `JSON.parse`, the payload should include an **`entries`** array. Each entry is mapped to one OpenRTB `Segment` with standard `id` and `name` where present, and Agentic Audiences fields placed under `segment.ext` (`ver`, `vector`, `dimension`, `model`, `type`) as defined in the [OpenRTB extension](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/agentic-audiences.md). The module does not validate or re-encode vectors; consumers should follow the extension for decoding (Float32 little-endian per value, Base64).

## OpenRTB output shape

For each configured provider that yields at least one mappable segment, the submodule appends one element to `user.data`, in the order of `Object.keys(params.providers)` (typical object insertion order). Structure matches the extension’s single- and multi-provider examples: one `Data` object per provider with `name` and `segment[]`, and embedding metadata in each segment’s `ext`.

## GDPR / TCF

The submodule reads first-party storage. It is registered with Prebid’s **vendorless GVL** handling so that, when [TCF control](/dev-docs/modules/tcfControl.html) is used, enforcement aligns with other publisher-scoped storage modules (publisher purpose consent rather than a specific advertising vendor). See the [FAQ on vendorless GVL](/dev-docs/faq.html) for context.

## Testing

From the Prebid.js repository:

```bash
npm test -- --file test/spec/modules/agenticAudienceAdapter_spec.js
```

## References

- [Agentic Audiences in OpenRTB (community extension)](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/agentic-audiences.md)
- [Agentic Audiences | IAB Tech Lab](https://iabtechlab.com/standards/agentic-audiences/)
- [IABTechLab / agentic-audiences (GitHub)](https://github.com/IABTechLab/agentic-audiences)
- [Prebid.js PR #14626 — Agentic Audiences RTD](https://github.com/prebid/Prebid.js/pull/14626)
