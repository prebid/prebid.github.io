---
layout: bidder
title: Scalibur
description: Prebid Scalibur Bidder Adapter
biddercode: scalibur
gvl_id: 1471
media_types: banner, video
gpp_sids: tcfeu, usstate_all, usp
coppa_supported: true
schain_supported: true
dchain_supported: false
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: true
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
userIds: all
pbs_app_supported: false
---

The Scalibur Bid Adapter connects publishers to Scalibur's programmatic advertising platform. It supports both banner and video ad formats through OpenRTB 2.6 protocol and provides full compliance with privacy regulations.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description | Example |
| ---- | ----- | ---- | ----------- | ------- |
| `placementId` | required | String | Placement identifier provided by Scalibur | `'test-placement-123'` |
| `bidfloor` | optional | Float | Fallback minimum CPM for the impression | `0.50` |
| `bidfloorcur` | optional | String | Currency for the bid floor | `'USD'` |

### Test Parameters

For testing purposes, you can use the following ad unit configurations:

#### Banner Ad Unit

```javascript
var adUnits = [
    {
        code: 'test-banner-div',
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [728, 90], [320, 50]]
            }
        },
        bids: [
            {
                bidder: 'scalibur',
                params: {
                    placementId: 'test-scl-placement'
                }
            }
        ]
    }
];
```

#### Video Ad Unit

```javascript
var adUnits = [
  {
    code: 'test-video-div', 
    mediaTypes: {
      video: {
        playerSize: [[640, 480]],
        context: 'instream',
        mimes: ['video/mp4'],
        protocols: [2, 3, 5, 6],
        minduration: 5,
        maxduration: 30,
        startdelay: 0,
        playbackmethod: [1, 2],
        api: [1, 2]
      }
    },
    bids: [
      {
        bidder: 'scalibur',
        params: {
          placementId: 'test-scl-placement' // Required
        }
      }
    ]
  }
];
```

#### Multi-format Ad Unit

```javascript
var adUnits = [
    {
        code: 'test-multiformat-div',
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [728, 90]]
            },
            video: {
                context: 'instream',
                playerSize: [[300, 169]],
                mimes: ['video/mp4'],
                protocols: [2, 3, 5, 6],
                minduration: 15,
                maxduration: 30
            }
        },
        bids: [
            {
                bidder: 'scalibur',
                params: {
                    placementId: 'test-scl-placement'
                }
            }
        ]
    }
];
```

### Prebid Server Configuration (S2S)

Scalibur supports Server-to-Server bidding through Prebid Server. To enable this, include `scalibur` in your `s2sConfig`.

```javascript
pbjs.setConfig({
    s2sConfig: {
        endpoint: 'https://prebid-server.example.com/openrtb2/auction',
        enabled: true,
        bidders: ['scalibur'],
        timeout: 1000
    }
});
```

### Video Support

The adapter supports Video via both direct VAST XML and VAST URLs. For bids returned with a VAST URL, the server-side adapter automatically generates a VAST 3.0 wrapper to ensure player compatibility.

### First Party Data

The adapter supports First Party Data (FPD) in multiple ways:

- **Global FPD**: Automatically includes `pbjs.setConfig({ortb2: {...}})` data
- **AdUnit FPD**: Includes ad unit specific `ortb2Imp` data
- **Local Storage**: Generates and stores first-party identifiers for enhanced targeting

### User Sync

The Scalibur adapter supports user synchronization to maximize bid value:

- **Client-Side**: Supports `iframe` and `image` syncs.
- **Server-Side**: Uses `iframe` sync managed via Prebid Server's `/cookie_sync` and `/setuid` endpoints.

All privacy parameters are automatically included in sync requests.

#### Configuration Example

```javascript
pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);

    pbjs.setConfig({
        debug: true,
        userSync: {
            filterSettings: {
                iframe: {
                    bidders: ['scalibur'],
                    filter: 'include'
                },
                image: {
                    bidders: ['scalibur'],
                    filter: 'include'
                }
            }
        }
    });

    pbjs.requestBids({
        timeout: 3000,
        bidsBackHandler: function(bidResponses) {
            // Handle bid responses
        }
    });
});
```

### Support

For technical support or integration assistance:

- **Email**: [support@scalibur.io](mailto:support@scalibur.io)
- **Documentation**: Contact Scalibur Support Team

### Notes

- **Multi-format**: Fully supports multi-format ad units by utilizing the `mtype` field in the OpenRTB response.
- Video ads support instream context with standard IAB video parameters
- Banner ads support multiple sizes including standard IAB sizes
- All requests are sent via secure HTTPS endpoints
- The adapter automatically handles device detection and targeting
