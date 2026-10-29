---
layout: bidder
title: Nativo
description: Prebid Nativo Bidder Adapter
biddercode: nativo
gvl_id: 263
media_types: banner, video, native
tcfeu_supported: true
usp_supported: true
coppa_supported: false
gpp_supported: true
schain_supported: true
dsa_supported: false
floors_supported: true
fpd_supported: false
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
userIds: all
ortb_blocking_supported: true
---

## Note

The Nativo Bidder adapter requires setup before beginning. Please contact us at <prebiddev@nativo.com> beforehand.

## Adapter Behavior

The Nativo Prebid Server adapter (both PBS-Go and PBS-Java) is a **pure pass-through adapter**. It forwards the full OpenRTB bid request to Nativo's endpoint without transformation. The only modification made by Prebid Server core is rewriting `imp[].ext` — stripping the `ext.prebid.bidder.nativo` routing wrapper so the bidder receives `ext.bidder` directly.

The Java implementation uses the shared `GenericBidder` class, making it functionally identical to the Go adapter.

Media type detection (banner, video, native) is determined at response time by inspecting the matched `imp` object.

## Bid Params

### Prebid Server

The Prebid Server adapter requires **at least one** of the following identifiers on each impression. They are passed through in `imp[].ext.bidder` and `imp[].tagid` as standard OpenRTB fields.

`imp[].tagid` is the preferred integration method. This allows Nativo to set up a single catchall placement that will auto-create new placements based on a configurable request threshold on unique tagids (20k is default).

`placementId` should be reserved for unique use cases.

**At least one of `tagid`, `placementId`, or `gpid` must be provided.**

{: .table .table-bordered .table-striped }

| Name           | Scope                            | Description                                                                                                                                                                                                                                                               | Example                                           | Type      |
|----------------|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|-----------|
| `imp.tagid`    | optional (preferred)             | The Ad Slot Tag ID — a standard OpenRTB field and the recommended identifier. See [OpenRTB 2.6 imp.tagid](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md#324---object-imp-).                                                                 | `homepage_infeed_atf`                             | `string`  |
| `placementId`  | optional                         | The unique Placement ID assigned by the Nativo platform. Set by the publisher in `imp[].ext.prebid.bidder.nativo.placementId` — Prebid Server translates this to `imp[].ext.bidder.placementId` before forwarding the request to Nativo. Reserved for unique use cases.   | `12345678`                                        | `integer` |
| `imp.ext.gpid` | optional (standard Prebid field) | The Global Placement ID (GPID). Used as a fallback if neither `tagid` nor `placementId` is present. See [GPID docs](https://docs.prebid.org/features/pbAdSlot.html#the-gpid).                                                                                             | `/22888152279/publication/placement/gpid_example` | `string`  |

#### Example OpenRTB request to Prebid Server (banner)

```json
{
  "id": "request-1",
  "site": {
    "page": "https://example.com/article",
    "publisher": { "id": "pub-123" }
  },
  "imp": [{
    "id": "imp-1",
    "tagid": "homepage_infeed_atf",
    "banner": {
      "format": [{ "w": 300, "h": 250 }]
    },
    "ext": {
      "gpid": "/123456/homepage_infeed_atf_1",
      "prebid": {
        "bidder": {
          "nativo": {
            "placementId": 12345678
          }
        }
      }
    }
  }],
  "tmax": 1000
}
```

#### What Nativo's endpoint receives

Prebid Server rewrites `imp[].ext`, stripping the `ext.prebid.bidder.nativo` routing wrapper. `placementId` is promoted from `imp[].ext.prebid.bidder.nativo.placementId` → `imp[].ext.bidder.placementId`:

```json
{
  "id": "request-1",
  "site": {
    "page": "https://example.com/article",
    "publisher": { "id": "pub-123" }
  },
  "imp": [{
    "id": "imp-1",
    "tagid": "homepage_infeed_atf",
    "banner": {
      "format": [{ "w": 300, "h": 250 }]
    },
    "ext": {
      "gpid": "/123456/homepage_infeed_atf_1",
      "bidder": {
        "placementId": 12345678
      }
    }
  }],
  "tmax": 1000
}
```

If no params are provided, Nativo receives `"ext": { "bidder": {} }` and relies on `imp.tagid` or `imp.ext.gpid` for placement matching.

#### Example with native format

```json
{
  "imp": [{
    "id": "imp-1",
    "tagid": "homepage_infeed_atf",
    "native": {
      "request": "{\"ver\":\"1.1\",\"layout\":1,\"adunit\":2,\"assets\":[{\"id\":1,\"required\":1,\"title\":{\"len\":90}},{\"id\":2,\"required\":1,\"img\":{\"type\":3,\"wmin\":300,\"hmin\":200}}]}"
    },
    "ext": {
      "gpid": "/123456/homepage_infeed_atf_1",
      "prebid": {
        "bidder": {
          "nativo": {
            "placementId": 12345678
          }
        }
      }
    }
  }]
}
```

### Prebid.js

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                             | Example                       | Type      |
|---------------|----------|-------------------------------------------------------------------------|-------------------------------|-----------|
| `placementId` | required | Publication placement ID value from the Nativo Platform                 | `13144370`                    | `integer` |
| `url`         | optional | Publication URL associated with the placement ID in the Nativo Platform | `https://example.com/article` | `string`  |
