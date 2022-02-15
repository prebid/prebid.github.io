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

This module connects publishers to Glimpse Protocol's demand sources via Prebid.js. Our innovative marketplace protects consumer privacy while allowing precise targeting.

## Supported Media Types

| Type     | Sizes                                     |
| -------- | ----------------------------------------- |
| `Banner` | 300x250, 300x600, 320x50, 728x90, 970x250 |

## Setup

This section shows how to configure your Prebid.js integration to work with the Glimpse module.

### Prerequisites

Before you start to configure Glimpse, you will need to build a `prebid.js` file with the Glimpse module included, and include both `gpt.js` and `prebid.js` in the `head` of each page with supply. An example of a typical pair of script tags might be:

```html
<script
  async
  src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
></script>

<script async src="https://<PUBLISHER_DOMAIN>/prebid.js"></script>
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

| Name          | Scope    | Type                | Description                                                                                                                   | Example                |
| ------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `placementId` | Required | string              | A unique identifier associated with a publisher and ad unit, provided by the Glimpse Publisher Portal when registering a unit | 'glimpse-placement-id' |
| `demand`      | Optional | string              | Target demand source (defaults to 'glimpse')                                                                                  | 'xandr'                |
| `keywords`    | Optional | Record<string, any> | Audience targeting data (applies to the single ad unit)                                                                       | { sticky: true }       |

#### Example

```javascript
const units = [
  {
    code: "ad-unit-0",
    mediaTypes: {
      banner: { sizes: [[300, 250]] },
    },
    bids: [
      {
        bidder: "glimpse",
        params: {
          placementId: "glimpse-placement-id",
          demand: "glimpse",
          keywords: {
            sticky: true,
          },
        },
      },
    ],
  },
]
```

### First Party Data

Our adapter captures site and user level data that can be passed to all units using the `ortb2` block, as described [here](https://docs.prebid.org/features/firstPartyData.html).

#### Example

```javascript
pbjs.que.push(() => {
  pbjs.setConfig({
    ortb2: {
      site: {
        keywords: "sports, basketball",
        ext: {
          data: {
            title: "The Premier League",
          },
        },
      },
      user: {
        keywords: "food, takeaway",
        ext: {
          data: {
            firstVisit: true,
          },
        },
      },
    }
  })

  ...
})
```

## FAQs

### Can I test my setup without a Publisher Portal Account?

Yes, to test your setup, you can trigger Glimpse to respond with randomly-generated bids for your correctly-configured units by setting `demand: 'demo'` in the `params` of each unit.

### Can you provide additional support?

Of course! You can check the Glimpse Prebid Adapter documentation, [here](https://docs.glimpseportal.io/en/latest/), or reach out to us at [publisher@glimpseprotocol.io](mailto:publisher@glimpseprotocol.io).
