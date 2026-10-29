---
layout: bidder
title: Mgid
description: Prebid Mgid Bidder Adapter.
pbjs: true
pbs: true
biddercode: mgid
media_types: banner,native
tcfeu_supported: true
usp_supported: true
safeframes_ok: true
gvl_id: 358
floors_supported: true
ortb_blocking_supported: partial
multiformat_supported: will-bid-on-any
sidebarType: 1
---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Bid params](#bid-params)
- [Additional Config](#additional-config)
- [Test Parameters](#test-parameters)
- [User Sync](#user-sync)

<a name="mgid-bid-desc"></a>

### Description

One of the easiest way to gain access to MGID demand sources  - MGID header bidding adapter.

MGID header bidding adapter connects with MGID demand sources to fetch bids for display placements. Please reach out to your account manager or <prebid@mgid.com> for more information.

We also recommend enabling a **Bid Viewability** module. It provides **viewability signals** to buyers, which can improve **bid quality** and increase **monetization opportunities**. If you serve ads through **Google Ad Manager (GAM)**, enable the [bidViewability](/dev-docs/modules/bidViewable.html) module; for **ad-server-independent** setups, enable the [bidViewabilityIO](/dev-docs/modules/bidViewableIO.html) module.

In addition, enable the **gptPreAuction** module. It automatically populates the **GPID (Global Placement ID)** for each ad slot, along with the matching GAM ad unit name. MGID uses the GPID to key inventory per placement, which improves demand matching. See the [gptPreAuction module documentation](/dev-docs/modules/gpt-pre-auction.html) for setup details.

<a name="mgid-bid-params"></a>

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `accountId`  | required | The account ID from Mgid           | `'123'`    | `string` |
| `bidFloor`   | optional | Lowest value of expected bid price | `1.1`      | `float`  |
| `currency`   | optional | Currency of request and response   | `'GBP'`    | `string` |

### Additional Config

The MGID adapter supports **enhanced bid data** — additional signals collected and sent with bid requests that help MGID buyers **bid more accurately**, which can improve **bid quality** and increase **monetization opportunities**. It is disabled by default and works even better together with a **Bid Viewability** module (see the recommendation above).

To opt in, set both `enhancedBidData` and the standard [`storageAllowed`](/dev-docs/publisher-api-reference/bidderSettings.html#storageAllowed) option to `true` in `pbjs.bidderSettings`. Some of the enhanced signals are derived from values kept in local storage, so the feature requires both options enabled together:

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                 | Example | Type      |
|-------------------|----------|-------------------------------------------------------------------------------------------------------------|---------|-----------|
| `enhancedBidData` | optional | Collect and send enhanced bid data with bid requests. Defaults to `false`.                                  | `true`  | `boolean` |
| `storageAllowed`  | optional | Allow the adapter to use local storage, where some enhanced bid data signals are kept. Defaults to `false`. | `true`  | `boolean` |

```javascript
pbjs.bidderSettings = {
  mgid: {
    enhancedBidData: true,
    storageAllowed: true
  }
};
```

<a name="mgid-test-params"></a>

### Test Parameters

300x600 banner test

```javascript
var adUnits = [{
  code: 'div-prebid',
  mediaTypes: {
    banner: {
      sizes: [[300, 600]]
    }
  },
  bids: [{
    bidder: 'mgid',
    params: {
      accountId: "#{accountId}" // replace with your accountId
    }
  }]
}];
```

300x250 banner test

```javascript
var adUnits = [{
  code: 'div-prebid',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'mgid',
    params: {
      accountId: "#{accountId}" // replace with your accountId
    }
  }]
}];
```

native test

```javascript
var adUnits = [{
  code: 'div-prebid',
  mediaTypes: {
    native: {
        image: {
            sendId: true,
            required: true,
            sizes: [80, 80]
        },
        clickUrl: {
            sendId: true,
            required: false
        },
        title: {
            required: true,
            len: 80
        },
        sponsoredBy: {
            required: false
        }
    }
  },
  bids: [{
    bidder: 'mgid',
    params: {
        accountId: "#{accountId}" // replace with your accountId
    }
  }]
}];
```

<a name="mgid-user-sync"></a>

### User Sync

Mgid recommends UserSync configuration to be enabled. Without it, Mgid adapter will not be able to perform user syncs, which lowers match rate and reduces monetization.

For Prebid.js v1.15.0 and later:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*',      // '*' represents all bidders
        filter: 'include'
      }
    }
  }
});
```

For Prebid.js v1.14.0 and before:

```javascript
pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    enabledBidders: ['mgid']
  }
});
```

Note: Combine the above configuration with any other UserSync configuration. Multiple setConfig() calls overwrite each other and only the last call for a given attribute will take effect.
