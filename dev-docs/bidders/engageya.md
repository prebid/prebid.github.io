---
layout: bidder
title: Engageya
description: Prebid Engageya Bidder Adapter
media_type: banner, native
biddercode: engageya
pbjs: true
gdpr_supported: false
sidebarType: 1
---

Note: This bidder appears to only consider gdprApplies if a consent string is available.. This may result in some incorrect GDPR processing, such as when the consent string is not yet available but the publisher has decided GDPR always applies. See https://github.com/prebid/Prebid.js/issues/7775

### Bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                            | Example                     | Type |
| :---          | :----    | :----------------------------------------------------  | :-------------------------  | --- |
| widgetId           | required | Widget ID, provided by Engageya.                   | `85610`    | integer |
| websiteId           | required | Website ID, provided by Engageya.                   | `91140`    | integer |
| pageUrl       |  optional        | Pass current user URL.                      |  `'https://engageya.com'`       | String |

