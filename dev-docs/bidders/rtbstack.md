---
layout: bidder
title: RTB Stack
description: Prebid AdMixer Bidder Adaptor
pbjs: true
biddercode: rtbstack
aliasCode: admixer
media_types: banner, video, native
tcfeu_supported: true
usp_supported: true
schain_supported: true
gvl_id: 511
userIds: AdmixerID
prebid_member: true
floors_supported: true
sidebarType: 1
multiformat_supported: will-bid-on-any
safeframes_ok: true
---

#### Bidder Configuration

RTB Stack bidder requires bidderURL to be set. Please note that rtbstack bids will not be requested without this config. It must be set before auction starts.

```js
pbjs.setBidderConfig({
  bidders: ['rtbstack'],
  config: {
    bidderURL: 'https://us-adx-example.rtb-stack.com/prebid?client=44e2d241-5051-4b58-8ac6-f17e13732339&ssp=3'
  }
});
```

### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                | Example                      | Type     |
|---------------------|----------|--------------------------------------------------------------------------------------------|------------------------------|----------|
| `endpointId`        | required | Unique Entity ID. Could be obtained from your account manager.                             | 51772                        | `int`    |
| `kvTargeting`       | optional | Key/Value - a pair of the unique values that will be used for the custom targeting option. | {key1: value2, key2: value2} | `object` |

#### Bid Example

```js
{
  bidder: 'rtbstack',
  params: {
    endpointId: '12345',
    kvTargeting: {
      example: 'test'
    }
  }
}
```
