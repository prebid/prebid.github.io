---
layout: bidder
title: Media Consortium
description: Prebid Media Consortium Bidder Adapter
biddercode: mediaConsortium
media_types: banner, video
pbjs: true
userId: all
multiformat_supported: will-bid-on-any
sidebarType: 1
---

MediaConsortium doesn't require inventory parameters - we'll match your inventory using a combination of ad unit code and domain. You can optionally set a `placementCode` to identify the placement instead of the ad unit code.

## Bid Params

{: .table .table-bordered .table-striped }

| Name            | Scope    | Description                                                                                         | Example      | Type     |
|-----------------|----------|-----------------------------------------------------------------------------------------------------|--------------|----------|
| `placementCode` | optional | Identifier of the placement. If absent, the ad unit code is used to identify the placement instead. | `'banner-1'` | `string` |

```javascript
    const adUnits = [
        {
            code: 'div-prebid-banner',
            mediaTypes: {
                banner: {
                    sizes: [[300, 250]]
                }
            },
            bids: [
                {
                    bidder: 'mediaConsortium',
                    params: {
                        placementCode: 'banner-1'
                    }
                }
            ]
        }
    ];
```

## Prebid JS configuration

To get access to the full feature set of the adapter you'll need to allow localstorage usage in the `bidderSettings`.

{% include dev-docs/storageAllowed.md %}

```javascript
    pbjs.bidderSettings = {
        mediaConsortium: {
            storageAllowed: true
        }
    }
```

MediaConsortium uses the 1plusX user id (fpid) and profile API to retrieve audience and site specific segments. You can manage 1plusX usage with the settings outlined below.

### Managing 1plusX profile API usage and fpid retrieval

You can use the `setBidderConfig` function to enable or disable 1plusX profile API usage and fpid retrieval.

If the keys found below are not defined, their values will default to `false`.

```javascript
    pbjs.setBidderConfig({
        bidders: ['mediaConsortium'],
        config: {
            // Controls the 1plusX profile API usage
            useProfileApi: true,
            // Controls the 1plusX fpid retrieval
            readOnePlusXId: true
        }
    });
```

### Required pbjs ad unit video parameters

| Name       | Scope    | Description                               | Example        | Type                 |
|------------|----------|-------------------------------------------|----------------|----------------------|
| playerSize | required | Array of sizes accepted by the player     | `[[300, 250]]` | `[number, number][]` |
| context    | required | Video context, must always be `outstream` | `outstream`    | `string`             |

#### Example ad unit

```javascript
    const adUnits = [
        {
            code: 'div-prebid-video',
            mediaTypes:{
                video: {
                    playerSize: [[300, 250]],
                    context: 'outstream'
                }
            },
            bids:[
                {
                    bidder: 'mediaConsortium',
                    params: {}
                }
            ]
        }
    ];
```
