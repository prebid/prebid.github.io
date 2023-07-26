---
layout: bidder
title: AdsYield
description: Prebid AdsYield Bidder Adaptor
pbjs: true
pbs: true
biddercode: adsyield
aliasCode: admixer
media_types: video
gvl_id: 1199
tcfeu_supported: true
usp_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                                                     | Example                                  | Type      |
|---------------|----------|-----------------------------------------------------------------------------------------------------------------|------------------------------------------|-----------|
| `zone`        | required | The unique identifier of the ad placement. Could be obtained from the AdsYield UI or from your account manager. | `'e5ff8e48-4bd0-4a2c-9236-55530ab8981d'` | `string`  |
| `host`        | required | Ad network's RTB host                                                                                           | `'open-adsyield.com'`                    | `string`  |
| `publisherId` | required | Publisher ID                                                                                                    | `12345`                                  | `integer` |

Adsyield server-side Prebid Server adapter requires only `publisherId` and `host` parameters. But Adsyield client-side Prebid.js adapter requires only `zone`.

Adsyield server-side Prebid Server adapter supports only `banner`, `video`, `audio`, `native` media types. But Adsyield client-side Prebid.js adapter supports only `video` media types, doesn't support `banner`, `audio` and `native`.
