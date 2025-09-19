---
layout: bidder
title: SmartyTech
description: Prebid SmartyTech Bidder Adaptor
pbjs: true
biddercode: smartytech
media_types: banner, video
multiformat_supported: will-bid-on-one
tcfeu_supported: true
usp_supported: true
gpp_supported: true
coppa_supported: true
userIds: all
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }

| Name         | Scope    | Description  | Example | Type      |
|--------------|----------|--------------|---------|-----------|
| `endpointId` | required | Endpoint ID. | `14`    | `integer` |

### Sample Banner Ad Unit Example

```javascript
var adUnits = [{
    code: '/123123123/prebidjs-banner',
    mediaTypes: {
        banner: {
            sizes: [
                [300, 301],
                [300, 250]
            ]
        }
    },
    bids: [{
        bidder: 'smartytech',
        params: {
            endpointId: 14
        }
    }]
}];
```

### Sample Video Ad Unit Example

```javascript
var videoAdUnit = {
    code: '/123123123/video-vast-banner',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [640, 480],
            mimes: ['video/mp4'],
        }
    },
    bids: [{
        bidder: 'smartytech',
        params: {
            endpointId: 14
        }
    }]
};
```

### User ID Support

SmartyTech adapter supports all Prebid.js User ID modules. User IDs are automatically included in bid requests when available.

### Privacy and Consent Support

The SmartyTech adapter supports the following privacy frameworks:

- **GDPR (TCF EU)**: Full support for GDPR consent strings
- **CCPA/USP**: Support for California Consumer Privacy Act and US Privacy
- **GPP**: Support for Global Privacy Platform
- **COPPA**: Support for Children's Online Privacy Protection Act

### Additional Configuration

It is possible to configure requests to be split into chunks so as to have fewer bid requests in a single http request (default value is 10).

```javascript
pbjs.setBidderConfig({
    config: {              
        smartytech: {
            chunkSize: 5   // makes 1 http request per 5 ad units configured
        }
    }
});
```
