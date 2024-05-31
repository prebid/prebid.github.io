---
layout: bidder
title: PubMatic
description: Prebid PubMatic Bidder Adaptor
biddercode: pubmatic
media_types: banner, video, native
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
userIds: all
prebid_member: true
safeframes_ok: true
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
ortb_blocking_supported: true
gvl_id: 76
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description        | Example                      | Type     |
|---------------|----------|--------------------|------------------------------|----------|
| `publisherId` | required | Publisher ID          | `'32572'`                 | `string` |
| `adSlot`      | optional | Ad Slot Name (see below)| `'38519891'`            | `string` |
| `pmzoneid`    | optional | Zone ID               | `'zone1,zone2'`           | `string` |
| `lat`         | optional | Latitude              | `'40.712775'`             | `string` |
| `lon`         | optional | Longitude             | `'-74.005973'`            | `string` |
| `yob`         | optional | Year of Birth         | `'1982'`                  | `string` |
| `gender`      | optional | Gender                | `'M'`                     | `string` |
| `kadpageurl`  | optional | Overrides Page URL    |  `'http://www.yahoo.com/'`| `string` |
| `kadfloor`    | optional | Bid Floor             | `'1.75'`                  | `string` |
| `currency`    | optional | Bid currency           | `'AUD'` (Value configured only in the 1st adunit will be passed on. <br/> Values if present in subsequent adunits, will be ignored.)                    | `string` |
| `dctr`        | optional | Deal Custom Targeting <br/> (Value configured only in the 1st adunit will be passed on. <br/> Values if present in subsequent adunits, will be ignored.) | `'key1=123|key2=345'`        | `string` |
| `acat`    | optional | Allowed categories  <br/> (List of allowed categories for a given auction to be sent in either using ortb2 config (request.ext.prebid.bidderparams.pubmatic.acat) or using slot level params. If categories sent using both then priority will be given to ortb2 over slot level params.) | `[ 'IAB1-5', 'IAB1-6', 'IAB1-7' ]` | `array of strings` |
| `bcat`    | optional | Blocked IAB Categories  <br/> (Values from all slots will be combined and only unique values will be passed. An array of strings only. Each category should be a string of a length of more than 3 characters.) | `[ 'IAB1-5', 'IAB1-6', 'IAB1-7' ]`     | `array of strings` |
| `deals`    | optional | PMP deals  <br/> (Values from each slot will be passed per slot. An array of strings only. Each deal-id should be a string of a length of more than 3 characters.) | `[ 'deal-id-5', 'deal-id-6', 'deal-id-7' ]`     | `array of strings` |
| `outstreamAU`    | optional | Oustream AdUnit described in Blue BillyWig UI. This field is mandatory if mimeType is described as video and context is outstream (i.e., for outstream videos)           | `'renderer_test_pubmatic'`           | `string` |

### Configuration

