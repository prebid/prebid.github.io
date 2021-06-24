---
layout: bidder
title: Welect
description: Prebid Welect Bidder Adapter
biddercode: welect
media_types: no-display, video
gvlid: 282
pbjs: true
pbjs_version_notes: not in 5.x
---

### Note:
The Welect adapter requires setup and approval from the Welect team, even for partners that already work with us. Please reach out to our team at olaf.peters@welect.de.

### Bid params

| Name         | Scope    | Description                                                                                       | Example                  | Type      |
|--------------|----------|---------------------------------------------------------------------------------------------------|--------------------------|-----------|
| `placementId` | required | Your personal id which will be given to you by the Welect team. | `'aliasexample'`                  | `string`  |
| `domain`   | optional | Not mandatory but recommended. Our Team will provide you with a domain, if not given defaults to www.welect.de | `'www.welect.de'` | `string`  |

### Example

```
var adUnits = [
    {
        code: 'test-welect-instream',
        sizes: [[640, 360]],
        mediaTypes: {
            video: {
                context: 'instream'
            }
        },
        bids: [
            {
                bidder: 'welect',
                params: {
                    placementId: 'examplePlacement',
                    domain: 'www.welect.de',
                }
            }
        ]
    }
]
```
