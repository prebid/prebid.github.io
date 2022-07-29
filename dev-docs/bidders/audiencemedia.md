---
layout: bidder
title: Audience Media
description: Prebid Audience Media Bidder Adaptor
pbjs: true
media_types: banner, video
gdpr_supported: true
biddercode: audiencemedia
aliasCode : adkernel
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Ad network's RTB host | `'cpm.audience.media'` | `string` |
| `zoneId` | required | Zone ID           | `'76156'`                 | `string` |
