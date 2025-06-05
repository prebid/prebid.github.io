---
layout: bidder
title: Avocet
description: Prebid Avocet Bidder Adapter
pbjs: true
pbs: true
biddercode: avct
aliasCode: avocet
tcfeu_supported: false
media_types: banner, video
schain_supported: true
usp_supported: true
sidebarType: 1
---

### Registration

Please contact Avocet at <info@avocet.io> if you would like to get started selling inventory via the Avocet platform.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                  | Example                      | Type      |
|-------------|----------|------------------------------|------------------------------|-----------|
| `placement` | required | A Placement ID from Avocet.  | `"5ebd27607781b9af3ccc3332"` | `string`  |

**Prebid Server Note:** Avocet is disabled by default. Please enable it in the app config if you wish to use it. This can be done by setting `adapters.avocet.disabled` to `false` and by setting `adapters.avocet.endpoint` to a valid Avocet endpoint url.
