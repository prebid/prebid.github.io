---
layout: bidder
title: TripleLift
description: Prebid TripleLift Bidder Adapter
biddercode: triplelift
tcfeu_supported: true
usp_supported: true
gpp_supported: true
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
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Bid Params](#bid-params)
  - [Banner](#banner)
  - [Video](#video)
- [Example Configuration](#example-configuration)
  - [Banner](#banner-configuration)
  - [Video (Instream)](#video-instream)
  - [Video (Outstream)](#video-outstream)
- [First Party Data](#first-party-data)
- [Programmatic DMP](#triplelift-programmatic-dmp)

<a name="triplelift-overview"></a>

### Overview

Publishers may integrate with Triplelift through our Prebid.js and/or Prebid Server adapters. See below for more information.

{: .alert.alert-info :}
The Triplelift Prebid Server bidding adapter and user sync endpoint require setup before beginning. Please contact us at <prebid@triplelift.com>.

<a name="triplelift-bid-params"></a>

### Bid Params

#### Banner

{: .table .table-bordered .table-striped }

| Name            | Scope                        | Description                                                                          | Example                                     | Type     |
|-----------------|------------------------------|--------------------------------------------------------------------------------------|---------------------------------------------|----------|
| `inventoryCode` | required                     | TripleLift inventory code for this ad unit (provided to you by your partner manager) | `'pubname_top_banner'`                      | `string` |
| `floor`         | optional                     | Bid floor                                                                            | `1.00`                                      | `float`  |

#### Video

Triplelift bid params for video mediaTypes are identical, but be sure to include the appropriate video.placement value to indicate instream/outstream format. Speak with your partner manager about which value to place here based on what formats are enabled.

See the [Ad Unit Reference](https://docs.prebid.org/dev-docs/adunit-reference.html#adunitmediatypesvideo) for more info.

{: .table .table-bordered .table-striped }

| Name            | Scope                        | Description                                                                          | Example                                     | Type     |
|-----------------|------------------------------|--------------------------------------------------------------------------------------|---------------------------------------------|----------|
| `adUnit.mediaTypes.video.placement`         | required                   | Instream: 1;      Outstream: 3, 4, 5.                      | `3`                                         | `int`  |
| `adUnit.mediaTypes.video.playerSize` | required | Video player dimensions or size in pixels | `[640, 480]` | `integer array` |

<a name="triplelift-config"></a>

### Example Configuration

#### Banner Configuration

```javascript
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

```javascript
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
            inventoryCode: 'pubname_instream1'
        }
    }]
};
```

#### Video (Outstream)

```javascript
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
        }
    }]
};
```

<a name="triplelift-first-party"></a>

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The following fields are supported:

- `ortb2.site.*`: Standard IAB OpenRTB 2.5 site fields
- `ortb2.user.*`: Standard IAB OpenRTB 2.5 user fields

AdUnit-specific data is supported using `AdUnit.ortb2Imp.ext.*`

<a name="triplelift-programmatic-dmp"></a>

### Programmatic DMP

Triplelift provides audience and contextual targeting via the integration of a Programmatic DMP tag. Please reach out to your Triplelift representative to discuss specifics of the integration.

#### Requirements

- Prebid v7.1.0 or later
- In Prebid's `bidderSettings`, the `storageAllowed` parameter must be set to **true**. In Prebid v7.0 and later, `storageAllowed` defaults to false, so you will need to explicitly set this value to true.

{% include dev-docs/storageAllowed.md %}

```javascript
        pbjs.bidderSettings = {
            triplelift: {
                storageAllowed: true
            }
        }
```

- The Programmatic DMP **tag** must be included at the top of every webpage in order to collect audience and contextual information on the respective page.
- The Programmatic DMP **tag** should be as high up in `<head>` as possible.
