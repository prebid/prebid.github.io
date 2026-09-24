---
layout: bidder
title: Adbix
description: Prebid Adbix Bidder Adapter
pbjs: true
pbs: false
biddercode: adbix
media_types: banner
coppa_supported: false
tcfeu_supported: false
usp_supported: false
schain_supported: true
dchain_supported: false
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
userId: none
sidebarType: 1
---

## Registration

To use the Adbix bidder you will need a valid publisher ID and placement ID from Adbix. For further information, please contact <admin@adbix.net>.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                         | Example            | Type      |
|---------------|----------|-------------------------------------|--------------------|-----------|
| `publisherId` | required | Adbix publisher identifier          | `'test-publisher'` | `string`  |
| `placementId` | required | Adbix placement identifier          | `'test-300x250'`   | `string`  |
| `test`        | optional | Enables the Adbix test response     | `true`             | `boolean` |

## User Sync

User sync is recommended to improve match rates and monetization. The adapter registers an image user-sync request when image/pixel syncing is enabled by the publisher. The auction continues to work when image user syncing is disabled.

## Privacy

For information about Adbix privacy practices, see: <https://adbix.net/privacy-policy.php>
