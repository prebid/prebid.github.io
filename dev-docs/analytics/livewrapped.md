---
layout: analytics
title: Livewrapped
description: Livewrapped Analytics Adapter
modulecode: livewrapped
prebid_member: true
---

## Registration

Please visit [livewrapped.com/](https://livewrapped.com/) for more information. Contact Livewrapped to obtain a publisher ID.

## Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'livewrapped',
  options: {
    publisherId: '64c01620-fa98-4936-9794-6001d8ebfdb0'
  }
});
```

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `publisherId` | required | string | Publisher ID provided by Livewrapped. Not validated by the adapter, but sent with every request. |
| `endpoint` | optional | string | Overrides the collection URL. Default: `https://lwadm.com/analytics/10`. |
| `ext` | optional | any | Passed through unchanged as `ext` in every request. |

## Data Collection

The adapter listens to `auctionInit`, `bidRequested`, `bidResponse`, `bidderDone`, `bidTimeout`, `auctionEnd`, `bidWon`, and `adRenderFailed`. It records requests, responses (highest bid per bid request), timeouts, wins, and render failures, including CPM, size, media type, floors, deal ID, bid `meta`, and the GDPR applies flag and consent string. If the ad unit's element has a `data-adunitid` attribute, its value is included.

Data is sent as a JSON `POST` (ajax) to `endpoint` (default `https://lwadm.com/analytics/10`) 500 ms after `auctionEnd`. Wins and render failures that occur after that are sent in a separate request as they happen.
