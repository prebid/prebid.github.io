---
layout: bidder
title: BeOp
description: BeOp Bidder Adaptor
pbjs: true
pbs: false
media_types: banner
biddercode: beop
tcfeu_supported: true
gvl_id: 666
usp_supported: false
floors_supported: true
schain_supported: true
sidebarType: 1
---

### Disclosure

The BeOp bidder adaptor needs an account id that you can find as a publisher, a reseller or a media group directly in your BeOp platform access. We also need to approve your account to be available for BeOp demand, so don't hesitate to reach your account manager or <publishers@beop.io> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-------------|---------|----------|
| `accountId` or `networkId` | required | Your BeOp account ID | `'5a8af500c9e77c00017e4cad'` | `string` |
| `currency` | optional | Your currency | `'EUR'` (default) or `'USD'` | `string` |
