---
layout: bidder
title: ResetDigital
description: Reset Digital Bidder Module
pbjs: true
pbs: true
biddercode: resetdigital
gvl_id: 1162
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
userIds: check with bidder
prebid_member: false
deals_supported: true
pbs_app_supported: true
multiformat_supported: will-bid-on-any
media_types: banner, video
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }

| Name         | Scope    | Description | Example       | Type     |
|--------------|----------|-------------|---------------|----------|
| `pubId`      | required | Publisher account id | `'123pubId'` | `string` |
| `siteID`     | optional | Publisher site id    | `'123siteId'` | `string` |
| `zoneId`     | optional | Additional parameters for the bid | `{}`          | `object` |
| `zoneId.placementId` | optional | ID used for reporting purposes | `"abc123"`    | `string` |
| `zoneId.deals` | optional | Deal IDs for preferred deals | `"deal123,deal456"` | `string` |
| `zoneId.test` | optional | Flag to force bidder response with a creative | `1` | `integer` |
| `forceBid`   | optional | Returns test bid     | true          | `boolean` |
| `position`   | optional | Page position        | `'atf'`       | `string` |
| `bidFloor`   | optional | Global floor value   | `0.50`        | `float`  |
| `latLong`    | optional | Visitor's latitude and longitude | `[40.7608, 111.8910]` | `Array<float>` |
| `inventory`  | optional | Arbitrary key-value pairs for page targeting | `{"rating":["5-star"], "prodtype":["tech","mobile"]}` | `object` |
| `visitor`    | optional | Arbitrary key-value pairs for visitor targeting | `{"ucat":["new"], "search":["iphone"]}` | `object` |
| `keywords`   | optional | Keywords for client-side display | `["travel", "tourism"]` | `Array<string>` |

### Media Types

#### banner

{: .table .table-bordered .table-striped }

| Name     | Scope       | Description                        | Example            | Type             |
|----------|-------------|------------------------------------|--------------------|------------------|
| `sizes`  | required    | Sizes of the banner ad unit        | `[[300, 250]]`     | `Array<integers>` |

#### video

{: .table .table-bordered .table-striped }

| Name            | Scope       | Description                        | Example            | Type             |
|-----------------|-------------|------------------------------------|--------------------|------------------|
| `playerSize`    | required    | Size of the video player           | `[640, 480]`       | `Array<integers>` |
| `context`       | required    | Video context (instream/outstream) | `'outstream'`      | `string`          |
| `mimes`         | required    | Supported video MIME types         | `["video/mp4"]`    | `Array<string>`   |
| `protocols`     | required    | Supported video protocols          | `[2,3,5,6]`        | `Array<integers>` |
| `api`           | required    | Supported API frameworks           | `[2]`              | `Array<integers>` |
| `linearity`     | required    | Video linearity                    | `1`                | `integer`         |
| `maxduration`   | recommended | Maximum ad duration in seconds     | `30`               | `integer`         |
| `minduration`   | recommended | Minimum ad duration in seconds     | `6`                | `integer`         |
| `playbackmethod`| recommended | Playback methods                   | `[2]`              | `Array<integers>` |
| `skip`          | optional    | Allow skipping                     | `1`                | `integer`         |
| `skipafter`     | optional    | Skip after seconds                 | `6`                | `integer`         |
| `minbitrate`    | optional    | Minimum bit rate (Kbps)            | `300`              | `integer`         |
| `maxbitrate`    | optional    | Maximum bit rate (Kbps)            | `9600`             | `integer`         |
| `startdelay`    | recommended | Start delay for ad                 | `0`                | `integer`         |
| `placement`     | recommended | Placement type                     | `1`                | `integer`         |

### Code Examples

#### Banner Ad Unit

Define the ad units for banner ads:

```javascript
var adUnits = [
    {
        code: 'your-div', // Replace with the actual ad unit code
        mediaTypes: {
            banner: {
                sizes: [[300, 250]] // Define the sizes for banner ads
            }
        },
        bids: [
            {
                bidder: "resetdigital",
                params: {
                    pubId: "your-pub-id", // Replace with your publisher ID
                    siteID: "your-site-id", // Replace with your site ID
                    endpoint: 'https://ads.resetsrv.com', // Optional: Endpoint URL for the ad server
                    forceBid: true, // Optional parameter to force the bid
                    zoneId: {
                        placementId: "abc123", // Optional ID used for reports
                        deals: "deal123,deal456", // Optional string of deal IDs, comma-separated
                        test: 1 // Set to 1 to force the bidder to respond with a creative
                    }
                }
            }
        ]
    }
];
