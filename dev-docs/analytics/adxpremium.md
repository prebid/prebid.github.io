---
layout: analytics
title: AdxPremium
description: AdxPremium Analytics Adapter
modulecode: adxpremium
---

## Registration

Please visit [luponmedia.com](https://luponmedia.com/) for more information. You must be an AdxPremium publisher with a publisher ID and server ID.

## Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'adxpremium',
  options: {
    pubId: 12345678,
    sid: 's2'
  }
});
```

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `pubId` | required | `number` or `string` | AdxPremium publisher ID. If missing, the adapter logs an error and is not enabled. |
| `sid` | optional | `string` | AdxPremium server ID. When set, data is sent to `https://<sid>.adxpremium.services/graphql` instead of the default endpoint. |

## Data Collected

The adapter listens to `auctionInit`, `bidRequested`, `bidResponse`, `bidTimeout`, `bidWon` and `auctionEnd`. It records bid requests (bidder, ad unit codes and sizes), bid responses (bidder, ad unit, size, CPM, currency, creative ID, response time, win status), plus auction ID, page URL without query string, screen resolution, device type (from the user agent) and `window.reqCountry` if defined.

The auction report is sent once GPT has fired `slotRenderEnded` for every ad unit in the auction, or 2 seconds after `auctionEnd`, whichever comes first. Timed-out requests and wins that arrive after the report are sent as separate requests.

Data is sent by ajax POST (JSON) as a base64-encoded GraphQL mutation to `https://adxpremium.services/graphql`, or the `sid`-specific host above.
