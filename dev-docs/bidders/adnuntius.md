---
layout: bidder
title: Adnuntius
description: Prebid Adnuntius Bidder Adaptor
pbjs: true
pbs: true
biddercode: adnuntius
media_types: banner, video
tcfeu_supported: true
fpd_supported: true
gvl_id: 855
safeframes_ok: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
floors_supported: false
sidebarType: 1

---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------------|----------|----------------------------------------------------------------------|----------|----------|
| `auId` | required | The ad unit ID `'0000000000072345'` leading zeros can be omitted. | `'0000000000072345'` | `string` |
| `network` | optional | Used if you want to make requests to multiple networks in adnuntius. | `'adnuntius'` | `string`|
| `userId` | optional | Allows you to set a specific user id in the request. | `'userId'` | `string`|
| `targeting` | optional | Targeting to be sent through to adnuntius with the request. | `{ c: ['prebids'] }` | `string`|
| `maxDeals` | optional | The maximum number of deal bids to include. Default 0. | `1` | `Integer` |
| `bidType` | optional | Whether to use `grossBid` or `netBid` from the server response as the cpm bid. Default is `grossBid`. | `grossBid` | `string` |

The `bidType` can also be set under `config` in the bidderSettings.

#### Targeting

The [Adnuntius Documentation](https://docs.adnuntius.com/adnuntius-advertising/requesting-ads/intro) provides detailed information on sending targeting data to the Adnuntius adserver.

#### Example

Here's an example of sending targeting information about categories to adnuntius via the bid request:

```json
{
    "code": "0000000000072345",
    "mediaTypes": {
        "banner": {
            "sizes": [[980, 360], [980, 300], [980, 240], [980, 120]]
        }
    },
    "bids": [
        {
            "bidder": "adnuntius",
            "params": {
                "auId": "8b6bc",
                "network": "adnuntius",
                "userId": "<USERID>",
                "targeting": {
                    "c": ["prebids"]
                }
            }
        }
    ]
}
```

### Sending segments to the ad server

There's an option to send segment id in the bidder config that will be picked up and sent to the ad server. Below is an example on how to do this:

```js
pbjs.setBidderConfig({
    bidders: ['adnuntius', 'bidderB'],
    config: {
        ortb2: {
            user: {
                data: [{
                    name: "adnuntius",
                    segment: [
                        { id: "1" },
                        { id: "2" }
                    ]
                }]
            }
        }
    }
});
```

### Disable cookies for Adnuntius

You have the option to tell adnuntius not to set cookies in your browser. This does not mean that third party ads being served through the ad server will not set cookies. Just that Adnuntius will not set it for internal ads.

```js
pbjs.setBidderConfig({
    bidders: ['adnuntius'],
    config: {
        useCookie: false
    }
});
```

Use cookie will always be set to true by default. Changing it to false will disable cookies.

### Trigger Advertiser Transparency Mode in Adnuntius

You have the option to tell Adnuntius to only serve ads that have their Advertiser's legal name specified. 

```js
pbjs.setBidderConfig({
    bidders: ['adnuntius'],
    config: {
        advertiserTransparency: true
    }
});
```

By default, `advertiserTransparency` is set to `false`, meaning there is no restriction on which ads can deliver. By setting `advertiserTransparency` to `true`, ad delivery is restricted to those that have their Advertiser's legal name specified.

### Prebid Server Test Request

The following test parameters can be used to verify that Prebid Server is working properly with the server-side Adnuntius adapter. the `auId` below will not return a creative. Please substitute it with your own.

```json
{
    "imp": [{
        "id": "impression-id",
        "banner": {
            "format": [{
                "w": 980,
                "h": 240
            }, {
                "w": 980,
                "h": 360
            }]
        },
        "ext": {
            "adnuntius": {
                "auId": "abc123",
                "maxDeals": 2 // Optional
            }
        }
    }]
}
```

### Passing no Cookie in Prebid Server request

As a publisher you have the option to set no cookie in the device request to let Adnuntius adserver know not to set cookies in the client's browser. In order to do that you just need to pass this in the request:

```json
{
    "device": {  
        "ext": {
            "noCookies": true
        }
    }
}
```

### First Party Data

publishers can use the `ortb2` configuration parameter to provide First Party Data. We accept all standard OpenRTB fields for both:

- `ortb2.site`
- `ortb2.user`

These fields are optional and only needed for user identification and contextual targeting. How to use it can be read here: [Prebid ortb2](https://docs.prebid.org/features/firstPartyData.html). Currently we only support this for our prebid server bidder, but will add it to the client bidder in the future.

### Video requests

Currently we only support client requests and instream context. An example request would look like this:

```json
{
    "code": "video1",
    "mediaTypes": {
        "video": {
            "playerSize": [640, 480],
            "context": "instream"
        }
    },
    "bids": [{
        "bidder": "adnuntius",
        "params": {
            "auId": "00000000001cd429", //put your placement id here

            "video": {
                "skippable": true,
                "playback_method": ["auto_play_sound_off"]
            }
        }
    }]
};
```
