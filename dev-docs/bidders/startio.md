---
layout: bidder
title: Start.io
biddercode: startio
description: Prebid Start.io Adapter
tcfeu_supported: true
coppa_supported: false
gpp_supported: false
floors_supported: false
media_types: banner, video, native
multiformat_supported: will-bid-on-any
safeframes_ok: false
schain_supported: false
gvl_id: 1216
usp_supported: false
pbjs: true
pbs: true
prebid_member: false
fpd_supported: false
privacy_sandbox: no
ortb_blocking_supported: false
sidebarType: 1
---

### Before You Begin

The Start.io bidder adapter requires additional setup and approval from the Start.io team. For additional information, please reach out to <prebid@start.io>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                       | Example                | Type         |
|---------------|----------|-----------------------------------|------------------------|--------------|
| `publisherId` | required | Publisher ID                      | `'publisher-1234'`     | `string`     |

#### Configuration

Sample banner setup:

```js
var adUnits = [
  {
    code: "div-gpt-ad-12345-0",
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      }
    },
    bids: [
      {
        bidder: "startio",
        params: {
          publisherId: "publisher-12345"
        }
      }
    ]
  }
]

pbjs.que.push(function() {
  pbjs.addAdUnits(adUnits);
});
```

### Additional Notes

#### Request and Response Attributes

- Bids are returned in **net** - that is, the bids returned reflect the bid amount with revenue sharing already taken into account. No adjustment is necessary.
