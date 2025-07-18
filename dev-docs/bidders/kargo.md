---
layout: bidder
title: Kargo
description: Prebid Kargo Bidder Adaptor
gvl_id: 972
pbjs: true
biddercode: kargo
media_types: banner, video, native
tcfeu_supported: true
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
pbjs_version_notes: if you require schains, avoid versions 7.46 to 7.53
sidebarType: 1
---

### Note

Kargo is an invitation-only marketplace.  Please reach out to your Kargo account manager to get setup.  Also, you *must* test on a mobile device, or emulate a mobile device by manipulating the user agent string sent to the server.

### Bidder Settings

The Kargo bid adapter uses browser local storage. Since Prebid.js 7.x, the access to it must be explicitly set.

{% include dev-docs/storageAllowed.md %}

```js
// https://docs.prebid.org/dev-docs/publisher-api-reference/bidderSettings.html
pbjs.bidderSettings = {
  kargo: {
    storageAllowed: true
  }
}
```

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `placementId`       | required | The placementId of the ad slot. |`'_jWuc8Hks'`| `string` |

### ORTB Blocking

Kargo supports blocking advertisers in `badv` and categories in `bcat` parameters.
The blocked advertisers/categories list has no length limitation, but response timeout is more likely to occur as the number of entries grow.
Blocked advertisers list (`badv`) is an array of domains as strings.
Blocked categories list (`bcat`) is an array of IAB categories as strings.

For example:

#### Globally defined ORTB Blocking

```javascript
pbjs.setConfig({
  ortb2: {
    badv: ["domain1.com", "domain2.com"],
    bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
  }
)};
```

#### ORTB Blocking specific only to the Kargo bidder

```javascript
pbjs.setBidderConfig({
  bidders: ['kargo'],
  config:{
    ortb2: {
      badv: ["domain1.com", "domain2.com"],
      bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
    }
  }
});
```
