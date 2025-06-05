---
layout: bidder
title: VLYBY
description: Prebid VLYBY Bidder Adapter
biddercode: vlyby
media_types: banner, video
schain_supported: false
prebid_member: false
pbjs: true
sidebarType: 1
---

### Note

The VLYBY Header Bidder Adapter needs a Contract with VLYBY Digital GmbH, Munich. Please contact <prebid@vlyby.com> for additional information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                           | Example                                     | Type     |
|----------------|----------|---------------------------------------------------------------------------------------|---------------------------------------------|----------|
| `publisherId`| required | VLYBY PublisherId                                                                 | `'12345'`                                   | `string` |
| `placement`   | optional | Placement Id                                                                    | `'12345'`                                   | `string` |
