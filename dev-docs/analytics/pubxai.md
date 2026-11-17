---
layout: analytics
title: Pubxai
description: Pubxai Analytics Adapter
modulecode: pubxai
prebid_member: true
---

## Registration

Please visit [http://pubx.ai/](http://pubx.ai/) for more information. Pubx.ai provides the `pubxId`.

## Configuration

```js
pbjs.enableAnalytics({
  provider: 'pubxai',
  options: {
    pubxId: 'a9d48e2f-24ec-4ec1-b3e2-04e32c3aeb03',
    samplingRate: 1
  }
});
```

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `pubxId` | required | string | Publisher ID provided by Pubx.ai. |
| `hostName` | optional | string | Collection hostname, without protocol or path. Defaults to `api.pbxai.com`. |
| `samplingRate` | optional | number | Sends one in `samplingRate` auctions, selected by a hash of the auction ID. Defaults to `1` (all auctions). |

The `options` object is required. It is also included in every payload.

## Data Collected

The adapter listens to `bidResponse`, `bidRejected`, `bidTimeout`, `auctionEnd` and `bidWon`. Each auction record includes bids, floor data, page URL, device and browser, the names of available user ID and consent types, and the local storage keys `pubx:pmac` and `pubx:extraData`. Winning bids also include the GPT slot's `pubx-*` and `hb_*` targeting.

An auction is queued on `bidWon`, or on `auctionEnd` if it received no valid bids. Queued data is sent with `navigator.sendBeacon` when the page becomes hidden, in batches of up to 64 KB, to these URLs (`<hostName>` defaults to `api.pbxai.com`):

- `https://<hostName>/analytics/auction`
- `https://<hostName>/analytics/bidwon`
