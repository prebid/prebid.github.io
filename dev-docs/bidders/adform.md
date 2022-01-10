---
layout: bidder
title: Adform
description: Prebid Adform Bidder Adaptor
biddercode: adform
media_types: banner, video
gdpr_supported: true
usp_supported: true
prebid_member: true
pbjs: true
pbs: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, sharedId, unifiedId
gvl_id: 50
enable_download: false
pbjs_version_notes: not ported to 5.x
---

**Adform bid adapter is deprecated since Prebid 5.0. Please refer to [AdformOpenRTB adapter](#adf) documentation to fetch bids from Adform demand sources.**

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                   | Example                    | Type      |
|-------------|----------|-----------------------------------------------|----------------------------|-----------|
| `mid`       | required |                                               | `12345`                    | `integer` |
| `adxDomain` | optional | The Adform domain                             | `'adx.adform.net'`         | `string`  |
| `priceType` | optional | An expected price type (net or gross) of bids | `'net'`                    | `string`  |
| `mkv`       | optional | Comma-separated key-value pairs               | `'city:NY'`                | `string`  |
| `mkw`       | optional | Comma-separated keywords                      | `'news,sport'`             | `string`  |
| `minp`      | optional | Minimum CPM price                             | `2.55`                     | `number`  |
| `cdims`     | optional | Comma-separated creative dimentions           | `'300x250'`                | `string`  |
| `url`       | optional | Custom targeting URL                          | `'https://some.app/?home'` | `string`  |

Note: Spaces are not allowed between comma-separated list values. For example:
```
// valid params
{
  mid: 12345,
  mkv: 'city:NY,city:London',
  mkv: 'news,sport',
  cdims: '300x250,250x300'
}
// invalid params
{
  mid: 12345,
  mkv: 'city:NY, city:London',
  mkv: 'news, sport',
  cdims: '300x250, 250x300'
}
```
