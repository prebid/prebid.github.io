---
layout: bidder
title: Reload
description: Reload Prebid Adaptor
pbjs: true
biddercode: reload
enable_download: false
pbjs_version_notes: not ported to 5.x
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                     | Example                            | Type     |
| ------------- | -------- | ----------------------------------------------- | ---------------------------------- |----------|
| `plcmID`      | required | Placement ID (provided by Reload)               | "4234897234"                       | `string` |
| `partID`      | required | Partition ID (provided by Reload)               | "part_01"                          | `string` |
| `opdomID`     | required | Internal parameter (provided by Reload)         | 0                                  | `int`    |
| `bsrvID`      | required | Internal parameter (provided by Reload)         | 12                                 | `int`    |
| `type`        | optional | Internal parameter (provided by Reload)         | "pcm"                              | `string` |


## Example

```javascript
var adUnits = [
  // Banner adUnit
  {
    code: 'banner-div',
    mediaTypes: {
      banner: {
        sizes: [
          [300, 250]
        ],
      }
    },
    bids: [{
      bidder: 'reload',
      params: {
        plcmID: '4234897234',
        partID: 'part_2',
        opdomID: 0,
	bsrvID: 0,
        type: 'pcm'
      }
    }]
  }];
```
