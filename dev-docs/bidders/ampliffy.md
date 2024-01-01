---
layout: bidder
title: Ampliffy
description: Prebid Ampliffy Bidder Adapter
biddercode: ampliffy
pbjs: true
tcfeu_supported: true
gvl_id: 1258
media_types: banner, video, native
sidebarType: 1
multiformat_supported: will-bid-on-one
safeframes_ok: true
---

## Table of contents

* [Table of contents](#table-of-contents)
* [Introduction](#introduction)
* [Supported media types](#supported-media-types)
* [Modules to include in your build process](#modules-to-include-in-your-build-process)
* [Bid request parameters](#bid-request-parameters)
  * [Banner](#banner)
  * [Video](#video)
* [Examples](#examples)

## Introduction

Publishers can use Prebid.js to call Ampliffy through our client-side adapter: Prebid.js calls ampliffy directly from the browser using our client-side adapter. For configuration instructions, see the below on this page.

### Example

## Supported media types

The following table lists the media types that Ampliffy supports.

{: .table .table-bordered .table-striped }

| Type   |
|--------|
| banner |
| video  |
| native |

## Modules to include in your build process

If you are building the JS binary on your own from source code, follow the instructions in [Prebid.js project README](https://github.com/prebid/Prebid.js/blob/master/README.md#build-optimization). You will need to include the `ampliffyBidAdapter`. To show video ads with Google Ad Manager, you need to include the `dfpAdServerVideo` module. We highly recommend adding the `gptPreAuction` module as well, which improves a DSP's ability to bid accurately on your supply. The following is an example build command that include these modules: <br />
`gulp build --modules=ampliffyBidAdapter,dfpAdServerVideo,gptPreAuction`

If you are using a JSON file to specify modules, add `ampliffyBidAdapter` and `dfpAdServerVideo` to the modules array as follows:

```javascript
[
    "ampliffyBidAdapter",
    "dfpAdServerVideo",
    "gptPreAuction"
]
```

## Bid request parameters

### Banner

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Name | Scope    | Type | Description                                                                                                                                                                                      |
|---|----------|---|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `placementId` | Required | String | An Ampliffy-specific identifier that is associated with this ad unit. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'3723'`, `'6482'`, `'3639'` |
| `format` | Required | String | specify 'display' for this kind of inventory`                                                                                                                                                    |
| `server` | Optional | String | An Ampliffy-specific identifier that is associated with this ad unit`                                                                                                                            |

### Video

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description                                                                                                                                                                                                                                                                                                                                                                                                                    |
|---|---|---|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `placementId` | Required | String | An Ampliffy-specific identifier that is associated with this ad unit. It will be associated with the single size, if the size is provided. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'3723'`, `'6482'`, `'3639'`<br /> **Note:** You can re-use the existing `siteId` within the same flex position or video size, if the video adapts to the containing `<div>` element. |
| `format` | Required | String | specify 'video' for this kind of inventory`                                                                                                                                                                                                                                                                                                                                                                                    |
| `server` | Optional | String | An Ampliffy-specific identifier that is associated with this ad unit`                                                                                                                                                                                                                                                                                                                                                          |

## Examples

**Video (instream):** <br />

```javascript
var adUnits = [{
    code: 'video1',
    mediaTypes: {
        video: {
            playerSize: [[640, 480]],
            context: 'instream'
        },
    },
    bids: [{
        bidder: 'ampliffy',
        params: {
            server: 'bidder.ampliffy.com',
            placementId: '1213213/example/vrutal_/',
            format: 'video'
        }
    }]
}];

```
