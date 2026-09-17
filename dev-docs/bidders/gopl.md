---
layout: bidder
title: gopl
description: Go.pl Bidder Adaptor
pbjs: true
pbs: true
biddercode: gopl
redirect_from:
  - /dev-docs/bidders/sspBC
media_types: banner, video, native
floors_supported: true
tcfeu_supported: true
gvl_id: 690
sidebarType: 1
---

{: .alert.alert-info :}
This adapter was formerly named `sspBC`. It has been renamed to `gopl`; if you're upgrading from the old integration, update your bidder code from `sspBC` to `gopl`.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                | Example                     | Type      |
|---------------|----------|----------------------------|-----------------------------|-----------|
| `id`          | optional | placement id               | `'006'`                     | `string`  |
| `siteId`      | optional | site id                    | `'235911'`                  | `string`  |
