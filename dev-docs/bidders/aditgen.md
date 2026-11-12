---
layout: bidder
title: Aditgen
description: Prebid Aditgen Bidder Adapter
pbjs: true
biddercode: aditgen
aliasCode: admixer
media_types: banner, video, native
usp_supported: true
schain_supported: true
floors_supported: true
sidebarType: 1
multiformat_supported: will-bid-on-any
safeframes_ok: true
---

## Bidder Configuration

Set `bidderURL` with `setBidderConfig` before the auction starts. Without it, no `aditgen` bids are requested.

```js
pbjs.setBidderConfig({
  bidders: ['aditgen'],
  config: {
    bidderURL: 'https://us-adx-example.rtb-stack.com/prebid?client=44e2d241-5051-4b58-8ac6-f17e13732339&ssp=3&endpoint=777'
  }
});
```

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                         | Example                            | Type      |
|---------------|----------|-----------------------------------------------------|------------------------------------|-----------|
| `tagId`       | required | Ad placement ID. Used for comparison of statistics. | `12345`                            | `integer` |
| `kvTargeting` | optional | Key/value pairs used for custom targeting.          | `{key1: 'value1', key2: 'value2'}` | `object`  |

## Bid Example

```js
{
  bidder: 'aditgen',
  params: {
    tagId: 12345,
    kvTargeting: {
      example: 'test'
    }
  }
}
```
