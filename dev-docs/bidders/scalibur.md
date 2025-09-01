---
layout: bidder
title: Scalibur
description: Prebid Scalibur Bidder Adapter
biddercode: scalibur
gvlid: 1471
media_types: banner, video
tcfeu_supported: true
gpp_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
userIds: all
pbs_app_supported: false
---

# Scalibur Bidder

## Description

The Scalibur Bid Adapter connects publishers to Scalibur's programmatic advertising platform. It supports both banner and video ad formats through OpenRTB 2.x protocol and provides full compliance with privacy regulations.

**Key Features:**

- Banner and Video (instream) ad support
- OpenRTB 2.x compliant requests
- Privacy regulation compliance
- First-party data collection and storage
- User sync capabilities (iframe and image)
- Supply chain transparency (schain)
- Floor pricing support
- First Party Data (FPD) support

## Bid Params
{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|---------------------------------------------|------------------------|----------|
| `placementId` | required | Placement identifier provided by Scalibur  | `'test-placement-123'` | `string` |

## Test Parameters

For testing purposes, you can use the following ad unit configurations:

### Banner Ad Unit

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

### Video Ad Unit

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

### Multi-format Ad Unit

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

## First Party Data

The adapter supports First Party Data (FPD) in multiple ways:

- **Global FPD**: Automatically includes `pbjs.setConfig({ortb2: {...}})` data
- **AdUnit FPD**: Includes ad unit specific `ortb2Imp` data
- **Local Storage**: Generates and stores first-party identifiers for enhanced targeting

## Supply Chain Transparency

The adapter supports the Supply Chain Object (schain) for transparency in programmatic advertising transactions, helping to combat fraud and improve trust between buyers and sellers.

## Floor Prices

The adapter respects floor prices set via:

- Prebid.js Price Floors module
- Ad unit level floor configuration
- Global floor configuration

## User Sync

The Scalibur adapter supports user synchronization through:
- **Iframe syncs**: For enhanced matching capabilities
- **Image syncs**: For lightweight synchronization

All privacy parameters are automatically included in sync requests.

## Configuration Example

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

## Support

For technical support or integration assistance:

- **Email**: support@scalibur.io
- **Documentation**: Contact Scalibur Support Team

## Notes

- The adapter requires a valid `placementId` parameter provided by Scalibur
- Video ads support instream context with standard IAB video parameters
- Banner ads support multiple sizes including standard IAB sizes
- All requests are sent via secure HTTPS endpoints
- The adapter automatically handles device detection and targeting
