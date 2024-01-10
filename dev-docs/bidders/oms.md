---
layout: bidder
title: Online Media Solutions
description: Prebid Online Media Solutions(OMS) Bidder Adapter
tcfeu_supported: false
pbjs: true
pbs: true
biddercode: oms
prebid_member: false
floors_supported: true
safeframes_ok: true
media_types: banner
schain_supported: true
userIds: id5Id, identityLink, pubProvidedId
pbs_app_supported: true
sidebarType: 1
gvl_id: 883
---
### Note

The bidder requires setup before usage. Please get in touch with our team at <prebid@onlinemediasolutions.com> to get started.



### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `publisherId`       | required | Unique publisher ID  | `12345` | `integer` |
| `bidFloor`    | optional | The minimum bid value desired      | `1.23`  | `float` |


### Prebid Server Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
|---------------|----------|---------------------|---------------|----------|
| `pid` | required | Unique publisher ID | `'12345'` | `string` |
