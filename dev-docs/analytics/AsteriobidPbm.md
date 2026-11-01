---
layout: analytics
title: Asteriobid PBM
description: Asteriobid PBM Analytics Adapter
modulecode: AsteriobidPbm
---

## Registration

Please visit [http://prebidmanager.com/](http://prebidmanager.com/) for more information.

## Configuration

The analytics provider code is `prebidmanager`.

```javascript
pbjs.enableAnalytics({
  provider: 'prebidmanager',
  options: {
    bundleId: 'your-bundle-id',
    sampling: 10
  }
});
```

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `bundleId` | optional | `string` | Identifier sent with every batch as `bundleId`. |
| `url` | optional | `string` | Collection endpoint. Defaults to `https://endpt.prebidmanager.com/endpoint`. |
| `sampling` | optional | `number` | Integer `N`: the adapter is enabled on roughly 1 in `N` page loads. Defaults to `1` (always enabled). |
| `version` | optional | any | Passed through in each batch as `version`. |
| `tcf_compliant` | optional | any | Passed through in each batch as `tcf_compliant`. |

## Collected Data

The adapter listens to `auctionInit`, `auctionEnd`, `bidRequested`, `bidResponse`, `bidAdjustment`, `bidTimeout`, `bidWon`, `bidderDone`, `setTargeting`, `requestBids` and `adRenderFailed`, keeping trimmed copies of the bid and ad unit data.

Events are queued and sent as a batch every second and immediately on `auctionEnd`, via ajax `POST` (`text/plain`, with credentials) to the configured `url`. Each batch includes a page view ID, a page view record (user agent, language, timezone offset, viewport size), the page and referrer domains, and UTM parameters. UTM parameters found in the page URL are stored in localStorage (`pm_utm_*` keys) and reused on later pages that have none.
