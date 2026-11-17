---
layout: analytics
title: AsterioBid
description: AsterioBid Analytics Adapter
modulecode: asteriobid
---

## Registration

Please visit [asteriobid.com/](https://asteriobid.com/) for more information. A bundle ID provided by AsterioBid identifies your account.

## Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'asteriobid',
  options: {
    bundleId: '04bcf17b-9733-4675-9f67-d475f881ab78',
    version: 'v1',
    adUnitDict: {
      adunitid1: 'Top Banner',
      adunitid2: 'Bottom Banner'
    },
    customParam: {
      param1: 'value1'
    }
  }
});
```

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `bundleId` | optional | `string` | Bundle ID provided by AsterioBid. Not validated by the adapter, but needed to attribute data to your account. |
| `version` | optional | `string` | Configuration version label, used to compare setups in reporting. |
| `adUnitDict` | optional | `object` | Map of ad unit code to display name, for reporting. |
| `customParam` | optional | `object` | Custom key/value pairs to collect and report. |
| `tcf_compliant` | optional | any | Value passed through in every payload. |
| `sampling` | optional | `number` | Track 1 in `sampling` page views (randomly). Default: `1` (all page views). |
| `pageViewId` | optional | `string` | Page view identifier. Default: a generated UUID. |
| `url` | optional | `string` | Collection endpoint. Default: `https://endpt.asteriobid.com/endpoint`. |

## Data Collected

The adapter listens to `auctionInit`, `auctionEnd`, `bidRequested`, `bidResponse`, `bidTimeout`, `bidWon`, `bidderDone`, `bidAdjustment`, `setTargeting`, `requestBids` and `adRenderFailed`, recording trimmed auction, bid request and bid response details. Each batch also includes page domain, page URL, referrer and UTM parameters; UTM values are persisted in local storage (`pm_utm_*` keys) and reused on later pages without UTM parameters.

Events are queued and flushed every second and at each `auctionEnd`, by ajax POST (`text/plain`, with credentials) to `url`.
