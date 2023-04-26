---
layout: bidder
title: TrustX (standalone)
description: Prebid TrustX Bidder Adaptor
pbjs: true
biddercode: trustx
media_types: banner, video
multiformat_supported: will-bid-on-any
gdpr_supported: true
usp_supported: true
fpd_supported: true
pbjs_version_notes: 6.x and before
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Bid Params](#bid-params)
- [First Party Data](#first-party-data)

<a name="trustx-bid-params" />

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope                | Description                                                                                                                                                                                                         | Example                                   | Type      |
|----------------|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|-----------|
| `uid`          | required             | Represents the TrustX bidder system Ad Slot ID associated with the respective div id from the site page.                                                                                                            | `42`                                      | `integer` |
| `priceType`    | optional (pbjs only) | Can take the values `gross` or `net`, default value is `net`. Net represents the header bid price with the TrustX header bidder margin already extracted. Gross price does contain the TrustX bidder margin within. | `'gross'`                                 | `string`  |
| `keywords`     | optional (pbjs only) | A set of key-value pairs applied to all ad slots on the page. Values can be empty.                                                                                                                                  | `keywords: { topic: ['stress', 'fear'] }` | `object`  |
| `useNewFormat` | optional (pbjs only) | Indicates to use the new ad request format.                                                                                                                                                                         | `true`                                    | `boolean` |

<a name="trustx-first-party" />

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

Global site or user data using `setConfig()`, or Bidder-specific using `setBidderConfig()` supports following fields:

- `ortb2.user.data[]`: Standard IAB segment taxonomy user data
- `ortb2.user.keywords`: Standard IAB OpenRTB 2.5 user.keywords field. It will be included in ext.keywords.user.ortb2
- `ortb2.site.keywords`: Standard IAB OpenRTB 2.5 site.keywords field. It will be included in ext.keywords.site.ortb2

AdUnit-specific data using `AdUnit.ortb2Imp` supports following fields:

- `ortb2.imp[].ext.data.*`
- `ortb2.imp[].instl`
