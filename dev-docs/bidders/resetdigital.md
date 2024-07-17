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

### bid params

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description | Example                            | Type     |
|----------|----------|-------------|------------------------------------|----------|
| `pubId` | required |    Publisher Account ID provided by ResetDigital    | `'123pubId'` | `string` |
| `siteID` | optional |    Publisher Site ID         | `'123siteId'` | `string` |
| `zoneId` | optional |   Used for extra fields          | `{}` | `object` |
| `zoneId.placementId` | optional | ID used for reporting purposes | `"<id>"`    | `string` |
| `zoneId.deals` | optional | Deal IDs comma-separated | `"deal123,deal456"` | `string` |
| `zoneId.test` | optional | Flag to force bidder response with a creative | `1` | `integer` |
| `forceBid` | optional | Returns test bid | true | `boolean` |
| `position`     | optional           | Set the page position. Valid values are "atf" and "btf".                                                                    | `'atf'`                                                                             | `string`         |
| `bidFloor`       | optional           | Sets the global floor -- no bids will be made under this value.                                                             | `0.50`                                                                              | `float`          |
| `latLong`     | optional           | Sets the latitude and longitude for the visitor                                                                            | `[40.7608, 111.8910]`                                                               | `Array<float>`   |
| `inventory`   | optional           |  This parameter allows the definition of an object defining arbitrary key-value pairs concerning the page for use in targeting. The values must be arrays of strings. | `{"rating":["5-star"], "prodtype":["tech","mobile"]}`                               | `object`         |
| `visitor`      | optional           | This parameter allows the definition of an object defining arbitrary key-value pairs concerning the visitor for use in targeting. The values must be arrays of strings. | `{"ucat":["new"], "search":["iphone"]}`                                             | `object`         |
| `keywords`     | optional           | This can be used to influence reports for client-side display. To get video or server-side reporting, please use First Party data or the inventory/visitor parameters. | `["travel", "tourism"]`                                                             | `Array<string>`  |

#### mediaTypes.video

The following video parameters are supported here so publishers may fully declare their video inventory:

{: .table .table-bordered .table-striped }

| Name           | Scope              | Description                                                                                                                                                                                              | Example | Type      |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| context | required | instream or outstream |"outstream" | string |
| playerSize| required | width, height of the player in pixels | [640,360] - will be translated to w and h in bid request | array<integers> |
| mimes | required | List of content MIME types supported by the player (see openRTB v2.5 for options) | ["video/mp4"]| array<string>|
| protocols | required | Supported video bid response protocol values <br />1: VAST 1.0 <br />2: VAST 2.0 <br />3: VAST 3.0 <br />4: VAST 1.0 Wrapper <br />5: VAST 2.0 Wrapper <br />6: VAST 3.0 Wrapper <br />7: VAST 4.0 <br />8: VAST 4.0 Wrapper | [2,3,5,6] | array<integers>|
| api | required | Supported API framework values: <br />1: VPAID 1.0 <br />2: VPAID 2.0 <br />3: MRAID-1 <br />4: ORMMA <br />5: MRAID-2 | [2] |  array<integers> |
| linearity | required | OpenRTB2 linearity. 1: linear (in-stream ad), 2: non-linear (overlay ad) | 1 | integer |
| maxduration | recommended | Maximum video ad duration in seconds. | 30 | integer |
| minduration | recommended | Minimum video ad duration in seconds | 6 | integer |
| playbackmethod | recommended | Playback methods that may be in use. Only one method is typically used in practice. (see openRTB v2.5 section 5.10 for options)| [2]| array<integers> |
| skip | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes. | 1 | integer |
| skipafter| optional | Number of seconds a video must play before skipping is enabled; only applicable if the ad is skippable. | 6 | integer|
| minbitrate | optional | Minimum bit rate in Kbps. | 300 | integer |
| maxbitrate | optional | Maximum bit rate in Kbps. | 9600 | integer |
| startdelay | recommended | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements.<br /> >0: Mid-Roll (value indicates start delay in second)<br /> 0: Pre-Roll<br />-1: Generic Mid-Roll<br />-2: Generic Post-Roll | 0 | integer |
| placement | recommended | Placement type for the impression. (see openRTB v2.5 section 5.9 for options) | 1 | integer |


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

### Note

Prebid adapter for Reset Digital. Requires approval and account setup. Video is supported but requires a publisher supplied renderer at this time.
Please contact us at biddersupport@resetdigital.co
