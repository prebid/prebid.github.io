---
layout: analytics
title: Finteza
description: Finteza Analytics Adapter
modulecode: finteza
---

## Registration

Please visit [www.finteza.com/](https://www.finteza.com/) for more information. A Finteza website ID is required.

## Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'finteza',
  options: {
    id: 'xxxxx',
    bidWonTrack: 'Bid Won %BIDDER%'
  }
});
```

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `id` | required | `string` | Finteza website ID. If missing, the adapter logs an error and is not enabled. |
| `host` | optional | `string` | Tracking endpoint. Defaults to `https://content.mql5.com/tr`. |
| `bidRequestTrack` | optional | `string` | Event name for bid requests. Defaults to `'Bid Request %BIDDER%'`. |
| `bidResponsePriceTrack` | optional | `string` | Event name for bid response CPM. Defaults to `'Bid Response Price %BIDDER%'`. |
| `bidResponseTimeTrack` | optional | `string` | Event name for bid response time. Defaults to `'Bid Response Time %BIDDER%'`. |
| `bidTimeoutTrack` | optional | `string` | Event name for bid timeouts. Defaults to `'Bid Timeout %BIDDER%'`. |
| `bidWonTrack` | optional | `string` | Event name for winning bids. Defaults to `'Bid Won %BIDDER%'`. |

In event names, `%BIDDER%`, `%bidder%` and `%Bidder%` are replaced with the bidder code in upper, lower or capitalized case.

## Collected Data

The adapter listens to `bidRequested`, `bidResponse` (CPM and response time), `bidTimeout` and `bidWon`. Each tracked value is sent as a separate ajax `GET` request (query parameters, with credentials) to the `host`, along with the website ID, page URL and title, screen resolution and session data.

The adapter uses these cookies and localStorage keys, subject to storage access controls: `_fz_fvdt` (first visit date), `_fz_ssn` (session ID, 30-minute session), `_fz_tr` (last track time, localStorage or cookie) and `_fz_uniq` (read from cookie or localStorage if present).
