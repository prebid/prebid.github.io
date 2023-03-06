---
layout: bidder
title: Rubicon Project
description: Rubicon Project Prebid Bidder Adaptor
biddercode: rubicon
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video, native
userIds: all
prebid_member: true
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
ortb_blocking_supported: partial
gvl_id: 52
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Registration

For both Prebid.js and Prebid Server, the Rubicon Project adapter requires setup and approval from the Magnite team, even for existing accounts. Please reach out to your account team or globalsupport@magnite.com for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| `accountId`    | required           | The publisher account ID                                                                                                    | `4934`                                                                            | `integer`         |
| `siteId`       | required           | A unique ID for your site                                                                                                                 | `13945`                                                                           | `integer`         |
| `zoneId`       | required           | A unique ID for your site's ad placements                                                                                                                 | `23948`                                                                           | `integer`         |
| `position`     | optional           | Set the page position. Valid values are "atf" and "btf".                                                                    | `'atf'`                                                                             | `string`         |
| `userId`       | optional           | Site-specific user ID may be reflected back in creatives for analysis. Note that userId needs to be the same for all slots. | `'12345abc'`                                                                        | `string`         |
| `floor`       | optional           | Sets the global floor -- no bids will be made under this value.                                                             | `0.50`                                                                              | `float`          |
| `latLong`     | optional           | Sets the latitude and longitude for the visitor (avail since PBJS 1.10)                                                                            | `[40.7608, 111.8910]`                                                               | `Array<float>`   |
| `inventory`   | optional           |  See below for details on First Party Data. In release 4.29 and earlier, this parameter allows the definition of an object defining arbitrary key-value pairs concerning the page for use in targeting. The values must be arrays of strings. | `{"rating":["5-star"], "prodtype":["tech","mobile"]}`                               | `object`         |
| `visitor`      | optional           | See below for details on First Party Data. In release 4.29 and earlier, this parameter allows the definition of an object defining arbitrary key-value pairs concerning the visitor for use in targeting. The values must be arrays of strings. | `{"ucat":["new"], "search":["iphone"]}`                                             | `object`         |
| `keywords`     | optional           | See below for details on First Party Data. In release 4.29 and earlier, this can be used to influence reports for client-side display. To get video or server-side reporting, please use First Party data or the inventory/visitor parameters. | `["travel", "tourism"]`                                                             | `Array<string>`  |
| `video`       | required for video | Video targeting parameters. See the [video section below](#rubicon-video).                                                  | `{"language": "en"}` | `object`  |
| pchain | optional | deprecated option that was an early alternative to schain | "GAM:11111-reseller1:22222" | string |
| `bidonmultiformat` | optional | Beta parameter - please check with your account manager before setting this value | `boolean` | `true` |

#### First Party Data

In release 4.30 and later, publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:
- ortb2.site.ext.data.*
- ortb2.site.keywords
- ortb2.site.content.data[]
- ortb2.user.ext.data.*
- ortb2.user.data[]

With regards to Contextual and Audience segments, the Magnite exchange supports the IAB standard taxonomies. See [the segment management user guide](https://resources.rubiconproject.com/resource/publisher-resources/segment-management-user-guide/) for more information.

Example first party data that's available to all bidders and all adunits:
```
pbjs.setConfig({
  ortb2: {
    site: {
      keywords: "kw1,kw2",              // sent to Rubicon as 'keywords' available in reports for client-side display ads
      ext: {
        data: {
           prodtype: ["tech","mobile"]  // site.ext.data is sent to Rubicon as "inventory" data
        }
      }
    },
    user: {
      ext: {
        data: {
          ucat:["new"]                  // user.ext.data is sent to Rubicon as "visitor" data
        }
      }
    }
  }
};
```

Example of first party data available only to the Rubicon Project bidder. Applies across all ad units.
```
pbjs.setBidderConfig({
  bidders: ["rubicon"],
  config: {
    ortb2: {
      site: {
        keywords: "kw1,kw2",             // sent to Rubicon as 'keywords' available in reports for client-side display ads
        ext: {
          data: {
            prodtype: ["tech","mobile"]  // site.ext.data is sent to Rubicon as "inventory" data
          }
        }
      },
      user: {
        ext: {
          data: {
            ucat:["new"]                  // user.ext.data is sent to Rubicon as "visitor" data
          }
        }
      }
    }
  }
};
```

For Prebid.js 4.29 and before, use the bidder specific AdUnit parameters noted above:
```
var adUnit = {
    ...
    bids: [{
        bidder: 'rubicon',
        params: {
            accountId: 7780,                     // replace account/site/zone params
            siteId: 87184,
            zoneId: 413290,
            inventory: {
                prodtype: ["tech","mobile"]
            },
            visitor: {
                ucat:["new"]
            }
        }
    }]
};
```

#### ORTB Blocking

Rubicon supports passing up to 50 domains in `badv` for anything hitting Prebid Server, which includes these scenarios:

1. client-side video
2. s2sConfig
3. App
4. AMP

For example:
```
pbjs.setConfig({
  ortb2: {
    badv: ["domain1.com", "domain2.com"]
  }
)};
```

#### mediaTypes.video

The following video parameters are supported here so publishers may fully declare their video inventory:

{: .table .table-bordered .table-striped }
| Name           | Scope              | Description                                                                                                                                                                                              | Example | Type      |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| context | required | instream or outstream |"outstream" | string | 
| playerSize| required | width, height of the player in pixels | [640,360] - will be translated to w and h in bid request | array<integers> |
| mimes | required | List of content MIME types supported by the player (see openRTB v2.5 for options) | ["video/mp4"]| array<string>|
| protocols | required | Supported video bid response protocol values <br />1: VAST 1.0 <br />2: VAST 2.0 <br />3: VAST 3.0 <br />4: VAST 1.0 Wrapper <br />5: VAST 2.0 Wrapper <br />6: VAST 3.0 Wrapper <br />7: VAST 4.0 <br />8: VAST 4.0 Wrapper | [2,3,5,6] | array<integers>|
| api | required | Supported API framework values: <br />1: VPAID 1.0 <br />2: VPAID 2.0 <br />3: MRAID-1 <br />4: ORMMA <br />5: MRAID-2 | [2] |  array<integers> |
| linearity | required | OpenRTB2 linearity. 1: linear (in-stream ad), 2: non-linear (overlay ad) | 1 | integer |
| maxduration | recommended | Maximum video ad duration in seconds. | 30 | integer |
| minduration | recommended | Minimum video ad duration in seconds | 6 | integer |
| playbackmethod | recommended | Playback methods that may be in use. Only one method is typically used in practice. (see openRTB v2.5 section 5.10 for options)| [2]| array<integers> |
| skip | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes. | 1 | integer |
| skipafter| optional | Number of seconds a video must play before skipping is enabled; only applicable if the ad is skippable. | 6 | integer|
| minbitrate | optional | Minimum bit rate in Kbps. | 300 | integer |
| maxbitrate | optional | Maximum bit rate in Kbps. | 9600 | integer |
| startdelay* | recommended | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements.<br /> >0: Mid-Roll (value indicates start delay in second)<br /> 0: Pre-Roll<br />-1: Generic Mid-Roll<br />-2: Generic Post-Roll | 0 | integer |
| placement* | recommended | Placement type for the impression. (see openRTB v2.5 section 5.9 for options) | 1 | integer |
| | | | | |


#### bids.params.video

The following Rubicon Project-specific video parameters are supported:

{: .table .table-bordered .table-striped }
| Name           | Scope              | Description                                                                                                                                                                                              | Example | Type      |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| `size_id`      | optional for Prebid.js, required for Prebid Server |  Integer indicating the Rubicon Project video ad format ID. If not set, Prebid.js can infer from mediaTypes.video.context, placement, startDelay | `201`   | `integer` |
| `language`     | recommended | Indicates the language of the content video, in ISO 639-1/alpha2. Highly recommended for successful monetization for pre-, mid-, and post-roll video ads. Not applicable for interstitial and outstream. | `'en'`  | `string`  |

Here's a video example for Prebid.js 2.5 or later:

```
var videoAdUnit = {
    code: 'myVideoAdUnit',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [640, 480],
            mimes: ['video/mp4', 'video/x-ms-wmv'] // you must review all video
            protocols: [2,3,5,6],                  // parameters to ensure validity
            api: [2],                              // for your player and DSPs
            maxduration:30,          
            linearity: 1
        }
    },
    bids: [{
        bidder: 'rubicon',                        
        params: {
            accountId: 7780,                       // replace params
            siteId: 87184,
            zoneId: 413290,
            video: {
                language: 'en'
            }
        }
    }]
};
```

This example adunit will also work in Prebid.js 2.4 and earlier, but mimes, protocols and api are not required.

We recommend discussing video demand with your Magnite account representative.

Lists of values are in the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) documentation as referenced above.


#### Outstream Video

As of Prebid.js 4.37 Magnite's Rubicon Project adapter supports outstream video in two ways: using your own renderer or using ours. See the [Prebid.org Outstream documentation](/dev-docs/show-outstream-video-ads.html) for more information on using your own renderer.

#### Outstream Renderer

The Magnite outstream renderer is a JavaScript tag that will load our outstream video player and render when it is 50% or more in view, pause when it’s more than 50% out of view, and close when the ad has completed playing.

The renderer appearance can be configured with the following parameters, all of them optional. If any parameter is missing, the default value will be used. All options are case-sensitive and unknown options will be ignored. Additional advanced options are available by calling your Magnite account representative.

```
pbjs.setConfig({
  rubicon: {
    rendererConfig: {
      align: 'center',         // player placement: left|center|right (default is center)
      position: 'append'       // position relative to ad unit: append|prepend|before|after (default is after)
      closeButton: true,       // display 'Close' button (default is false)
      label: 'Advertisement',  // custom text to display above the player (default is '-')
      collapse: true           // remove the player from the page after ad playback (default is true)
    }
  }
});
```


* The Rubicon Project exchange does not make multi-format requests. If multiple mediatypes are defined, we bid on banner first, then video. Native bids will only be made if it's the only mediatype present.
* Note that only the Prebid-Server-side rubicon adapter currently supports native.

### Setting up the Prebid Server Adapter
  
If you're a Prebid Server host company looking to enable the Rubicon server-side adapter, you'll need to contact globalsupport@magnite.com. They will provide:
- a Magnite DV+ XAPI login and password that you'll place in the PBS config
- a partner code you can use for cookie-syncing with Magnite's service
  
### Configuration

#### Single-Request

By default, the Rubicon Project adapter sends one request to rubiconproject.com for each AdUnit. For example, if there are 4 PBJS AdUnits defined on the page, you'll see 4 calls out to rubiconproject.com/fastlane.json.

As of PBJS 1.12, the Rubicon Project adapter supports `Single Request` mode, where all AdUnit requests are made in a single call to rubiconproject.com. To turn this feature on, call `setConfig`:
```
pbjs.setConfig({
   rubicon: {singleRequest: true}
});
```

### Notes

1) There can only be one siteId and zoneId in an AdUnit bid. To get bids on multiple sitesIds or zoneIds, just add more 'rubicon' entries in the bids array.

<a name="rubicon-revenue-type"></a>

2) Bids through the Rubicon Project Exchange are by default 'net'.  For certain use cases it is possible for publishers to define a bid as either 'net' or 'gross'.  In either case the Rubicon platform does not signal externally to other systems either bid state.  

For Prebid, the Rubicon Project bid adapter reports the revenue type as ‘gross’ by default before 2.35 and ‘net’ by default in 2.35 and later (as the vast majority of accounts are net and all new accounts are net).

It’s important to note that what the Rubicon Prebid bid adapter reports is not directly related to the setting with the Rubicon Project exchange. If you are a publisher who has set your Rubicon exchange revenue type set to ‘gross’ and you'd like the Rubicon bid adapter to also report 'gross', you can change the 2.35+ default 'net' setting in Prebid.js with:

```
pbjs.setConfig({ rubicon: {netRevenue: false} });
```
