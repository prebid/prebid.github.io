---
layout: bidder
title: BeOp
description: BeOp Bidder Adaptor
pbjs: true
biddercode: beop
sidebarType: 1
---

Note: This bidder never sends gdprApplies to its endpoint. This may result in some incorrect GDPR processing, such as when the consent string is not yet available but the publisher has decided GDPR always applies. See https://github.com/prebid/Prebid.js/issues/7775

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `accountId` or `networkId` | required |  Your BeOp account ID   | `'5a8af500c9e77c00017e4cad'`   | `string` |
| `currency`      | optional |  Your currency        |  `'EUR'` (default) or `'USD'`   | `string` |
