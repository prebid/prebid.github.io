---
layout: bidder
title: Smile Wanted
description: SmileWanted Bidder Adapter
media_types: banner, video
pbjs: true
pbs: true
biddercode: smilewanted
gdpr_supported: true
usp_supported: true
gvl_id: 639
sidebarType: 1
---

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

```
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