PubMatic recommends the UserSync configuration below.  Without it, the PubMatic adapter will not able to perform user syncs, which lowers match rate and reduces monetization.

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*',      // '*' represents all bidders
        filter: 'include'
      }
    }
  }
});
```

Note: Combine the above the configuration with any other UserSync configuration. Multiple setConfig() calls overwrite each other and only last call for a given attribute will take effect.

### adSlot Specification and Multi-Size Ad Units

The adSlot parameter supports two different formats:

{: .table .table-bordered .table-striped }
| Format         | Example              |
|----------------|----------------------|
| Without Size   | `'38519891'`         |
| With Size      | `'38519891@300x205'` |

adSlot parameter is optional.  To omit the adSlot parameter, your publisher account must have default site and tag enabled.  Consult your account manager to find out if default site and tag is enabled on your account.  If used, both formats are supported.  Without Size is the recommended option.  Both options will send the ad request with all sizes specified in the Prebid ad unit configuration.

### video parameters

The PubMatic adapter supports video as of Prebid v1.16.0

{: .table .table-bordered .table-striped }
| Name                      | Scope    | Description                                              | Example |
| :----------------------| :------- | :---------------------------------------------------------- | :------ |
| `video.mimes`          | required | Video MIME types                                            | `['video/mp4','video/x-flv']` |
| `video.skippable`      | optional | If 'true', user can skip ad                                 | `true` |
| `video.minduration`    | optional | Minimum ad duration in seconds                              | `5` |
| `video.maxduration`    | optional | Maximum ad duration in seconds                              | `30` |
| `video.startdelay`     | optional | Start delay in seconds for pre-roll, mid-roll, or post-roll ad placements | `5` |
| `video.playbackmethod` | optional | Defines whether inventory is user-initiated or autoplay sound on/off<br/>Values:<br/>`1`: Auto-play, sound on<br/>`2`: Auto-play, sound off<br/>`3`: Click-to-play<br/>`4`: mouse-over      | `1` |
| `video.api`            | optional | API frameworks supported<br/>Values:<br/>`1`: VPAID 1.0<br/>`2`: VPAID 2.0<br/>`3`: MRAID-1<br/>`4`: ORMMA<br/>`5`: MRAID-2                                                                            | `[1, 2]` |
| `video.protocols`      | optional |  Supported video bid response protocols<br/>Values<br/>`1`: VAST 1.0<br/>`2`: VAST 2.0<br/>`3`: VAST 3.0<br/> `4`: VAST 1.0 Wrapper<br/>`5`: VAST 2.0 Wrapper<br/>`6`: VAST 3.0 Wrapper            | `[5, 6]` |
| `video.battr`          | optional | Blocked creative attributes, See [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.3 for values             | `[3, 9]` |
| `video.linearity`      | optional | Indicates if the impression is linear or nonlinear<br/>Values:<br/>`1`: Linear/In-Stream<br/>`2`: Non-Linear/Overlay.                                                                                | `1` |
| `video.placement`      | optional | Video placement type.  See [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.9 for Values                            | `1` |
| `video.plcmt`          | optional | Video placement type. See [OpenRTB 2.6 specification - github](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/develop/2.6.md#327---object-video-), For values [plcmt subtypes](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/develop/AdCOM%20v1.0%20FINAL.md#list_plcmtsubtypesvideo)                            | `1` |
| `video.minbitrate`     | optional | Minumim bit rate in Kbps.                                   | 50 |
| `video.maxbitrate`     | optional | Maximum bit rate in Kbps.                                   | 70 |

### AdUnit Format for Video

```javascript
var videoAdUnits = [
{
    code: 'test-div-video',
    mediaTypes: {
        video: {
            playerSize: [640, 480],           // required
            context: 'instream',
            mimes: ['video/mp4','video/x-flv'],   // required
            skip: 1,                              // optional
            minduration: 5,                       // optional
            maxduration: 30,                      // optional
            startdelay: 5,                        // optional
            playbackmethod: [1,3],                // optional
            api: [ 1, 2 ],                        // optional
            protocols: [ 2, 3 ],                  // optional
            battr: [ 13, 14 ],                    // optional
            linearity: 1,                         // optional            
            placement: 2,                         // optional
            plcmt: 1,                             // optional
            minbitrate: 10,                       // optional
            maxbitrate: 10                        // optional
        }
    },
    bids: [{
      bidder: 'pubmatic',
      params: {
        publisherId: '32572',                     // required
        adSlot: '38519891@300x250'                // required
      }
    }]
}]
```

### AdUnit Format for Native

```javascript
var adUnits = [
{
    code: 'test-div',    
    mediaTypes: {
       native: {
            image: {
                required: true,
                sizes: [150, 50]
            },
            title: {
                required: true,
                len: 80
            },
            sponsoredBy: {
                required: true
            },
            body: {
                required: true
            }
        }
    },
    bids: [{
      bidder: 'pubmatic',
      params: {
        publisherId: '156295',               // required
        adSlot: 'pubmatic_test2@1x1',       // required
      }
    }]
}];
```

### Configuration for video

For Video ads, prebid cache needs to be enabled for PubMatic adapter.

```javascript
pbjs.setConfig({
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```

### Prebid Server Test Request

The following test parameters can be used to verify that Prebid Server is working properly with the
PubMatic adapter. This example includes an `imp` object with an PubMatic test publisher ID, ad slot,
and sizes that would match with the test creative.

```json
{
"imp":[
      {
         "id":"some-impression-id",
         "banner":{
            "format":[
               {
                  "w":300,
                  "h":250
               },
               {
                  "w":300,
                  "h":600
               }
            ]
         },
         "ext":{
            "pubmatic":{
               "publisherId": "156276",
               "adSlot":"pubmatic_test"
            }
         }
      }
   ]
}
```

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The following fields are supported:

- `ortb2.site.*`
- `ortb2.user.*`

AdUnit-specific data is supported using `AdUnit.ortb2Imp.ext.*`
<!-- workaround bug where code blocks at end of a file are incorrectly formatted-->
