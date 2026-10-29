---
layout: bidder
title: The Ads
description: Prebid AdMixer Bidder Adaptor
pbjs: true
biddercode: theads
aliasCode: admixer
media_types: banner, video, native
usp_supported: true
schain_supported: true
prebid_member: true
floors_supported: true
sidebarType: 1
multiformat_supported: will-bid-on-any
safeframes_ok: true
---

#### Bidder Configuration

The Ads bidder requires bidderURL to be set. Please note that theads bids will not be requested without this config. It must be set before auction starts.

```js
pbjs.setBidderConfig({
  bidders: ['theads'],
  config: {
    bidderURL: 'https://us-adx-example.rtb-stack.com/prebid?client=44e2d241-5051-4b58-8ac6-f17e13732339&ssp=3&endpoint=777'
  }
});
```

### Bid Params

{: .table .table-bordered .table-striped }

| Name                | Scope    | Description                                                                                | Example                      | Type     |
|---------------------|----------|--------------------------------------------------------------------------------------------|------------------------------|----------|
| `tagId`        | required |The unique identifier of the ad placement. Will be used for comparison of statistics.                             | 51772                        | `int`    |
| `kvTargeting`       | optional | Key/Value - a pair of the unique values that will be used for the custom targeting option. | {key1: value2, key2: value2} | `object` |

#### Bid Example

```js
{
  bidder: 'theads',
  params: {
    tagId: '12345',
    kvTargeting: {
      example: 'test'
    }
  }
}
```
