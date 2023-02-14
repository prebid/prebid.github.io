---
layout: bidder
title: Limelight Digital
description: Prebid Limelight Digital Bidder Adaptor
biddercode: limelightDigital
pbjs: true
pbs: false
media_types: video, banner
userIds: all
fpd_supported: false
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: false
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }

| Name           | Scope      | Description                                                    | Example            |type|
| :-----------   | :--------- | :------------                                                  | :----------------- |:---|
| `host` | required | Ad network's RTB host | `'exchange.ortb.net'` | `string` |
| `adUnitId` | required   | Ad Unit Id will be generated on Limelight Digital Platform. | 0                        | `integer` |
| `adUnitType`      | required   | Type of Ad Unit (`'video'`, `'banner'`)                                             | `'banner'`                 | `string` |
| `publisherId` | optional | Publisher ID | `'12345'` | `string` |
| `custom1` | optional | Custom targeting field 1 | `'custom1'` | `string` |
| `custom2` | optional | Custom targeting field 2 | `'custom2'` | `string` |
| `custom3` | optional | Custom targeting field 3 | `'custom3'` | `string` |
| `custom4` | optional | Custom targeting field 4 | `'custom4'` | `string` |
| `custom5` | optional | Custom targeting field 5 | `'custom5'` | `string` |
