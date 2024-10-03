---
layout: bidder
title: Smile Wanted
description: SmileWanted Bidder Adapter
biddercode: smilewanted
tcfeu_supported: false
gvl_id: 639
usp_supported: true
coppa_supported: true
schain_supported: true
userIds: all
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
floors_supported: true
pbjs: true
pbs: true
prebid_member: false
multiformat_supported: will-bid-on-one
privacy_sandbox: no
sidebarType: 1
---

### Disclosure

Note: This bidder appears to only consider gdprApplies if a consent string is available.. This may result in some incorrect TCF2 processing, such as when the consent string is not yet available but the publisher has decided GDPR always applies. See <https://github.com/prebid/Prebid.js/issues/7775>

### Note

To use us as a bidder you must have an account and an active "zoneId" on our Smile Wanted platform.

### Bid params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example  | Type      |
|----------|----------|-----------------------|----------|-----------|
| `zoneId` | required | The placement zone ID | `'test.com_header_bidding_display_atf'` | `string` |

### Testing

You can add `#sw_test_campaign` to the end of any URL. This will have the effect of responding with a Smile Wanted creative with a high CPM, which means you'll win every auction so you can see if the ad displays correctly.
(Please note that impressions and revenues of this test ad will *not* be recorded and *not* be paid.)

### User Sync

Add the following code to enable user sync. Smile Wanted strongly recommends enabling user syncing through iFrames. This functionality improves partners' user match rates and increases the Smile Wanted bid rate and bid price. Be sure to call `pbjs.setConfig()` only once.

```javascript
pbjs.setConfig({
    userSync: {
        iframeEnabled: true,
        filterSettings: {
            iframe: {
                bidders: '*',   // '*' means all bidders
                filter: 'include'
            }
        }
    }
});
```
