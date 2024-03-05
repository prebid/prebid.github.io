---
layout: bidder
title: LemmaDigital
description: Prebid Lemmadigital Bidder Adapter
biddercode: lemmadigital
media_types: video,banner
pbjs: true
pbs: true
schain_supported: true
floors_supported: true
pbs_app_supported: true
multiformat_supported: will-bid-on-one
safeframes_ok: true
ortb_blocking_supported: partial
userIds: all
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `pid` | required (for prebid-server) | Lemmadigital publisher Id provided by your Lemma representative   | `1` | `integer` |
| `aid` | required (for prebid-server) | Lemmadigital ad unit Id provided by your Lemma representative   | `3768` | `integer` |
| `pubId` | required (for prebid.js) | Lemmadigital publisher Id provided by your Lemma representative   | `1` | `integer` |
| `adunitId` | required (for prebid.js) | Lemmadigital ad unit Id provided by your Lemma representative   | `3768` | `string` |
| `device_type`         | optional (for prebid.js) | Device Type              | `'2'`             | `integer` |
| `latitude`         | optional (for prebid.js) | Latitude              | `'40.712775'`             | `string` |
| `longitude`         | optional (for prebid.js) | Longitude             | `'-74.005973'`            | `string` |
| `currency`         | optional (for prebid.js) | Currency             | `'USD'`            | `string` |
| `bidFloor`         | optional (for prebid.js) | Bid Floor             | `1.00`            | `integer` |
| `category`         | optional (for prebid.js) | Allowed categories             | `[ 'IAB1-5', 'IAB1-6' ]`            | `array of strings` |
| `page_category`         | optional (for prebid.js) | Allowed page categories             | `[ 'IAB1-5', 'IAB1-6' ]`            | `array of strings` |

### Description

Get access to multiple demand partners across lemmadigital AdExchange and maximize your yield with lemmadigital header bidding adapter.

lemmadigital header bidding adapter connects with lemmadigital demand sources in order to fetch bids. This adapter provides a solution for accessing Video demand and display demand.

### video parameters

The Lemmadigital adapter supports video

{: .table .table-bordered .table-striped }
| Name                   | Scope    | Description                                                 | Example |
| :----------------------| :------- | :---------------------------------------------------------- | :------ |
| `video.mimes`          | required | Video MIME types                                            | `['video/mp4','video/x-flv']` |
| `video.skippable`      | optional | If 'true', user can skip ad                                 | `true` |
| `video.minduration`    | optional | Minimum ad duration in seconds                              | `5` |
| `video.maxduration`    | optional | Maximum ad duration in seconds                              | `30` |
| `video.protocols`      | optional |  Supported video bid response protocols<br/>Values<br/>`1`: VAST 1.0<br/>`2`: VAST 2.0<br/>`3`: VAST 3.0<br/> `4`: VAST 1.0 Wrapper<br/>`5`: VAST 2.0 Wrapper<br/>`6`: VAST 3.0 Wrapper            | `[5, 6]` |

### AdUnit Format for Video

```javascript
var videoAdUnits = [
{
    code: 'test-div-video',
    mediaTypes: {
        video: {
            playerSize: [640, 480],   // required
            context: 'instream'
        }
    },
    bids: [{
      bidder: 'lemmadigital',
      params: {
        pubId: 1,                     // required
        adunitId: '3769'              // required
        latitude: 37.3230,            // optional
        longitude: -122.0322,         // optional
        device_type: 4,               // optional
        video: {
          mimes: ['video/mp4','video/x-flv'],   // required
          skip: 1,                              // optional
          minduration: 5,                       // optional
          maxduration: 30,                      // optional
          protocols: [ 2, 3 ],                  // optional
        }
      },
    }]
}]
```

### AdUnit Format for Banner

```javascript
var bannerAdUnits = [
{
    code: 'test-div-banner',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [300, 600]],  // required
      }
    },
    bids: [{
      bidder: 'lemmadigital',
      params: {
        pubId: 1,                     // required
        adunitId: '3769'              // required
        latitude: 37.3230,            // optional
        longitude: -122.0322,         // optional
        device_type: 2,               // optional
      },
    }]
}]
```

### Additional Configuration

Lemmadigital recommends setting UserSync by iframe for monetization.

### Prebid Server Test Request

The following test request can be used to verify that Prebid Server is working properly with the lemmadigital adapter. This example includes an `imp` object with a Lemma test publisher id, and ad id.

```json
{
        "id": "test-request-id",
        "imp": [{
            "id": "test-imp-id",
            "banner": {
                "format": [{
                    "w": 1920,
                    "h": 1080
                }],
                "w": 1920,
                "h": 1080
            },
            "ext": {
                "lemmadigital": {
                    "aid": 3768,
                    "pid": 1
                }
            },
            "bidfloor": 0.1
        }],
        "device": {
            "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
        },
        "site": {
            "id": "siteID",
            "publisher": {
                "id": "1"
            }
        }
}
```
