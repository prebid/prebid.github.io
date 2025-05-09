---
layout: bidder
title: MeloZen
description: Prebid MeloZen Bidder Adaptor
biddercode: melozen
schain_supported: true
dchain_supported: false
media_types: banner, video, native
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
sidebarType: 1
---

### Note

The MeloZen Bidding adapter requires setup before beginning. Please contact us at <DSP@meldong.com>

### Bid Params

{: .table .table-bordered .table-striped }

| Name    | Scope    | Description                       | Example      | Type     |
|---------|----------|-----------------------------------|--------------|----------|
| `pubId` | required | The publisher's ID provided by MeloZen | `'386276e072'` | `string` |
