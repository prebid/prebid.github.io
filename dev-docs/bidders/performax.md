---
layout: bidder
title: Performax
description: Prebid Performax Bidder Adaptor
pbjs: true
biddercode: performax
media_types: banner
enable_download: false
pbjs_version_notes: not ported to 5.x
---

### Note:
Performax adapter requires setup and approval from the Performax team. Please reach out to your account team or info@performax.cz for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description        | Example                      | Type     |
|---------------|----------|--------------------|------------------------------|----------|
| `slotId`      | required | Slot ID            | `32572`                      | `Integer`|

### Example

```javascript
    var adUnits = [
        {
            code: 'performax-div',
            sizes: [[300, 300]],
            bids: [
                {
                    bidder: "performax",
                    params: {
                        slotId: 28   // required
                    }
                }
            ]
        }
    ];
```
