---
layout: bidder
title: StroeerCore
description: Stroeer Bidder Adapter
biddercode: stroeerCore
media_types: banner, video
gdpr_supported: true
schain_supported: true
coppa_supported: false
usp_supported: false
safeframes_ok: true
prebid_member: false
pbjs: true
pbs: true
gvl_id: 136
pbs_app_supported: true
deals_supported: true
userIds: criteo, id5Id, netId, pubCommonId, sharedId
multiformat_supported: will-bid-on-one
floors_supported: false
fpd_supported: false
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description        | Example                                 | Type     |
|---------------|----------|--------------------|-----------------------------------------|----------|
| `sid`         | required | Slot ID            | `'06b782cc-091b-4f53-9cd2-0291679aa1ac'`| `string` |


### Ad Unit Configuration Notes

#### Banner

* The server will ignore sizes that are not supported by the slot or by the platform (such as 987x123).   

#### Video

* Both instream and outstream contexts are supported.
* We do not provide an outstream renderer. You will need to set up your own. See [Show Outstream Video Ads](/dev-docs/show-outstream-video-ads.html) for more information.
* On `mediaTypes.video`, the fields `context` and `mediaTypes` are required.

### Ad Unit Configuration Example

```javascript
const adUnits = [{ 
    code: 'div-gpt-ad-1460505748561-0',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]],
        }
    },
    bids: [{
        bidder: 'stroeerCore',
        params: {
          sid: "06b782cc-091b-4f53-9cd2-0291679aa1ac"
        }    
    }]
}];
```
