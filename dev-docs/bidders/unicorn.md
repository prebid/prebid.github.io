---
layout: bidder
title: UNICORN
description: Prebid UNICORN Bidder Adaptor
hide: true
media_types: banner
biddercode: unicorn
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                               | Example    | Type      |
|---------------|----------|-------------------------------------------|------------|-----------|
| `placementId` | optional | Your placement ID | `'rectangle-ad-1'` | `string`  |
| `accountId` | required | Account ID for charge request (provided by UNICORN) | `12345`    | `integer` |
| `bidfloorCpm` | optional | Floor CPM (JPY); defaults to 0.  | `0.2`    | `float` |
| `bcat` | optional | Blocked IAB categories | `['IAB-1', 'IAB-2']`    | `[string]` |
