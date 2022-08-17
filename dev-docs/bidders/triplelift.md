---
layout: bidder
title: TripleLift
description: Prebid TripleLift Bidder Adapter
biddercode: triplelift
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video
userIds: criteo, identityLink, unifiedId, pubCommonId
prebid_member: true
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
gvl_id: 28
---

### Table of Contents

- [Overview](#triplelift-overview)
- [Bid Parameters](#triplelift-bid-params)
- [Example Configuration](#triplelift-config) 
- [First Party Data](#triplelift-first-party)

<a name="triplelift-overview" />

### Overview

Publishers may integrate with Triplelift through our Prebid.js and/or Prebid Server adapters. See below for more information.

{% capture version2 %}
The Triplelift Prebid Server bidding adapter and user sync endpoint require setup before beginning. Please contact us at prebid@triplelift.com.
{% endcapture %}
{% include alerts/alert_important.html content=version2 %}

<a name="triplelift-bid-params" />

### Bid Params

#### Banner

{: .table .table-bordered .table-striped }

| Name            | Scope                        | Description                                                                          | Example                                     | Type     |
|-----------------|------------------------------|--------------------------------------------------------------------------------------|---------------------------------------------|----------|
| `inventoryCode` | required                     | TripleLift inventory code for this ad unit (provided to you by your partner manager) | `'pubname_top_banner'`                      | `string` |
| `floor`         | optional                     | Bid floor                                                                            | `1.00`                                      | `float`  |


#### Video


{: .table .table-bordered .table-striped }

| Name            | Scope                        | Description                                                                          | Example                                     | Type     |
|-----------------|------------------------------|--------------------------------------------------------------------------------------|---------------------------------------------|----------|
| `inventoryCode` | required                     | TripleLift inventory code for this ad unit (provided to you by your partner manager) | `'pubname_instream_1'`                      | `string` |
| `video`         | required                     | oRTB video object                                                                    | `{ mimes: ['video/mp4'], w: 640, h: 480 }`     | `object`  |
| `video.context`         | required             | Instream or Outstream (v7.9+ for all Outstream)                           | `instream`                                      | `string`  |
| `video.w`         | required                   | oRTB video object width dimension                                                    | `640`                                      | `int`  |
| `video.h`         | required                   | oRTB video object height dimension                                                   | `480`                                      | `int`  |
| `video.placement`         | optional                   | Instream: 1;      Outstream: 3, 4, 5.                                                   | `3`                                      | `int`  |

<a name="triplelift-config" />

### Example Configuration

#### Banner

```
var adUnits = [
    {
        code: 'top-banner',
        mediaTypes: {
            banner: {
                sizes: [
                    [728, 90],
                    [970, 250]
                ]
            }
    },
    bids: [{
        bidder: 'triplelift',
        params: {
            inventoryCode: 'pubname_top_banner'
        }
    }]
}];
```

#### Video (Instream)

```
var videoAdUnit = {
    code: 'video1',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'instream',
            placement: 1,
            mimes: ['video/mp4']
        }
    },
    bids: [{
        bidder: 'triplelift',
        params: {
            inventoryCode: 'pubname_instream1',
            video: {
                w: 640,
                h: 480
            }
        }
    }]
};
```

#### Video (Outstream)

```
var videoAdUnit = {
    code: 'video1',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'outstream',
            placement: 3,
            mimes: ['video/mp4']
        }
    },
    bids: [{
        bidder: 'triplelift',
        params: {
            inventoryCode: 'pubname_outstream',
            video: {
                w: 640,
                h: 480
            }
        }
    }]
};
```

<a name="triplelift-first-party" />

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The following fields are supported:
- `ortb2.site.*`: Standard IAB OpenRTB 2.5 site fields
- `ortb2.user.*`: Standard IAB OpenRTB 2.5 user fields

AdUnit-specific data is supported using `AdUnit.ortb2Imp.ext.*`