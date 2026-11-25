---
layout: analytics
title: Railu
description: Railu Analytics Adapter
modulecode: railu
---

## Registration

The adapter reports to the seller's Railu account, so it needs the seller's public tag ID from the Railu console
(Connect your supply). See [docs.railu.dev](https://docs.railu.dev) or contact [dev@railu.ai](mailto:dev@railu.ai).

## What it sends

One small report per auction, sent as low-priority background work about three seconds after the auction ends, so it never sits on the
page's critical path. It never bids and never changes the auction. It sends no user identifiers and no cookies: only
the page's domain and, for each ad slot, its format, sizes, how many bidders were asked and answered, the top bid, the
winner (bidder, price, deal) and, when Google Publisher Tag is on the page, whether the slot rendered.

## Analytics Options

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `tid` | required | The seller's public Railu tag ID; reports count as the seller's on its own domains | `'t_k3m9p2x7q4w8z6'` | `string` |
| `sample` | optional | Share of page views to report, 0 to 1 (default 1; 0 reports none); Railu weighs each report by 1 / sample | `0.25` | `number` |
| `endpoint` | optional | Override the endpoint | `'https://api.railu.ai/v1/observe'` | `string` |

## Example Configuration

```js
pbjs.enableAnalytics({
  provider: 'railu',
  options: { tid: 't_k3m9p2x7q4w8z6' }
});
```
