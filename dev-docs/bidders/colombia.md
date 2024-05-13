---
layout: bidder
title: Colombia
description: Prebid Colombia Bidder Adaptor
biddercode: colombia
media_types: banner, video, native
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: true
dchain_supported: true
floors_supported: true
userIds: all
prebid_member: true
pbjs: true
pbs: false
pbs_app_supported: false
fpd_supported: true
multiformat_supported: will-bid-on-one
---

### Note

The DisplayioAds bidding adapter requires setup and approval before implementation. Please reach out to <elena@display.io> for more details.

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
| `yob` | optional | Year of Birth. | `'1982'`        | `string` |
| `gender` | optional | Gender M/F | `'M|F'`        | `string` |
| `floor` | optional | Bid Floor. | `'1.75'`        | `string` |
| `currency` | optional | Bid currency. | `'AUD|USD'`        | `string` |
| `acat` | optional | Allowed categories. | `'[ 'IAB1-5', 'IAB1-6', 'IAB1-7' ]'`        | `string` |
| `bcat` | optional | Blocked IAB Categories. | `[ 'IAB1-5', 'IAB1-6', 'IAB1-7' ]`        | `string` |

