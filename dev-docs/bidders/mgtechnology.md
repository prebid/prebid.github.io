---
layout: bidder
title: MediaGo Technology LLC
description: MediaGo Technology LLC Prebid Bidder Adapter
biddercode: mgtechnology
aliasCode: mediago
media_types: banner,native
prebid_member: true
userIds: all (with commercial activation)
tcfeu_supported: true
coppa_supported: true
usp_supported: true
pbjs: true
pbs: false
floors_supported: true
gvl_id: 1575
pbjs_version_notes: Registered as an alias of mediagoBidAdapter
sidebarType: 1
---

## Modules

SharedID: We need you to include SharedID module,which is used to get prebid user commonid.It can better differentiating users to bid on ads.

## Note

The MediaGo Technology LLC Bidding adapter is an alias of the [MediaGo adapter](/dev-docs/bidders/mediago.html), connecting to MediaGo Technology LLC's demand sources via a separate endpoint and GVL ID.

To use this adapter in Prebid.js, include `mediagoBidAdapter` in your build. The `mgtechnology` bidder code is automatically registered.

Please contact us at <ext_mediago_cm@baidu.com> for setup.

## Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `token` | required | publisher token, This parameter expects all imps to be the same | `'1e100887dd614b7f69fdd1360437'` | `string` |
| `region` | recommend | Server region for PBS request: US for US Region, EU for EU Region, APAC for APAC Region, default is US. This parameter expects all imps to be the same. This parameter is available for PBS only. | `'US'` | `string` |
| `test` | recommend | 0(default): production env mode. <br> 1: dev env mode and no charge.we will bid Higher frequency to make debug easier. This parameter is available for PBJS only. | `1/0` | `Number` |
| `bidfloor` | recommend | Sets a floor price for the bid. This parameter is available for PBJS only. | `0.05` | `float` |
| `publisher` | recommend | publisher id | `'abcdefg'` | `string` |
| `placementId` | recommend | The AD placement ID | `12341234` | `string` |
| `tagid` | optional | Tag identifier for the impression | `"1"` | `string` |
