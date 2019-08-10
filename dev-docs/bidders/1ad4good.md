---
layout: bidder
title: 1ad4good
description: Prebid One Ad for Good(1ad4good.org) Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: 1ad4good

aliasCode : appnexus



---
### Note:
this adapter is for displaying free ads for various not profits. You can find more info at [1ad4good.org])(http://1ad4good.org). Use is similar to appnexus so you can just copy its config and change bidder to '1ad4good'

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `placementId` | required |  Meaningless, but required id          | `234234`   | `integer` |
| `cpm`         | optional | forces bidder to insert custom cpm bid            |   0.50      | `decimal`  |