---
layout: bidder
title: FeedAd
description: Prebid FeedAd Bidder Adaptor
pbjs: true
biddercode: feedad
gdpr_supported: true
media_types: banner
gvl_id: 781
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                              | Example                                                  | Type     |
|---------------|----------|----------------------------------------------------------|----------------------------------------------------------|----------|
| `clientToken` | required | Your FeedAd client token. Check your FeedAd admin panel. | `'EiRjZDFiYzI2ZC03OTA2LTQyOTEtOGFmMC0xYzMyZmMwNTFkMDU='` | `string` |
| `placementId` | required | A FeedAd placement ID of your choice                     | `'prebid-test'`                                          | `string` |
