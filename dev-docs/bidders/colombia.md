---
layout: bidder
title: Colombia
description: Prebid Colombia Bidder Adaptor
biddercode: colombia
media_types: banner, video, native
prebid_member: true
pbjs: true
pbs: false
pbs_app_supported: false
fpd_supported: true
multiformat_supported: will-bid-on-one
---

### Note

The Colombia bidding adapter requires setup and approval before implementation. Please reach out to <adserver@colombiaonline.com> for more details.

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `adSlot` | Required | adSlot will be generated on colombia SSP Platform. | `'3849382'`        | `string` |
| `keywords` | optional | Comma separated string. | `'India, India news, India news today'`        | `string` |
| `category` | optional | Page Categorization. | `'Election, Sports, Entertainments'`        | `string` |
| `pagetype` | optional | Type of page. | `'Listing, Show, Liveblog, Photostory'`        | `string` |
| `incognito` | optional | 1, for incognito mode. | `'1'`        | `string` |
| `dsmi` | optional | CCPA Compliance Flag. | `'0|1'`        | `string` |
| `optout` | optional | GDPR Compliance Flag. | `'0|1'`        | `string` |

