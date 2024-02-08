---
layout: bidder
title: zMaticoo
description: zMaticoo Prebid Bidder Adapter
pbjs: true
biddercode: zmaticoo
deals_supported: false
tcfeu_supported: true
gvl_id: 803
media_types: banner
sidebarType: 1
safeframes_ok: true
ortb_blocking_supported: partial
---

### Note

To use this bidder you will need a valid pubId. For further information, please contact <support@zmaticoo.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                                                | Example                 | Type           |
|----------------------|----------|----------------------------------------------------------------------------------------------------------------------------|-------------------------|----------------|
| `pubId`              | required | The pubId provided by zmaticoo                                                                                             |`"prebid_test"`          | `string`       |
| `user`               | optional | The object containing user data (See OpenRTB spec)                                                                         | `user: {}`              | `object`       |
| `device`             | optional | The object containing device data (See OpenRTB spec)                                                                       | `device: {}`            | `object`       |
| `site`               | optional | The object containing site data (See OpenRTB spec)                                                                         | `site: {}`              | `object`       |
| `app`                | optional | The object containing app data (See OpenRTB spec)                                                                          | `app: {}`               | `object`       |
| `test`               | optional | Flag which will induce a sample bid response when true; only set to true for testing purposes (1 = true, 0 = false)        | `1`                     | `integer`      |
| `at`                 | optional | Auction type, where 1 = First Price, 2 = Second Price Plus                                                                 | `1`                     | `integer`      |
| `tmax`               | optional | Maximum time in milliseconds the exchange allows for bids to be received including Internet latency to avoid timeout       | `200`                   | `integer`      |
| `wseat`              | optional | White list of buyer seats (e.g., advertisers, agencies) allowed to bid on this impression                                  | `wseat: ["123"]`        | `string array` |
| `bseat`              | optional | Block list of buyer seats (e.g., advertisers, agencies) restricted from bidding on this impression                         | `bseat: ["123"]`        | `string array` |
| `allimps`            | optional | Flag to indicate that the impressions offered represent all the impressions available in context (1 = true, 0 = false)     | `1`                     | `integer`      |
| `wlang`              | optional | White list of languages for creatives                                                                                      | `wlang: ["ENG"]`        | `string array` |
| `bcat`               | optional | Blocked advertiser categories using the IAB content categories                                                             | `bcat: ["123"]`         | `string array` |
| `badv`               | optional | Block list of advertisers by their domains                                                                                 | `badv: ["blocked.com"]` | `string array` |
| `bapp`               | optional | Block list of applications by their platform-specific exchange independent application identifiers                         | `badv: ["com.blocked"]` | `string array` |
| `source`             | optional | A Source object that provides data about the inventory source and which entity makes the final decision (See OpenRTB spec) | `source: {}`            | `object`       |
| `ext`                | optional | An extension object that allows for custom fields and objects to be sent  (See OpenRTB spec)                               | `ext: {}`               | `object`       |

### AdUnit Format Example
#### AdUnit Format for Banner

```javascript
 var adUnits = [{
    code: 'banner-01',
    mediaTypes: {
        banner: {
            sizes: [[320, 50]]
        }
    },
    bids: [{
        bidder: "zmaticoo",
        params: {
            pubId: 'prebid-test',
            tagid:"001"
        },
    }]
}];
```

#### AdUnit Format for video

```javascript
     var adUnits = [{
    code: 'video_ad_unit_1',
    mediaTypes: {
        video: {
            playerSize: [480, 320],
            mimes: ['video/mp4'],
            context: 'outstream',
        }
    },
    renderer: {
        url: 'https://creative.cdnyeah.com/tpl/renderer/video/zmaticooOutsteam.js',
        render: function (bid) {
            adResponse = {
                ad: {
                    video: {
                        content: bid.vastXml,
                        player_height: 320,
                        player_width: 480,
                    },
                },
            }
            bid.renderer.push(() => {
                ZMOutstreamVideo.renderAd({
                    vastUrl: bid.vastXml,
                    adUnitCode: bid.adUnitCode
                });
            });
        }
    },
    bids: [{
        bidder: "zmaticoo",
        params: {
            pubId: 'prebid-test',
            tagid:"001"
        }
    }]
}];
```

### Use prebid.js for an Admanager
   To use prebid.js,you can use an Ad Server,like:Google Ad Manager、Smart Ad Server、Xandr Monetize Ad Server。Ad Server helps you manage your ad order,and helps you record  ad rendor impression.
   Below these file demo implemented settings with Google Ad Manager

   {: .table .table-bordered .table-striped }
   | mediaType            | demo(md)  | demo(html)                        |                                                                                       
   |----------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------|
   | `Banner`             | `https://creative.cdnyeah.com/tpl/renderer/template/banner-gam.md` | `https://creative.cdnyeah.com/tpl/renderer/template/banner-gam.html`          |
   | `outstream video`    | `https://creative.cdnyeah.com/tpl/renderer/template/video-outstream-gam.md` | `https://creative.cdnyeah.com/tpl/renderer/template/video-outstream-gam.html`    |
   | `instream video`     | `https://creative.cdnyeah.com/tpl/renderer/template/video-instream-gam.md` | `https://creative.cdnyeah.com/tpl/renderer/template/video-instream-gam.html`    |

### Use prebid.js for No Admanager
If you don't want to use third-party Ad Server,you can direct integration with zMaticoo。zMaticoo  will provide you with a platform(`https://adx.zmaticoo.com`),You can count your request volume,impressions,and income.
Below, these file demos help you integrate with no Admanager

{: .table .table-bordered .table-striped }
| mediaType            | demo(md)  | demo(html)                        |                                                                                       
|----------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `Banner`             | `https://creative.cdnyeah.com/tpl/renderer/template/banner-noadserver.md` | `https://creative.cdnyeah.com/tpl/renderer/template/banner-noadserver.html`        |
| `outstream video`    | `https://creative.cdnyeah.com/tpl/renderer/template/video-outstream-noadserver.md` | `https://creative.cdnyeah.com/tpl/renderer/template/video-outstream-noadserver.html`    |
| `instream video`     | `https://creative.cdnyeah.com/tpl/renderer/template/video-instream-noadserver.md` | `https://creative.cdnyeah.com/tpl/renderer/template/video-instream-noadserver.html`   |
