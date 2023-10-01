---
layout: bidder
title: Holid
description: Prebid Holid Bidder Adapter
biddercode: holid
pbjs: true
media_types: banner
gvl_id: 1177
tcfeu_supported: true
usp_supported: true
prebid_member: false
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                  | Example   | Type     |
| ---------- | -------- | ---------------------------- | --------- | -------- |
| `adUnitID` | required | Ad Unit ID provided by Holid | `'12345'` | `string` |

### Configuration

To increase the match rate and monetization, Holid recommends turning on iframe-based user sync.

```javascript
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: '*',   // '*' means all bidders
                filter: 'include'
            }
        }
    }
});
```
