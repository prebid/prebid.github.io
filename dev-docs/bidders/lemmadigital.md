---
layout: bidder
title: LemmaDigital
description: Prebid Lemmadigital Bidder Adapter
biddercode: lemmadigital
media_types: video,banner
pbjs: true
schain_supported: true
floors_supported: true
userIds: all
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `pubId` | required | Lemmadigital publisher Id provided by your Lemma representative   | `1` | `integer` |
| `adunitId` | required | Lemmadigital ad unit Id provided by your Lemma representative   | `3768` | `string` |
| `device_type`         | optional | Device Type              | `'2'`             | `integer` |
| `latitude`         | optional | Latitude              | `'40.712775'`             | `string` |
| `longitude`         | optional | Longitude             | `'-74.005973'`            | `string` |
| `currency`         | optional | Currency             | `'USD'`            | `string` |
| `bidFloor`         | optional | Bid Floor             | `1.00`            | `integer` |
| `category`         | optional | Allowed categories             | `[ 'IAB1-5', 'IAB1-6' ]`            | `array of strings` |
| `page_category`         | optional | Allowed page categories             | `[ 'IAB1-5', 'IAB1-6' ]`            | `array of strings` |

### Description
Get access to multiple demand partners across lemmadigital AdExchange and maximize your yield with lemmadigital header bidding adapter.

lemmadigital header bidding adapter connects with lemmadigital demand sources in order to fetch bids. This adapter provides a solution for accessing Video demand and display demand.

### video parameters
The Lemmadigital adapter supports video

{: .table .table-bordered .table-striped }
| Name 					 | Scope    | Description        										  | Example |
| :----------------------| :------- | :---------------------------------------------------------- | :------ |
| `video.mimes` 		 | required | Video MIME types 											  | `['video/mp4','video/x-flv']` |
| `video.skippable` 	 | optional | If 'true', user can skip ad 								  | `true` |
| `video.minduration` 	 | optional | Minimum ad duration in seconds							  | `5` |
| `video.maxduration`  	 | optional | Maximum ad duration in seconds 							  | `30` |
| `video.protocols` 	 | optional |  Supported video bid response protocols<br/>Values<br/>`1`: VAST 1.0<br/>`2`: VAST 2.0<br/>`3`: VAST 3.0<br/> `4`: VAST 1.0 Wrapper<br/>`5`: VAST 2.0 Wrapper<br/>`6`: VAST 3.0 Wrapper			| `[5, 6]` |

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
