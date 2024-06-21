---
layout: bidder
title: Glimpse Protocol
description: Glimpse Protocol Bid Adapter
biddercode: glimpse
pbjs: true
tcfeu_supported: true
usp_supported: true
deals_supported: true
media_types: banner
gvl_id: 1012
sidebarType: 1
---

{: .alert.alert-warning :}
glimpse is probably a defunct bidder, as the glimpseportal.io domain is no longer active.

## Overview

```text
Module Name: Glimpse Protocol Bid Adapter
Module Type: Bidder Adapter
Maintainer: support@glimpseportal.io
```

## Description

Glimpse protects consumer privacy while allowing precise targeting. This module connects publishers
to Glimpse Protocol's demand sources via Prebid.js.

## Supported Media Types

{: .table .table-bordered .table-striped }
| Type | Sizes |
| -------- | ----------------------------------------- |
| `Banner` | 300x250, 300x600, 320x50, 728x90, 970x250 |

## Setup

### Prerequisites

Before you start, you will need to build a `prebid.js` file with the Glimpse module included, and include both `gpt.js` and `prebid.js` in the `head` of each page with supply. An example of a typical pair of script tags might be:

```html
<script
  async
  src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
></script>

<script async src="https://<PUBLISHER_DOMAIN>/prebid.js"></script>
```

## Configuration

### Bid Requests

Our adapter expects the following values in the `params` block of each bid request:

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example |
| ----- | -------- | ------ | --------------------------------------------------------------------------------------------------- | ---------------------- |
| `pid` | Required | string | A unique identifier representing an ad unit. It is provided by Glimpse when registering an ad unit. | 'glimpse-placement-id' |

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
          pid: "glimpse-placement-id",
        },
      },
    ],
  },
]
```

### First Party Data

Our adapter works with first party data providers as described [here](https://docs.prebid.org/features/firstPartyData.html). In this example we add Permutive data to our bidder request using [setBidderConfig](https://docs.prebid.org/features/firstPartyData.html#supplying-bidder-specific-data).

#### Example

```javascript
pbjs.que.push(() => {
  pbjs.setBidderConfig({
    bidders: ["glimpse"],
    config: {
      ortb2: {
        site: {
          keywords: "business,finance,crypto",
          ext: {
            data: {
              permutive: {
                pvc: JSON.parse(localStorage.getItem("permutive-pvc")) ?? {},
              },
            },
          },
        },
        user: {
          ext: {
            data: {
              permutive: {
                keywords: JSON.parse(localStorage.getItem("_psegs")) ?? [],
                enrichers:
                  JSON.parse(
                    localStorage.getItem("permutive-data-enrichers")
                  ) ?? {},
              },
            },
          },
        },
      },
    },
  })
})
```

## FAQs

### Can you provide additional support?

Of course! You can check the Glimpse Prebid Adapter documentation or reach out to us at <support@glimpseportal.io>.
