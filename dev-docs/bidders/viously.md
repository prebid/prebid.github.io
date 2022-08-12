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
The Viously adapter requires setup and approval from the Viously team, even for existing Viously publishers. Please reach out to your account team, or contact us through this form for more information : https://corporate.viously.com/contact-publishers

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                 | Example    | Type      |
|-------------|----------|---------------------------------------------------------------------------------------------|------------|-----------|
| `pid`       | required | Your publisher ID. This information will be given to you by the Viously team.               | `1234`     | `integer` |
| `mute`      | required | Indicate if the player is muted or not.                                                     | `true`     | `boolean` |
| `play_type` | required | The play type of your player. It must be either `autoplay`, `scrolltoplay` or `clicktoplay` | `autoplay` | `string`  |

### Example

```
var adUnits = [
    {
        code: 'test-viously',
        mediaTypes: {
            video: {
                context: 'instream'
            }
        },
        bids: [
            {
                bidder: 'viously',
                params: {
                    pid: 1234,
                    mute: true,
                    play_type: 'autoplay'
                }
            }
        ]
    }
]
```
