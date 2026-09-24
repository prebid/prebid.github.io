---
layout: bidder
title: Allegro
description: Allegro Prebid Bidder Adapter
gvl_id: 1493
biddercode: allegro
media_types: banner, video, native
pbjs: true
pbs: false
gpp_sids: tcfeu
tcfeu_supported: true
usp_supported: false
coppa_supported: false
dsa_supported: false
schain_supported: true
dchain_supported: false
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: true
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
prebid_member: false
sidebarType: 1
privacy_sandbox: no
---

### Overview

Allegro adapter: banner-only, OpenRTB 2.5, default endpoint `https://dsp.allegro.pl/prebid`, TTL 360s, net revenue true.

### Quick Use

Minimal ad unit:

```javascript
var adUnits = [{
    code: 'slot-1',
    mediaTypes: {banner: {sizes: [[300, 250]]}},
    bids: [{bidder: 'allegro'}]
}];
```

Request bids as usual with `pbjs.addAdUnits` and `pbjs.requestBids`.

### Optional Config

```javascript
pbjs.setConfig({
    allegro: {
        bidderUrl: 'https://prebid.rtb.allegrogroup.com/v1/rtb/prebid/bid', // override if needed
        convertExtensionFields: true,              // map ext -> [com.google.doubleclick.*]
        triggerImpressionPixel: false              // fire win pixel if true
    }
});
```

### What It Does

1. Builds standard OpenRTB banner requests.
2. (Optional) Renames common `ext` objects to DoubleClick-style extension proto fields for downstream systems.
3. Converts numeric flags (`dnt`, `sua.mobile`, `test`, etc.) to booleans.
4. On bid win (if enabled) fires `burl`.

### Contact

For onboarding or support: <the-bidders@allegro.com>
