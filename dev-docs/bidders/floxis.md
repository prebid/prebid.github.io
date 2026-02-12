---
layout: bidder
title: Floxis
description: Prebid Floxis Bidder Adapter
biddercode: floxis
pbjs: true
pbs: false
media_types: banner, video, native
safeframes_ok: true
sidebarType: 1
tcfeu_supported: true
dsa_supported: false
gvl_id: none
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: true
dchain_supported: false
deals_supported: false
floors_supported: yes
fpd_supported: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: no
---

### Note

The Floxis bidder adapter enables integration with the Floxis programmatic advertising platform via Prebid.js. It supports banner, video, and native formats, and is designed for multi-partner, multi-region use. Please contact Floxis to set up your partner account and obtain the required parameters.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
|------|-------|-------------|---------|------|
| `partner` | required | Partner identifier provided by Floxis | `"floxis"` | `string` |
| `placementId` | required | Placement identifier provided by Floxis | `123` | `integer` |
| `bcat` | optional | Blocked advertiser categories (IAB taxonomy) | `['IAB1-1', 'IAB25-2']` | `array` |
| `badv` | optional | Blocked advertiser domains | `['competitor.com', 'example.com']` | `array` |
| `bapp` | optional | Blocked mobile app bundle IDs | `['com.example.app']` | `array` |
| `battr` | optional | Blocked creative attributes | `[1, 2, 3]` | `array` |

### ORTB Blocking Support

The Floxis adapter supports OpenRTB blocking parameters in two ways:

- **Bidder-specific blocking**: Configure blocking parameters directly in `params` for granular control
- **Global blocking**: Configure `ortb2.bcat` and `ortb2.badv` in `pbjs.setConfig()` for site-wide blocking
- **Category blocking**: Use `bcat` parameter with IAB category codes
- **Advertiser blocking**: Use `badv` parameter with advertiser domains
- **App blocking**: Use `bapp` parameter with mobile app bundle IDs
- **Creative attribute blocking**: Use `battr` parameter with creative attribute IDs

### Floors Support

The Floxis adapter supports Prebid.js floors module:

- **Global floors**: Configure floors globally using `pbjs.setConfig({ floors: {...} })`
- **AdUnit floors**: Set floor prices per ad unit using the `floors` object
- **Dynamic floors**: Supports endpoint-based floor fetching
- **Currency support**: Floors can be set in different currencies (converted automatically)

### First Party Data

The adapter supports first party data through standard Prebid.js mechanisms:

- **Global FPD**: Set via `ortb2` in `pbjs.setConfig()`
- **AdUnit FPD**: Set via `ortb2Imp` on individual ad units
- **User FPD**: Passed through `ortb2.user` object
- **Site FPD**: Passed through `ortb2.site` object

### AdUnit Configuration for Banner

```javascript
var adUnits = [{
    code: 'banner-ad-div',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [728, 90]]
        }
    },
    bids: [{
        bidder: 'floxis',
        params: {
            partner: 'floxis',
            placementId: 123,
            bcat: ['IAB1-1', 'IAB25-2'],
            badv: ['competitor.com', 'example.com'],
            battr: [1, 2, 3]
        }
    }],
    floors: {
        currency: 'USD',
        schema: {
            delimiter: '|',
            fields: ['mediaType', 'size']
        },
        values: {
            'banner|300x250': 0.50,
            'banner|728x90': 0.75,
            '*': 0.25
        }
    },
    ortb2Imp: {
        ext: {
            data: {
                adserver: {
                    name: 'gam',
                    adslot: '/1234/homepage'
                }
            }
        }
    }
}];
```

### AdUnit Configuration for Video

```javascript
var adUnits = [{
    code: 'video-ad-div',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [[640, 480]],
            mimes: ['video/mp4'],
            protocols: [2, 3, 5, 6],
            minduration: 5,
            maxduration: 30
        }
    },
    bids: [{
        bidder: 'floxis',
        params: {
            partner: 'floxis',
            placementId: 456,
            bcat: ['IAB23', 'IAB24'],
            badv: ['competitor.com']
        }
    }],
    floors: {
        currency: 'USD',
        schema: {
            delimiter: '|',
            fields: ['mediaType']
        },
        values: {
            'video': 1.00,
            '*': 0.50
        }
    },
    ortb2Imp: {
        ext: {
            data: {
                pbadslot: 'homepage-video',
                adserver: {
                    name: 'gam',
                    adslot: '/1234/video'
                }
            }
        }
    }
}];
```

### AdUnit Configuration for Native

```javascript
var adUnits = [{
    code: 'native-ad-div',
    mediaTypes: {
        native: {
            title: {
                required: true,
                len: 80
            },
            body: {
                required: true
            },
            image: {
                required: true,
                sizes: [150, 50]
            },
            sponsoredBy: {
                required: true
            }
        }
    },
    bids: [{
        bidder: 'floxis',
        params: {
            partner: 'floxis',
            placementId: 789,
            bcat: ['IAB25-1', 'IAB25-2'],
            bapp: ['com.example.app', 'com.competitor.app']
        }
    }],
    floors: {
        currency: 'USD',
        schema: {
            delimiter: '|',
            fields: ['mediaType']
        },
        values: {
            'native': 0.75,
            '*': 0.30
        }
    },
    ortb2Imp: {
        ext: {
            data: {
                pbadslot: 'homepage-native'
            }
        }
    }
}];
```

### Example

```javascript
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    // Configure global floors
    pbjs.setConfig({
        floors: {
            enforcement: {
                enforceJS: true,
                enforcePBS: false,
                floorDeals: true
            },
            auctionDelay: 100,
            endpoint: {
                url: 'https://yourdomain.com/floors_endpoint.json'
            },
            data: {
                currency: 'USD',
                modelVersion: 'new model 1.0',
                skipRate: 0,
                schema: {
                    delimiter: '|',
                    fields: ['gptSlot', 'adUnitCode']
                },
                values: {
                    'homepage|div-gpt-ad-1234567890123-0': 0.50,
                    '*': 0.25
                }
            }
        }
    });

    pbjs.addAdUnits([{
        code: 'div-gpt-ad-1234567890123-0',
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [320, 50]]
            }
        },
        bids: [{
            bidder: 'floxis',
            params: {
                partner: 'floxis',
                placementId: 123,
                bcat: ['IAB23', 'IAB25-2'],
                badv: ['competitor1.com', 'competitor2.com']
            }
        }],
        ortb2Imp: {
            ext: {
                data: {
                    pbadslot: 'homepage-banner',
                    adserver: {
                        name: 'gam',
                        adslot: '/1234/homepage'
                    }
                }
            }
        }
    }]);

    pbjs.requestBids({
        timeout: 3000,
        bidsBackHandler: function(bidResponses) {
            // Handle bid responses
            pbjs.setTargetingForGPTAsync();
        }
    });
});
```
