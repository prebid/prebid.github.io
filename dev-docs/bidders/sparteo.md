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
schain_supported: true
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Note

Sparteo Header Bidding adapter requires setup and approval. Please reach out to <prebid@sparteo.com> for more details.

### Bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                                                         | Example                                  | Type      |
|---------------|----------|-------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|-----------|
| `networkId`   | required | Your network ID. This information will be given to you by the Sparteo team.                                                         | `'9061ab7e-f01e-43a5-b801-c1a56156f105'` | `String`  |
| `custom1`     | optional | To be used in reporting. Alphanumeric strings ; case sensitive ; max 40 characters ; only allowed symbols are hyphen and underscore.| `'Test-datapoint_42'`                    | `String`  |
| `custom2`     | optional | To be used in reporting. Alphanumeric strings ; case sensitive ; max 40 characters ; only allowed symbols are hyphen and underscore.| `'Test-datapoint_42'`                    | `String`  |
| `custom3`     | optional  | To be used in reporting. Alphanumeric strings ; case sensitive ; max 40 characters ; only allowed symbols are hyphen and underscore.| `'Test-datapoint_42'`                    | `String`  |
| `custom4`     | optional    | To be used in reporting. Alphanumeric strings ; case sensitive ; max 40 characters ; only allowed symbols are hyphen and underscore.| `'Test-datapoint_42'`                    | `String`  |
| `custom5`     | optional    | To be used in reporting. Alphanumeric strings ; case sensitive ; max 40 characters ; only allowed symbols are hyphen and underscore.| `'Test-datapoint_42'`                    | `String`  |

### Banner Object

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                                            | Example      | Type      |
|--------|----------|--------------------------------------------------------|--------------|-----------|
| `size` | required | The size (width, height) of the banner, in pixels.     | `[640, 480]` | `String`  |
| `pos`  | optional | The position of the banner following the OpenRTB spec. | `0`          | `integer` |

### Video Object

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                                              | Example        | Type             |
|------------------|----------|--------------------------------------------------------------------------|----------------|------------------|
| `context`        | required | The video context, either 'instream', 'outstream'.                       | `'instream'`   | `String`         |
| `playerSize`     | required | The size (width, height) of the video player on the page, in pixels.     | `[640, 480]`   | `Array<integer>` |
| `playbackmethod` | optional | Defines how the video inventory is initiated following the OpenRTB spec. | `[4, 5]`       | `Array<integer>` |
| `protocols`      | optional | Defines the video protocols allowed.                                     | `[1, 2]`       | `Array<integer>` |
| `api`            | optional | Defines the video api allowed.                                           | `[1, 2]`       | `Array<integer>` |
| `mimes`          | optional | Defines the video mimes allowed.                                         | `['video/mp4']`| `Array<String>`  |
| `skip`           | optional | Defines if skip is allowed.                                              | `1`            | `integer`        |
| `startdelay`     | optional | Defines the startDelay.                                                  | `0`            | `integer`        |
| `placement`      | optional | Defines the placement.                                                   | `1`            | `integer`        |
| `linearity`      | optional | Defines the linearity.                                                   | `1`            | `integer`        |
| `minduration`    | optional | Defines the video minduration.                                           | `1`            | `integer`        |
| `maxduration`    | optional | Defines the video maxduration.                                           | `160`          | `integer`        |
