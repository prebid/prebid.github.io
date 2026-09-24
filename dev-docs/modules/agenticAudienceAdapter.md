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

This Real-Time Data (RTD) submodule reads **Agentic Audiences** embedding data from browser storage (localStorage, with cookie fallback) and merges it into the outbound bid request via `ortb2Fragments.global`. It follows the community extension [**Agentic Audiences in OpenRTB**](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/agentic-audiences.md) (see [IAB Tech Lab — Agentic Audiences](https://iabtechlab.com/standards/agentic-audiences/) and the [reference repository](https://github.com/IABTechLab/agentic-audiences)).

The module injects **one** OpenRTB `Data` object under `user.data`: `name` is always the submodule id `agenticAudience`, and `segment` is built from the stored `entries` array. Embedding fields from each stored entry are placed under **`segment.ext.aa`** (`ver`, `vector`, `dimension`, `model`, `type`); optional `id` and `name` on the segment come from the stored entry when present. Fields are copied **without validation or coercion**.

Implementation reference: [Prebid.js PR #14626](https://github.com/prebid/Prebid.js/pull/14626).

## Integration

1. Build the module into your Prebid.js bundle. The parent [**rtdModule**](/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData) is required. `agenticAudienceAdapter` is listed in `modules/.submodules.json`, so builds that include only `agenticAudienceAdapter` still pull in `rtdModule`:

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
        storageKey: '_my_agentic_audience_' // optional; see below
      }
    }]
  }
});
```

Use **`name: 'agenticAudience'`** in `realTimeData.dataProviders[]` so the RTD core loads this submodule. Other fields such as `auctionDelay` and `waitForIt` are generic RTD behavior; see [Publisher Real-Time Data Configuration](/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData).

### Parameters under `params`

{: .table .table-bordered .table-striped }

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `storageKey` | string | Optional. Key used for `localStorage` and, if nothing is found there, for the cookie API. If omitted or an empty string, the module uses the default key **`_agentic_audience_`** (exported as `DEFAULT_STORAGE_KEY` in the module source). |

`init` always returns success; if storage is missing, invalid, or has no mappable segments, the module simply does not merge `user` into `ortb2Fragments.global`.

## Storage format

The value at the resolved storage key must be a **string**: Base64-encoded JSON (`atob` + `JSON.parse`). The parsed object must include an **`entries`** array. Each element should be a plain object; the module maps it to an OpenRTB segment as follows:

- `id`, `name` → segment `id`, `name` (optional; may be undefined if absent in storage)
- `ver`, `vector`, `dimension`, `model`, `type` → `segment.ext.aa.*` (passed through as-is; no normalization)

Invalid Base64/JSON or a missing/non-array `entries` field results in no injection.

## OpenRTB output shape

When at least one segment is produced, the module **`mergeDeep`s** into `reqBidsConfigObj.ortb2Fragments.global` approximately:

```json
{
  "user": {
    "data": [
      {
        "name": "agenticAudience",
        "segment": [
          {
            "id": "seg-1",
            "name": "identity-contextual",
            "ext": {
              "aa": {
                "ver": "1.0.0",
                "vector": "<Base64 Float32 LE per OpenRTB extension>",
                "dimension": 10,
                "model": "sbert-mini-ctx-001",
                "type": [1, 2]
              }
            }
          }
        ]
      }
    ]
  }
}
```

Downstream consumers should expect the **`ext.aa`** object as emitted by this submodule (see the [OpenRTB community extension](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/agentic-audiences.md) for semantic definitions of the embedding fields).

## Privacy / storage access

Reads go through Prebid’s **storage manager** for the RTD module type and submodule name `agenticAudience`, so access respects the same activity and consent controls as other RTD submodules in your build.

### TCF: `gvlMapping` for `agenticAudience`

If you use [TCF Control](/dev-docs/modules/tcfControl.html) (or related GDPR consent settings) and the submodule is treated as an unknown vendor, map the **submodule name** `agenticAudience` to the correct **IAB Global Vendor List (GVL) ID** for the party whose storage or data processing applies (for example, the embedding provider). Use the real integer from the GVL instead of placeholders.

`gvlMapping` only:

```javascript
pbjs.setConfig({
  gvlMapping: {
    agenticAudience: XXX,
  },
});
```

(`XXX` stands in for your vendor’s numeric GVL ID.)

Together with `realTimeData` (same `setConfig` call or a later one; Prebid merges top-level keys):

```javascript
pbjs.setConfig({
  gvlMapping: {
    agenticAudience: 123, // example only — use your vendor’s GVL ID
  },
  realTimeData: {
    dataProviders: [{ name: 'agenticAudience', params: {} }],
  },
});
```

See the [`gvlMapping` note](/dev-docs/modules/tcfControl.html) on the TCF Control module page for general behavior.

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
