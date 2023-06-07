---
layout: bidder
title: Kargo
description: Prebid Kargo Bidder Adaptor
gvl_id: 972
pbjs: true
biddercode: kargo
media_types: banner, video, native
gdpr_supported: true
userIds: unifiedId
usp_supported: true
coppa_supported: false
schain_supported: true
dchain_supported: true
safeframes_ok: false
deals_supported: true
floors_supported: true
fpd_supported: false
pbs: true
pbs_app_supported: false
prebid_member: true
gpp_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Disclosure:
This adapter is known to use an HTTP 1 endpoint. Header bidding often generates multiple requests to the same host and bidders are encouraged to change to HTTP 2 or above to help improve publisher page performance via multiplexing.

### Note:
Kargo is an invitation-only marketplace.  Please reach out to your Kargo account manager to get setup.  Also, you *must* test on a mobile device, or emulate a mobile device by manipulating the user agent string sent to the server.

### Bidder Settings
The Kargo bid adapter uses browser local storage. Since Prebid.js 7.x, the access to it must be explicitly set.

```js
// https://docs.prebid.org/dev-docs/publisher-api-reference/bidderSettings.html
pbjs.bidderSettings = {
  kargo: {
    storageAllowed: true
  }
}
```

### Bid Params:

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `placementId`       | required | The placementId of the ad slot. |`'_jWuc8Hks'`| `string` |

