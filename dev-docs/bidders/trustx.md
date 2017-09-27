---
layout: bidder
title: TrustX
description: Prebid Trustx Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: trustx

biddercode_longer_than_12: false

---


### bid params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description                                                                                              | Example |
| :--- | :----    | :----------                                                                                              | :------ |
| `uid`| required | Represents the TrustX bidder system Ad Slot ID associated with the respective div id from the site page. | `42`    |

### global params

These parameters must be specified as a properties of the 'window' object.

{: .table .table-bordered .table-striped }
| Name | Scope    | Description                                                                                                                                                                                                                   | Example |
| :--- | :----    | :----------                                                                                                                                                                                                                   | :------ |
| `globalprebidTrustxPriceType`| optional | Can take on values `gross` or `net`, default value is `net`. Net represents the bid price with the TrustX bidder margin already extracted. Gross price does contain the TrustX bidder marging within. | `gross` |
