---
layout: bidder
title: FeedAd
description: Prebid FeedAd Bidder Adaptor
gpp_sids: tcfeu, usp
pbjs: true
pbs: true
biddercode: feedad
tcfeu_supported: true
media_types: banner
gvl_id: 781
sidebarType: 1
usp_supported: true
prebid_member: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                              | Example                                                  | Type     |
|---------------|----------|----------------------------------------------------------|----------------------------------------------------------|----------|
| `clientToken` | required | Your FeedAd client token. Check your FeedAd admin panel. | `'EiRjZDFiYzI2ZC03OTA2LTQyOTEtOGFmMC0xYzMyZmMwNTFkMDU='` | `string` |
| `placementId` | required | A FeedAd placement ID of your choice                     | `'prebid-test'`                                          | `string` |
| `decoration` | optional | A decoration to apply to the ad slot. See our [documentation](https://docs.feedad.com/web/feed_ad/#decorations) | `'sticky bottom height=200px'` | `string` |
| `sdkOptions` | optional | Only required if you are using Prebid.JS in an app environment (aka hybrid App). See our [documentation](https://docs.feedad.com/web/configuration/#hybrid-app-config-parameters) | `{ hybrid_app: true, hybrid_platform: "android", bundle_id: "your.app.bundle", app_name: "Your App", limit_ad_tracking: false, advertising_id: "the user's ad id" }` | `object` |
