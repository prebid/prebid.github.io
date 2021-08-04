---
layout: bidder
title: UNICORN
description: Prebid UNICORN Bidder Adaptor
pbjs: true
pbs: true
pbs_app_supported: true
media_types: banner
biddercode: unicorn
pbjs_version_notes: not in 5.x
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                               | Example    | Type      |
|---------------|----------|-------------------------------------------|------------|-----------|
| `placementId` | optional | Your placement ID | `'rectangle-ad-1'` | `string`  |
| `accountId` | required | Account ID for charge request (provided by UNICORN) | `12345`    | `integer` |
| `bidfloorCpm` | optional for Prebid.js | Floor CPM (JPY); defaults to 0.  | `0.2`    | `float` |
| `publisherId` | optional | Account specific publisher id. | `67890` | `integer` |
| `mediaId` | required for Prebid Server, optional for Prebid.js | Publisher specific media id. | `'example'` | `string` |
| `bcat` | optional for Prebid.js  | Blocked IAB categories | `['IAB-1', 'IAB-2']` | `[string]` |
