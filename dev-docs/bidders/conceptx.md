---
layout: bidder
title: Conceptx
description: Conceptx bidder adapter
biddercode: conceptx
tcfeu_supported: true
gvl_id: 1340
usp_supported: false
coppa_supported: false
schain_supported: false
floors_supported: true
media_types: banner
userIds: all
pbjs: true
pbs: false
pbs_app_supported: false
sidebarType: 1
safeframes_ok: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------------|----------|----------------------------------------------------------------------|----------|----------|
| `site` | required | The site `'your-page-name'`. | `'your-page-name'` | `string` |
| `adunit` | required | The specific adunit | `'some-id-3'` | `string`|

#### Banner example

```js
var adUnits = [
    code: 'your-banner-container-id',
    mediaTypes: {
      banner: {
        sizes: [[930, 180]]
      } 
    },
    bids: [{
        bidder: 'conceptx',
        params: { 
            site: "example", adunit: "some-id-3" 
        }
    }]
];
```
