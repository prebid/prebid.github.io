---
layout: bidder
title: Glimpse Protocol
description: Glimpse Protocol Bid Adapter
biddercode: glimpse
pbjs: true
gdpr_supported: true
deals_supported: true
media_types: banner
gvl_id: 1012
---

## Overview

```
Module Name: Glimpse Protocol Bid Adapter
Module Type: Bidder Adapter
Maintainer: publisher@glimpseprotocol.io
```

## Description

This module connects publishers to Glimpse Protocol's demand sources via Prebid.js. Our
innovative marketplace protects consumer privacy while allowing precise targeting.

## Supported Media Types

| Type     | Sizes                                                              |
| -------- | ------------------------------------------------------------------ |
| `Banner` | 300x250, 300x600, 320x50, 728x90, 970x250                          |

## Setup

This section shows how to configure your Prebid.js integration to work with the Glimpse module.

### Prerequisites

Before you start to configure Glimpse, you will need to build a `prebid.js` file with the Glimpse module included,
and include both `gpt.js` and `prebid.js` in the `head` of each page with supply. An example of a typical pair of script tags might be:

```html
<script
  async
  src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
></script>

<script
  async
  src="https://<PUBLISHER_DOMAIN>/prebid.js"
></script>
```

### Publisher Registration

Coming soon.

### Domain Registration

Coming soon.

### Ad Unit Registration

Coming soon.

## Configuration

### Bid Requests

Our adapter captures the following values in the `params` block of each bid request:

| Name          | Scope    | Type   | Description                                                                                                      | Example                |
| ------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `placementId` | Required | string | A unique identifier associated with a publisher and ad unit, provided by the Glimpse Publisher Portal when registering a unit | 'glimpse-placement-id' |
| `keywords` | Optional | Record<string, any> | Audience targeting data (applies to the single ad unit) | { sticky: true } |

#### Example

```javascript
const units = [{
    code: "ad-unit-0",
    mediaTypes: {
        banner: { sizes: [[300, 250]] },
    },
    bids: [{
        bidder: "glimpse",
        params: {
            placementId: "glimpse-placement-id",
            keywords: {
              sticky: true,
            },
        },
    }],
}]
```

### Bidder Config

Our adapter captures the following values in the `glimpse` block of the `BidderConfig` object:

| Name          | Scope    | Type   | Description                                                                                                      | Example                |
| ------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `demo` | Optional | boolean | Triggers Glimpse to respond with dummy bids (defaults to false) | true |
| `account` | Optional | number | Your Glimpse account id | 1234 |
| `demand` | Optional | string | The target demand source (defaults to 'glimpse') | 'xandr' |
| `keywords` | Optional | Record<string, any> | Audience targeting data (applies to all ad units) | { sticky: true } |

#### Example

```javascript
pbjs.que.push(() => {
  pbjs.setBidderConfig({
    bidders: ["glimpse"],
    config: {
      glimpse: {
        demo: true,
        account: 1234,
        demand: "glimpse",
        keywords: {
          "language": "en",
        },
      },
    },
  })

  ...
})
```

## FAQs

### Can I test my setup without a Publisher Portal Account?

Yes, you can test your setup by setting `demo: true` in the `glimpse` block of the `BidderConfig` object. This will trigger Glimpse to respond with randomly-generated bids for all bid requests you make to Glimpse.

### Can you provide additional support?

Of course! You can check the Glimpse Prebid Adapter documentation, [here](https://docs.glimpseportal.io/en/latest/), or reach out to us at [publisher@glimpseprotocol.io](mailto:publisher@glimpseprotocol.io).
