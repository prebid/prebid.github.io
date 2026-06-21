---
layout: bidder
title: ConnectAd
description: ConnectAd Prebid Adapter
biddercode: connectad
media_types: banner, video, native, audio
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
prebid_member: true
safeframes_ok: true
floors_supported: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
ortb_blocking_supported: true
gvl_id: 138
multiformat_supported: will-bid-on-any, will-bid-on-one, will-not-bid
sidebarType: 1
endpoint_compression: true
---

## Prebid Server Note

Please reach out to your ConnectAd Account Manager before configuring the S2S adapter for approval and setup.

The ConnectAd server-side adapters (Java and Go) have been modernized to fully support **Video** and **Native** ad formats, OpenRTB 2.6 dynamic bid type resolution, and complete request payload (`imp.ext`) preservation.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                                   | Example                       | Type      |
|---------------|----------|---------------------------------------------------------------------------------------------------------------|-------------------------------|-----------|
| `siteId`      | required | The site ID from ConnectAd.                                                                                   | 12345                         | integer   |
| `networkId`   | required | The network ID from ConnectAd.                                                                                | 10047                         | integer   |
| `bidfloor`    | optional | Requested Floorprice (fallback if the Price Floors module does not set one).                                  | 0.15                          | number    |
| `endpointUrl` | optional | Prebid.js only: override the bid endpoint URL for testing or a custom datacenter. Ignored by Prebid Server.   | `https://i.connectad.io/api/v3` | string    |

## Additional Features

- **Video & Native Support**: ConnectAd now supports standard Prebid Video and Native formats via the `ortbConverter`.
- **Viewability Measurement**: The Prebid.js adapter natively integrates standardized viewability measurement (`percentInView`).
- **OpenRTB 2.6**: Full support for OpenRTB 2.6 standards, including dynamic bid type resolution.

## User Sync

ConnectAd recommends enabling user syncing via iFrame. This significantly improves user match rates and overall monetization performance. Be sure to call `pbjs.setConfig()` only once.

```javascript
pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    filterSettings: {
      iframe: {
        bidders: ['connectad'],
        filter: 'include'
      }
    }
  }
});
```

**Note:** *Combine the above configuration with any other UserSync configuration. Multiple `setConfig()` calls overwrite each other and only the last call for a given attribute will take effect.*

## First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](/features/firstPartyData.html). The following fields are supported:

- `ortb2.site.*`
- `ortb2.user.*`

AdUnit-specific data is supported using `adUnit.ortb2Imp.ext.*`:

```javascript
pbjs.setConfig({
  ortb2: {
    site: {
      keywords: 'sports, news',
      content: {
        language: 'en'
      }
    },
    user: {
      keywords: 'automotive'
    }
  }
});
```

## Endpoint Compression

The ConnectAd adapter supports gzip compression for outgoing requests, which is built into Prebid.js core. For more information, see [Compression Support for Outgoing Requests](https://docs.prebid.org/dev-docs/bidder-adaptor.html#compression-support-for-outgoing-requests).

### Disabling Compression

You can disable gzip compression at the bidder level using `pbjs.setBidderConfig`. Set the `gzipEnabled` value to `false`:

```javascript
pbjs.que.push(function () {
  pbjs.setBidderConfig({
    bidders: ['connectad'],
    config: {
      gzipEnabled: false
    }
  });
});
```

<!-- workaround bug where code blocks at end of a file are incorrectly formatted-->
