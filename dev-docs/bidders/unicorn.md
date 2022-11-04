---
layout: bidder
title: UNICORN
description: Prebid UNICORN Bidder Adaptor
pbjs: true
pbs: true
pbs_app_supported: true
media_types: banner
biddercode: unicorn
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                               | Example    | Type      |
|---------------|----------|-------------------------------------------|------------|-----------|
| `placementId` | optional | Your placement ID | `'rectangle-ad-1'` | `string` |
| `accountId` | required | Account ID for charge request (provided by UNICORN) | `12345` | `integer` |
| `publisherId` | optional | Account specific publisher id. | `'67890'` | `string`  |
| `mediaId` | optional | Publisher specific media id. | `'example'` | `string` |
| `bcat` | optional for Prebid.js  | Blocked IAB categories | `['IAB-1', 'IAB-2']` | `[string]` |

`publisherId` as `integer` is also supported on Prebid.js