---
layout: bidder
title: Sparteo
description: Prebid Sparteo Bidder Adaptor
pbjs: true
pbs: false
biddercode: sparteo
media_types: banner, video
tcfeu_supported: true
gvl_id: 1028
usp_supported: true
prebid_member: false
schain_supported: false
safeframes_ok: true
deals_supported: false
floors_supported: false
fpd_supported: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Note

Sparteo Header Bidding adapter requires setup and approval. Please reach out to <prebid@sparteo.com> for more details.

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                 | Example    | Type      |
|-------------|----------|---------------------------------------------------------------------------------------------|------------|-----------|
| `pid`       | required | Your publisher ID. This information will be given to you by the Sparteo team.               | `1234`     | `integer` |

### Banner Object

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                                            | Example      | Type      |
|--------|----------|--------------------------------------------------------|--------------|-----------|
| `size` | required | The size (width, height) of the banner, in pixels.     | `[640, 480]` | `String`  |
| `pos`  | required | The position of the banner following the OpenRTB spec. | `0`          | `integer` |

### Video Object

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                                              | Example        | Type             |
|------------------|----------|--------------------------------------------------------------------------|----------------|------------------|
| `context`        | required | The video context, either 'instream', 'outstream'.                       | `instream`     | `String`         |
| `playerSize`     | required | The size (width, height) of the video player on the page, in pixels.     | `[640, 480]`   | `Array<integer>` |
| `playbackmethod` | required | Defines how the video inventory is initiated following the OpenRTB spec. | `[4, 5]`       | `Array<integer>` |
| `protocols`      | required | Defines the video protocols allowed.                                     | `[1, 2]`       | `Array<integer>` |
| `api`            | required | Defines the video api allowed.                                           | `[1, 2]`       | `Array<integer>` |
| `mimes`          | required | Defines the video mimes allowed.                                         | `['video/mp4]` | `Array<String>`  |
| `skip`           | required | Defines if skip is allowed.                                              | `1`            | `integer`        |
| `startdelay`     | required | Defines the startDelay.                                                  | `0`            | `integer`        |
| `placement`      | required | Defines the placement.                                                   | `1`            | `integer`        |
| `linearity`      | required | Defines the linearity.                                                   | `1`            | `integer`        |
| `minduration`    | required | Defines the video minduration.                                           | `1`            | `integer`        |
| `maxduration`    | required | Defines the video maxduration.                                           | `160`          | `integer`        |
