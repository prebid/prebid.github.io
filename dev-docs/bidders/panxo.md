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

The Panxo adapter requires the Panxo Signal script to be installed on your page before Prebid.js loads. Please register at [app.panxo.ai](https://app.panxo.ai) to obtain your property key and Signal script endpoint.

**Important**: Without the Signal script setting the `panxo_uid` in localStorage, the adapter will not participate in the auction.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|--------------------------------------------------|----------------------|----------|
| `propertyKey` | required | Property identifier from Panxo dashboard | `'abc123def456'` | `string` |
| `floor` | optional | Minimum CPM floor price in USD | `0.50` | `number` |

### Setup Example

```html
<!-- Step 1: Panxo Signal Script (MUST load before Prebid) -->
<script async src="https://cdn.panxo-sys.com/o/YOUR_ENDPOINT_KEY"></script>

<!-- Step 2: Prebid.js -->
<script async src="prebid.js"></script>
```

```javascript
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
