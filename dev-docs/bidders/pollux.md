---
layout: bidder
title: Pollux Network
description: Prebid Pollux Network Bidder Adaptor
pbjs: true
biddercode: pollux
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                                                                                                     | Example | Type     |
|--------|----------|-----------------------------------------------------------------------------------------------------------------|---------|----------|
| `zone` | required | The zone ID from Pollux Network. You must identify a zone using a valid ID provided on Pollux Network platform. | `'276'` | `string` |

(Sizes set in `adUnit` object will apply to the Pollux Network bid requests. If the indicated zone does not support any of the requested sizes, a null bid will be responded.)
