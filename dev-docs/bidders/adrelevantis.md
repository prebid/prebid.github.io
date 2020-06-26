---
layout: bidder
title: adrelevantis
description: Prebid Adrelevantis (adrelevantis.xyz) Bidder Adaptor
hide: true
biddercode: adrelevantis
---

### Note:
This adapter is for displaying ads relevant to page content. You can find more info at (https://adrelevantis.xyz).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `placementId` | required |  Meaningless, but required id          | `234234`   | `integer` |
| `cpm`         | optional | forces bidder to insert custom cpm bid            |   0.50      | `decimal`  |
