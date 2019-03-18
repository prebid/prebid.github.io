---
layout: bidder
title: ONE by AOL Display
description: Prebid AOL Bidder Adaptor
hide: true
biddercode: onedisplay
aliasCode : aol
biddercode_longer_than_12: false
---



### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                             | Example                                       | Type     |
|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|----------|
| `placement` | required | The placement ID from AOL.                                                                                                                                                              | `'23324932'`                                  | `string` |
| `network`   | required | The network ID from AOL.                                                                                                                                                                | `'5071.1'`                                    | `string` |
| `alias`     | optional | The placement alias from AOL.                                                                                                                                                           | `'desktop_articlepage_something_box_300_250'` | `string` |
| `server`    | optional | The server domain name. Default is adserver-us.adtech.advertising.com. EU customers must use adserver-eu.adtech.advertising.com, and Asia customers adserver-as.adtech.advertising.com. | `'adserver-eu.adtech.advertising.com'`        | `string` |
| `bidFloor`  | optional | Dynamic bid floor (added in Prebid 0.8.1)                                                                                                                                               | `'0.80'`                                      | `string` |

ONE by AOL Display is an aliased bidder for AOL
