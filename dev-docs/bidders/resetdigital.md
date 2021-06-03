---
layout: bidder
title: ResetDigital
description: Reset Digital Bidder Module
hide: true
pbjs: true
biddercode: resetdigital
gdpr_supported: true
media_types: banner, video
---

### bid params

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description | Example                            | Type     |
|----------|----------|-------------|------------------------------------|----------|
| `pubId` | required |    Publisher account id         | `'123pubid'` | `string` |
| `zoneId` | optional |   Ad zone specific id if provided          | `'456zoneId'` | `string` |
| `forceBid` | optional | Returns test bid | true | `boolean` |
