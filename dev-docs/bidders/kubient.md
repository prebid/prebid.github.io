---
layout: bidder
title: Kubient
description: Prebid Kubient Bidder Adapter
pbjs: true
pbs: true
schain_supported: true
biddercode: kubient
media_types: banner, video
gdpr_supported: true
usp_supported: true
coppa_supported: true
tcf2_supported: true
gvl_id: 794
sidebarType: 1
---

### Note

The Kubient Bidder Adapter requires setup and approval before beginning. Please reach out to <prebid@kubient.com> for more details.

Banner Settings:

var adUnits = [
    {
        code: 'banner-ad-unit',
        mediaTypes: {
            banner: {
                sizes: [[300, 100]]
            }
        },
        bids: [{
            bidder: 'kubient',
            params: {
                zoneid: "5fbb948f1e22b",
            }
        }]
    }
];

Video Settings:

var adUnits = [
    {
        code: 'video-ad-unit',
        mediaTypes: {
            video: {
                playerSize: [300, 250],               // required
                context: 'instream',                  // required
                mimes: ['video/mp4','video/x-flv'],   // required
                protocols: [ 2, 3 ],                  // required, set at least 1 value in array
                placement: 1,                         // optional, defaults to 2 when context = outstream
                api: [ 1, 2 ],                        // optional
                skip: 0,                              // optional
                minduration: 5,                       // optional
                maxduration: 30,                      // optional
                playbackmethod: [1,3],                // optional
                battr: [ 13, 14 ],                    // optional
                linearity: 1,                         // optional
                minbitrate: 10,                       // optional
                maxbitrate: 10                        // optional
            }
        },
        bids: [{
            bidder: 'kubient',
            params: {
                zoneid: "60ad1c0b35864",
            }
        }]
    }
];

### Bid Params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                                      | Example                  | Type     |
|--------|----------|--------------------------------------------------|--------------------------|----------|
| zoneid | required | The AdUnit or Tag specific ID                    | `'5fbb948f1e22b'`        | `string` |
