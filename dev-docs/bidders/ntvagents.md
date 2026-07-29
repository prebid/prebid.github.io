---
layout: bidder
title: Native Agents
description: Native Agents Prebid Bidder Adapter
biddercode: ntvagents
gpp_supported: true
gpp_sids: usstate_all
tcfeu_supported: false
dsa_supported: false
usp_supported: true
coppa_supported: true
schain_supported:true
dchain_supported:false
deals_supported:false
floors_supported:true
fpd_supported:false
ortb_blocking_supported:false
media_types: banner, video, native
multiformat_supported: will-bid-on-one
userIds: all
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
safeframes_ok: true
sidebarType: 1
---

# Native Agents Bidder Adapter

The Native Agents bidder enables publishers to monetize their inventory through the Native Agents advertising platform using either **Prebid.js** or **Prebid Server**.

The adapter supports:

- Banner
- Native (OpenRTB Native)
- Video (Instream & Outstream)

Native Agents receives bid requests from Prebid, converts them into OpenRTB requests, executes an auction across eligible demand partners, and returns the highest qualifying bid to Prebid.

# Registration

Before integrating the Native Agents bidder, your inventory must be configured within the Native Agents platform.

During onboarding, Native Agents creates:

- A **Supply Source** representing your website or mobile application.
- One or more **Placements** representing individual ad locations on your inventory.

Each Placement receives a unique **placementId**, which is used by the bidder to identify the inventory during bidding.

Depending on your account configuration, Native Agents may instead provide an **endpointId**.

Only **one** identifier is required when configuring the bidder.

For onboarding and production credentials, contact your Native Agents account representative.

# Bid Parameters

Specify **either** `placementId` **or** `endpointId`.

Do **not** provide both.

{: .table .table-bordered .table-striped }

| Name        | Required | Description                                                                     | Type   | Example    |
|-------------|----------|---------------------------------------------------------------------------------|--------|------------|
| placementId | No*      | Unique identifier for a Placement configured within the Native Agents platform. | String | `"100001"` |
| endpointId  | No*      | Unique identifier for an Endpoint configured for your account.                  | String | `"200001"` |

\*One of `placementId` or `endpointId` is required.

# Banner Example

```javascript
var adUnits = [{
    code: "banner-div",

    mediaTypes: {
        banner: {
            sizes: [
                [300,250],
                [300,600]
            ]
        }
    },

    bids: [{
        bidder: "ntvagents",

        params: {
            placementId: "100001"
        }
    }]
}];
```

# Native Example

```javascript
var adUnits = [{
    code: "native-div",

    mediaTypes: {
        native: {
            ortb: {
                assets: [
                    {
                        id: 1,
                        required: 1,
                        title: {
                            len: 100
                        }
                    },
                    {
                        id: 2,
                        required: 1,
                        img: {
                            type: 3,
                            w: 300,
                            h: 250
                        }
                    },
                    {
                        id: 3,
                        required: 1,
                        data: {
                            type: 1
                        }
                    }
                ]
            }
        }
    },

    bids: [{
        bidder: "ntvagents",

        params: {
            placementId: "100001"
        }
    }]
}];
```

# Video Example

Both **Instream** and **Outstream** video contexts are supported.

```javascript
var adUnits = [{
    code: "video-div-instream",

    mediaTypes: {
        video: {
            context: "instream",
            playerSize: [640,480],
            mimes: ["video/mp4"],
            protocols: [2,3,5,6],
            api: [2],
            minduration: 5,
            maxduration: 30,
            linearity: 1
        }
    },

    bids: [{
        bidder: "ntvagents",

        params: {
            placementId: "100001"
        }
    }]
}];
```

```javascript
var adUnits = [{
    code: "video-div-outstream",

    mediaTypes: {
        video: {
            context: "outstream",
            playerSize: [640,480],
            mimes: ["video/mp4"],
            protocols: [2,3,5,6],
            api: [2],
            maxduration: 30,
            linearity: 1
        }
    },

    bids: [{
        bidder: "ntvagents",

        params: {
            placementId: "100001"
        }
    }]
}];
```

# OpenRTB Support

The Native Agents bidder converts Prebid bid requests into OpenRTB bid requests before forwarding them to the Native Agents bidding platform.

The adapter supports OpenRTB requests for:

- Banner
- Native
- Video (Instream & Outstream)

using the corresponding OpenRTB object definitions.

# Creative Rendering

The Native Agents bidder returns creatives compatible with standard Prebid rendering workflows.

Supported creative formats include:

| Media Type                   | Response              |
|------------------------------|-----------------------|
| Banner                       | HTML Markup           |
| Native                       | OpenRTB Native Assets |
| Video (Instream & Outstream) | VAST XML / VAST URL   |

Banner and Native creatives are rendered using Prebid's standard rendering pipeline.

Video responses return VAST-compatible creatives suitable for both instream video players and supported outstream video players.

# User Sync

Native Agents supports both iframe and image user synchronization.

```javascript
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: ["ntvagents"],
                filter: "include"
            },
            image: {
                bidders: ["ntvagents"],
                filter: "include"
            }
        }
    }
});
```

User synchronization is performed only when permitted by applicable privacy regulations.

# Test Parameters

Native Agents provides test placements during onboarding.

Replace the example values below with the test identifiers supplied by your Native Agents account representative.

```javascript
{
    bidder: "ntvagents",

    params: {
        placementId: "100001"
    }
}
```

# Notes

- Configure **either** `placementId` **or** `endpointId`.
- Banner, Native, and Video (Instream & Outstream) are supported.
- Compatible with both **Prebid.js** and **Prebid Server**.
- Inventory must be configured within the Native Agents platform before bid requests can be made.
- Native Agents also supports Direct Tag and JavaScript tag integrations outside of Prebid. Refer to the Native Agents integration documentation for those integration methods.
