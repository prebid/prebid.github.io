---
layout: bidder
title: InMobi
description: InMobi Bidder Adapter
biddercode: inmobi
tcfeu_supported: true
usp_supported: true
gvl_id: 333
coppa_supported: true
schain_supported: true
media_types: banner, video, native
pbs: true
pbs_app_supported: true
sidebarType: 1
pbjs: true
---

### Note

The InMobi Prebid adapter requires a setup to create placement IDs. Please contact your InMobi partner manager for setup assistance.
For queries, write to us at <prebid-support@inmobi.com>

### User Sync Disclosure

Third-party cookie syncing helps publishers leverage their audience data, enhance targeting capabilities, and drive better ad performance. InMobi third party cookie syncing improves monetization for publishers by giving them a competitive positioning in the digital advertising ecosystem.
Ids for third parties can be synced through our pixel: `https://sync.inmobi.com/prebid?gdpr={GDPR}&gdpr_consent={GDPR_CONSENT}&us_privacy={US_PRIVACY}&redirect={RedirectURL}` .
The RedirectURL should contain uuid macro, which is {ID5UID}.

To opt out of InMobi ads on web inventory the user needs to visit the Opt-out page on InMobi website `https://www.inmobi.com/page/opt-out/`.

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `plc`         | required | Placement ID          | `'1234'`  | `string`  |
| `bidfloor`    | optional | Bid Floor             | `1.09`    | `float`   |

### First Party Data

Inmobi supports both `ortb2` and `ortb2Imp` methods to set [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

The standard Open RTB properties supported from `ortb2` / `ortb2Imp` are described in the following table.

{: .table .table-bordered .table-striped }

| Name              | Scope    | Description                                                                                                                                                                                                                                                                  | Example  | Type      |
|-------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| `ortb2Imp.instl`      | optional | Details on interstitial/full-screen, 1 indicates that the ad is interstitial or full-screen, while 0 means it is not.                                                                                                                                                                                                   | `1`      | `integer`  |
| `ortb2Imp.rwdd`   | optional | Specifies if the user receives a reward for viewing the ad: 0 for no, and 1 for yes.                                                                                                                                                                                      | `1`      | `integer` |
| `ortb2.user`      | optional | Information about the advertising device's human user, provided through an OpenRTB User object.                                                                                                                                                                                   | N/A      | `object`  |
| `ortb2.site`      | optional | Information about the publisher's website provided through an OpenRTB Site object.                                                                                                                                                                                                    | N/A      | `object`  |
| `ortb2.device`      | optional | Information about the user's device provided through an OpenRTB device object.                                                                                                                                                                                                    | N/A      | `object`  |
| `ortb2.bcat`      | optional | Blocked advertiser categories using the IAB content categories.                                                                                                                                                                                                    |  `[ "IAB25" ]`      | `string array`  |
| `ortb2.badv`      | optional | Block list of advertisers by their domains                                                                                                                                                                                                     |  `[ "ford.com" ]`     | `string array`  |
| `ortb2.regs`      | optional | Regulatory conditions in effect for all impressions in this bid request.                                                                                                                                                                                                    | N/A      | `object`  |

Besides these standard properties, `ext` field can be used to send any publisher specific data which may have been discussed with a Inmobi partner manager.

### Example Ad-Units

## Banner

```javascript
    var adUnits = [{
            code: 'div-gpt-ad-1460505748561-0',
            mediaTypes: {
                banner: {
                    sizes: [[300, 250]],
                }
            },
            bids: [{
                bidder: 'inmobi',
                params: {
                    plc: '1719108420057' // Mandatory
                }
            }]
    }];
```

## Video

```javaScript
    var adUnits = [{
            code: 'div-gpt-ad-1460505748561-0',
            mediaTypes: {
                video: {
                    playerSize : [300,250],
                    mimes :  ["video/x-ms-wmv", "video/mp4"],
                    minduration : 0,
                    maxduration: 30,
                    protocols : [1,2],
                    api: [1, 2, 4, 6],
                    protocols: [3, 4, 7, 8, 10],
                    placement: 1,
                    plcmt: 1
                }
            },
            // Replace this object to test a new Adapter!
            bids: [{
                bidder: 'inmobi',
                params: {
                    plc: '1443164204446401' //Mandatory
                }
            }]
    }];
```

## Native

```javascript
    var adUnits = [{
            code: 'div-gpt-ad-1460505748561-0',
            mediaTypes: {
                native: {
                        type: 'image'
                }
            },
            bids: [{
                bidder: 'inmobi',
                params: {
                    plc: '10000033152',
                    bidfloor: 0.9
                }
            }]
    }];
```
