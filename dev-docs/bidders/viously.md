---
layout: bidder
title: Viously
description: Prebid Viously Bidder Adaptor
pbjs: true
pbs: true
biddercode: viously
media_types: video
gdpr_supported: true
usp_supported: true
prebid_member: false
floors_supported: false
fpd_supported: false
schain_supported: false
---

### Note:
Viously Header Bidding adapter requires setup and approval. Please reach out to prebid@viously.com for more details.

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                 | Example    | Type      |
|-------------|----------|---------------------------------------------------------------------------------------------|------------|-----------|
| `pid`       | required | Your publisher ID. This information will be given to you by the Viously team.               | `1234`     | `integer` |

### Video Object

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                                              | Example      | Type             |
|------------------|----------|--------------------------------------------------------------------------|--------------|------------------|
| `context`        | required | The video context, either 'instream', 'outstream'.                       | `instream`   | `String`         |
| `playerSize`     | required | The size (width, height) of the video player on the page, in pixels.     | `[640, 480]` | `Array<integer>` |
| `playbackmethod` | required | Defines how the video inventory is initiated following the OpenRTB spec. | `[4, 5]`     | `Array<integer>` |

### Example

```
var adUnits = [
    {
        code: 'test-viously',
        mediaTypes: {
            video: {
                playerSize: [640, 360],
                context: 'instream',
                playbackmethod: [1, 2, 3, 4, 5, 6]
            }
        },
        bids: [
            {
                bidder: 'viously',
                params: {
                    pid: '20d30b78-43ec-11ed-b878-0242ac120002'
                }
            }
        ]
    }
]
```
