---
layout: bidder
title: Viant
description: Prebid Viant Bidder Adapter
biddercode: viant
media_types: banner, video, native
gdpr_supported: true
coppa_supported: true
usp_supported: false
gpp_supported: false
schain_supported: false
userIds: uid2, unifiedId
pbjs: true
prebid_member: false
sidebarType: 1
---

### Registration

If you have any questions regarding set up, please reach out to <dist-runtime@viantinc.com>.

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `publisherId`       | required | PublisherId to identify the Site from which Bid Requests will be seen.                                                                                                        | `12345`                                               | `integer`         |
