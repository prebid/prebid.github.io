---
layout: bidder
title: Adnuntius
description: Prebid Adnuntius Bidder Adaptor
pbjs: true
pbs: true
biddercode: adnuntius
media_types: banner
gdpr_supported: true
fpd_supported: true
gvl_id: 855
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------------|----------|----------------------------------------------------------------------|----------|----------|
| `auId` | required | The ad unit ID `'0000000000072345'` leading zeros can be omitted. | `'0000000000072345'` | `string` |
| `network` | optional | Used if you want to make requests to multiple networks in adnuntius. | `'adnuntius'` | `string`|
| `targeting` | optional | Targeting to be sent through to adnuntius with the request. | `{ c: ['prebids'] }` | `string`|

#### Targeting

The [Adnuntius Documentation](https://docs.adnuntius.com/adnuntius-advertising/requesting-ads/intro) provides detailed information on sending targeting data to the Adnuntius adserver.

#### Example

Here's an example of sending targeting information about categories to adnuntius via the bid request:

```
{
    code: "0000000000072345",
    mediaTypes: {
        banner: {
            sizes: [[980, 360], [980, 300], [980, 240], [980, 120]]
        }
    },
    bids: [
        {
            bidder: "adnuntius",
            params: {
                auId: "8b6bc",
                network: "adnuntius",
                targeting: {
                    c: ['prebids']
                }
            }
        }
    ]
}
```

### Sending segments to the ad server

There's an option to send segment id in the bidder config that will be picked up and sent to the ad server. Below is an example on how to do this:

```
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

### Disable cookies for adnuntius

You have the option to tell adnuntius not to set cookies in your browser. This does not mean that third party ads being served through the ad server will not set cookies. Just that Adnuintius will not set it for internal ads.

```

pbjs.setBidderConfig({
    bidders: ['adnuntius'],
    config: {
        useCookie: false
    }
});
```

Use cookie will always be set to true by default. Changing it to false will disable cookies.

### Prebid Server Test Request

The following test parameters can be used to verify that Prebid Server is working properly with the server-side Adnuntius adapter. the `auId` below will not return a creative. Please substitute it with your own.

```
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
            "auId": "abc123"
        }
    }
}]
```

### First Party Data

publishers can use the `ortb2` configuration parameter to provide First Party Data. We accept all standard OpenRTB fields for both:

- `ortb2.site`
- `ortb2.user`

These fields are optional and only needed for user identification and contextual targeting. How to use it can be read here: [Prebid ortb2](https://docs.prebid.org/features/firstPartyData.html). Currently we only support this for our prebid server bidder, but will add it to the client bidder in the future.
