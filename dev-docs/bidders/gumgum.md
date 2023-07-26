---
layout: bidder
title: GumGum
description: Prebid GumGum Bidder Adaptor
pbjs: true
pbs: true
pbs_app_supported: true
biddercode: gumgum
media_types: banner, video
schain_supported: true
floors_supported: true
userIds: unifiedId, identityLink
gdpr_supported: true
usp_supported: true
gpp_supported: true
sidebarType: 1
---

### Note

The GumGum Header Bidding adaptor requires setup and approval from the GumGum
team. Please reach out to your account manager or <support@gumgum.com> for more
information.

Client side and server side parameters differ slightly. For Server side (Prebid S2S) implementation,
 we currently accept the `zone` parameter. For Client side (Prebid.js) implementation, we accept `zone` and
 a long list of other parameters which are listed below.

### Server Side Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope                                                            | Description           | Example                | Type      |
|----------------|------------------------------------------------------------------|-----------------------|------------------------|-----------|
| `zone`         | required for all bid requests tracking a single domain or site   | Tracking ID           | `'ggumtest'`           | `string`  |
| `pubId`        | required for all bid requests tracking multiple domains or sites | Publisher ID          | `123`                  | `integer` |
| `irisid`       | optional                                                         | Iris.tv ID            | `'iris_6f9285823a4'`   | `string`  |
| `slot`         | optional                                                         | Placement ID          | `40`                   | `number`  |
| `product`      | required for new supported products like 'skins'                 | Product Type          | `skins`                | `string`  |

### Client Side Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope                                                            | Description           | Example                | Type      |
|----------------|------------------------------------------------------------------|-----------------------|------------------------|-----------|
| `zone`         | required for all bid requests tracking a single domain or site   | Tracking ID           | `'ggumtest'`           | `string`  |
| `pubId`        | required for all bid requests tracking multiple domains or sites | Publisher ID          | `123`                  | `integer` |
| `slot`         | required for slot placement only                                 | Slot ID               | `9`                    | `integer` |
| `product`      | required for new supported products like 'skins'                 | Product Type          | `skins`                | `string`  |
| `iriscat`      | optional                                                         | Iris.tv segments      | `'segment1,segment2'`  | `string`  |
| `irisid`       | optional                                                         | Iris.tv ID            | `'123'`                | `string`  |
| `bidfloor`     | optional                                                         | CPM bidfloor in USD   | `0.03`                 | `float`   |

### Legacy Client Side Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope                                      | Description           | Example                | Type      |
|----------------|--------------------------------------------|-----------------------|------------------------|-----------|
| `inScreen`     | required for in-screen placement only      | Tracking ID           | `'ggumtest'`           | `string`  |
| `inScreenPubID`| required for in-screen placement only      | Publisher ID          | `123`                  | `integer` |
| `inSlot`       | required for slot placement only           | Slot ID               | `9`                    | `integer` |
| `video`        | required for video placement only          | Tracking ID           | `'ggumtest'`           | `string`  |
| `videoPubID`   | required for video placement only          | Publisher ID          | `123`                  | `integer` |
| `inVideo`      | required for in-video placement only       | Tracking ID           | `'ggumtest'`           | `string`  |
| `ICV`          | required for ICV placement only            | ICV ID                | `19`                   | `integer` |
| `bidfloor`     | optional                                   | CPM bidfloor in USD   | `0.03`                 | `float`   |

Please note that both video and in-video products require a mediaType of video while all other products
require a mediaType of banner.

### Client Side Examples

Client side integration currently supports slot, in-screen, video, and in-video products.
The following examples are based on the 'Client Side Bid Params' table.
All bid requests require a zone or pubId parameter:

    {
        bidder: 'gumgum',
        params: {
            zone: 'zone_id' // provided by GumGum
        }
    }

To enable ad requests at a publisher level, instead of `zone` use `pubId`:

    {           
        bidder: 'gumgum',       
        params: {       
            pubId: pub_id // provided by GumGum     
        }       
    }      

#### In-Screen

To enable ad requests for in-screen, either `zone` or `pubId` must be present in the params object:

    {
        bidder: 'gumgum',
        params: {
            zone: 'zone_id' // provided by GumGum
        }
    }

#### Skins

Skins ad requests require the `product` parameter with the value of `skins` in the params object:

    {
        bidder: 'gumgum',
        params: {
            zone: 'zone_id', // provided by GumGum
            product: 'skins'
        }
    }

#### Slot

Slot ad requests require the `slot` parameter in the params object:

    {
        bidder: 'gumgum',
        params: {
            zone: 'zone_id', // provided by GumGum
            slot: 'slot_id' // provided by GumGum
        }
    }

#### Video and In-Video

For video and in-video products, please follow the configuration shown under the in-screen example.
Additionally, you will need to define a 'video' field in the 'mediaTypes' object. For example:

    {
        mediaTypes: {
            video: {
                context: 'instream',
                playerSize: [640, 480],
                minduration: 1,
                maxduration: 2,
                linearity: 1,  // ** Change this to 2 for in-video
                startdelay: 1,
                placement: 1,
                protocols: [1, 2]
            }
        }
    }

Please note:

All fields under video (context, playerSize, minDuration etc) are the minimum requirements to make a video ad request.
You should replace playerSize, minduration, maxduration, startdelay, placement, and protocols values to your
specifications (see [OpenRTB spec 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) for more information).
`linearity` should be set to 1 for video product, and 2 for in-video.

### Server Side Examples

At the moment, the only products supported via Prebid S2S are slot, in-screen, and video.
The configuration is similar to client side configuration.
Add the following object in your `bids` array:

    {
        bidder: 'gumgum',
        params: {
            zone: 'zone_id', // provided by GumGum
        }
    }

#### Slot

The mediaTypes field should have ‘banner’ with sizes using standard IAB display sizes (as seen in the example below).
The zone id is provided by GumGum.

    {
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [300, 600]]
            }
        },
        bids: [
            {
                bidder: 'gumgum',
                params: {
                    zone: 'zone_id' // zone id is provided by GumGum
                }
            },
        ]
    }

#### In-Screen

The adUnits settings for both in-screen and slot have a similar structure. The only difference between slot
and in-screen ad unit configuration is the sizes.
In-screen products require a non-standard IAB display size (e.g. [1, 1] as seen in the example below or any
other size you choose).

    {
        mediaTypes: {
            banner: {
                sizes: [[1, 1]]
            }
        },
        bids: [
            {
                bidder: 'gumgum',
                params: {
                    zone: 'zone_id' // zone id is provided by GumGum
                }
            },
        ]
    }

#### Skins

The skins product requires a similar setup to its client side header bidding counterpart:

    {
        bids: [
            {
                bidder: 'gumgum',
                params: {
                    zone: 'zone_id', // provided by GumGum
                    product: 'skins'
                }
            },
        ]
    }

#### Video

The video product requires nearly the same setup as with Prebid client side header bidding:

    {
        mediaTypes: {
            video: {
                context: 'instream',
                mimes: ['video/mp4'],
                playerSize: [640, 480],
                w: 640,
                h: 480,
                minduration: 1,
                maxduration: 2,
                linearity: 1,
                startdelay: 1,
                placement: 1,
                protocols: [1, 2]
            }
        },
        bids: [
            {
                bidder: 'gumgum',
                params: {
                    zone: 'zone_id' // zone id is provided by GumGum
                }
            },
        ]
    }

All fields under video (context, playerSize, minDuration etc) are the minimum requirements
to make a video ad request. Please replace playerSize, w, h, mimes, minduration, maxduration,
startdelay, and protocols values to your specifications (see [OpenRTB spec 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) for more information).
