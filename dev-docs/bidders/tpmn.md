---
layout: bidder
title: TPMN
description: Prebid TPMN Bidder Adapter
biddercode: tpmn
gpp_supported: true
safeframes_ok: true
media_types: banner, video, native
tcfeu_supported: false
prebid_member: false
schain_supported: true
coppa_supported: true
usp_supported: true
floors_supported: false
fpd_supported: false
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false 
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
sidebarType: 1
---

### Note

TPMN Support media types

{: .table .table-bordered .table-striped }
| Name                  | banner | video | native | audio  |
|-----------------------|--------|-------|--------|--------|
| Prebid.js             | O      | X     | X      | X      |
| Prebid Server Adapter | O      | O     | O      | X      |

### Registration

To use this bidder you will need an account and a valid unit from us.
For further information, please contact `info@tpmn.io`

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                          | Example          | Type      |
|---------------|----------|--------------------------------------|------------------|-----------|
| `inventoryId` | required | Inventory ID                         | `1`              | `integer` |
| `publisherId` | required | Publisher ID                         | `'TPMN'`         | `string`  |

### User Sync

Add the following code to enable user sync.
TPMN strongly recommends enabling user syncing through iFrames.
This functionality improves partners' user match rates and increases the TPMN bid rate and bid price.
Even if iFrame is not active, user sync of some partners is performed.
Be sure to call `pbjs.setConfig()` only once.

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

### Prebid Server Adapter Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description    | Example          | Type      |
|---------------|----------|----------------|------------------|-----------|
| `inventoryId` | required | Inventory ID   | `1`              | `integer` |

### Prebid Server Adapter Test Request

The following test parameters can be used to verify that Prebid Server is working properly with the
TPMN adapter.

```json
{
    "id": "request_id",
    "imp": [
        {
            "id": "imp_id",
            "banner": {
                "w": 300,
                "h": 250
            },
            "ext": {
                "tpmn": {
                    "inventoryid": 1
                }
            }
        }
    ],
    "device": {
        "os": "some-Os",
        "ua": "some-agent"
    },
    "tmax": 500,
    "test": 1     
}
```
