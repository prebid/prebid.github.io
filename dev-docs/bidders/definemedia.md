---
layout: bidder
title: DEFINE MEDIA
description: Prebid DEFINE MEDIA Bidder Adapter
biddercode: definemedia
tcfeu_supported: true
gvl_id: 440
media_types: banner
safeframes_ok: true
deals_supported: false
pbjs: true
pbs: true
pbs_app_supported: false
prebid_member: false
sidebarType: 1
---

### Registration

Please reach out to our account management team to get started. Contact information is available under [definemedia.de](https://definemedia.de).

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Type    | Description                                                                                                                                                  | Example
| ---- | ----- |---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------| -------
| `supplierDomainName` | required | String  | The domain name of the last supplier in the chain. Under this domain a sellers.json must be available under https://${supplierDomainName}/sellers.json       | definemedia.de
| `devMode` | optional | boolean | This parameter enables our development endpoint instead of the production endpoint. All requests done with this parameterer set to "true" are *NOT* billable | true
