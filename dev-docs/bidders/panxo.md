---
layout: bidder
title: Panxo
description: Prebid Panxo Bidder Adapter
biddercode: panxo
tcfeu_supported: true
gvl_id: 1527
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: true
floors_supported: true
fpd_supported: true
media_types: banner
safeframes_ok: true
bidder_supports_deals: true
pbjs: true
pbs: false
prebid_member: true
multiformat_supported: will-not-bid
ortb_blocking_supported: false
sidebarType: 1
---

### Before You Begin

The Panxo adapter requires the [Panxo RTD Module](/dev-docs/modules/panxoRtdProvider.html) to be included in your Prebid.js build. The RTD module detects AI-referred traffic and enriches bid requests with classification signals that the adapter needs to participate in the auction.

Please register at [app.panxo.com](https://app.panxo.com) to obtain your `siteId` (for the RTD module) and `propertyKey` (for the bid adapter).

**Important**: Without the Panxo RTD module configured, the adapter will not participate in the auction.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|--------------------------------------------------|----------------------|----------|
| `propertyKey` | required | Property identifier from Panxo dashboard | `'abc123def456'` | `string` |
| `floor` | optional | Minimum CPM floor price in USD | `0.50` | `number` |

### Setup Example

#### Step 1: Build Prebid.js with required modules

Include both `panxoRtdProvider` and `panxoBidAdapter` in your Prebid.js build:

```bash
gulp build --modules=rtdModule,panxoRtdProvider,panxoBidAdapter,...
```

Or select both **Panxo RTD Module** and **Panxo** on the Prebid [Download](/download.html) page.

#### Step 2: Configure RTD module and ad units

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 300,
        dataProviders: [{
            name: 'panxo',
            waitForIt: true,
            params: {
                siteId: 'your-site-id'
            }
        }]
    }
});

var adUnits = [{
    code: 'banner-ad',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [728, 90]]
        }
    },
    bids: [{
        bidder: 'panxo',
        params: {
            propertyKey: 'your-property-key'
        }
    }]
}];
```

### First Party Data

This adapter supports First Party Data via `ortb2`:

- `ortb2.site.*` (name, cat, content, keywords, etc.)
- `ortb2.user.*` (data, ext)

### User Sync

Panxo supports pixel-based user sync:

```javascript
pbjs.setConfig({
    userSync: {
        filterSettings: {
            pixel: {
                bidders: ['panxo'],
                filter: 'include'
            }
        }
    }
});
```

### Additional Notes

- **Net Revenue**: Bids are returned as net revenue.
- **TTL**: 300 seconds (5 minutes)
- **Currency**: USD
- **Safeframes**: Supported
- **Advertiser Domains**: Available in bid responses at `meta.advertiserDomains`
