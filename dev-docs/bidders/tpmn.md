---
layout: bidder
title: TPMN
description: Prebid TPMN Bidder Adaptor
biddercode: tpmn
media_types: banner
tcfeu_supported: false
prebid_member: false
schain_supported: false
coppa_supported: false
usp_supported: false
floors_supported: false
fpd_supported: false
pbjs: true
pbs: false
sidebarType: 1
---


### Registration

To use this bidder you will need an account and a valid unit from us.
For further information, please contact `info@tpmn.io`

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                          | Example          | Type      |
|---------------|----------|--------------------------------------|------------------|-----------|
| `inventoryId` | required | Inventory ID                         | `'1'`            | `integer` |
| `publisherId` | required | Publisher ID                         | `'TPMN'`         | `string`  |

### User Sync

Add the following code to enable user sync.
TPMN strongly recommends enabling user syncing through iFrames.
This functionality improves partners' user match rates and increases the TPMN bid rate and bid price.
Even if iFrame is not active, user sync of some partners is performed.
Be sure to call `pbjs.setConfig()` only once.

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
