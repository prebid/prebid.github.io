---
layout: bidder
title: ucfunnel
description: Prebid ucfunnel Bidder Adaptor
pbjs: true
pbs: true
biddercode: ucfunnel
media_types: banner, video, native
gdpr_supported: true
usp_supported: true
userIds: unifiedId
coppa_supported: true
schain_supported: true
gvl_id: 607
pbs_app_supported: true
sidebarType: 1
---

### Prebid JS

#### Bid params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                                     | Example | Type     |
|--------|----------|-------------------------------------------------|---------|----------|
| `adid` | required | The ad unit ID retrived from ucfunnel dashboard |         | `string` |

```
var adUnits = [{
    code: 'div-gpt-ad-1460505748511-01',
    sizes: [
        [300, 250]
    ],
    bids: [{
        bidder: 'ucfunnel',
        params: {
            adid: '123456789'
        }
    }]
}]
```

{: .alert.alert-info :}
Sizes set in the `adUnit` object will also apply to the ucfunnel bid requests.

<a name="ucfunnel-examples" />
### Examples

  - [Banner Ads](https://cdn.aralego.net/ucfad/test/ucfunnel/compliance/pbjs_banner.html)
  - [Instream Video Ads](https://cdn.aralego.net/ucfad/test/ucfunnel/compliance/pbjs_video.html)
  - [Native Ads](https://cdn.aralego.net/ucfad/test/ucfunnel/compliance/pbjs_native.html)


### Prebid server

#### Bid params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                                     | Example | Type     |
|--------|----------|-------------------------------------------------|---------|----------|
| `adunitid` | required | ID for ad unit |         | `string` |
| `partnerid` | required | ID for partner |         | `string` |
