---
layout: bidder
title: Mediakeys
description: Mediakeys Prebid Bidder Adapter
biddercode: mediakeys
media_types: banner, video, native
gvl_id: 498
pbjs: true
floors_supported: true
gdpr_supported: true
schain_supported: true
coppa_supported: true
usp_supported: true
safeframes_ok: true
userIds: all
fpd_supported: true
sidebarType: 1
---
<a name="table-of-contents" ></a>

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Important Notice](#important-notice)
- [Bid Params](#bid-params)
  - [First Party Data](#first-party-data)
  - [Required and Recommended Modules](#required-and-recommended-modules)
- [MediaType Banner](#mediatype-banner)
- [MediaType Video](#mediatype-video)
  - [Instream video](#instream-video)
  - [Outstream video](#outstream-video)
- [MediaType Native](#mediatype-native)

<a name="important-notice"></a>

### Important Notice

The Mediakeys Bidding adapter requires setup before beginning and will respond with bids for whitelisted domains only.

Please contact us at prebidjs@mediakeys.com.

<a name="bid-params"></a>

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope               | Description                  | Example   | Type      |
|-------------|---------------------|------------------------------|-----------|-----------|
| `context`   | required for native | Native context               | `1`       | `integer` |
| `plcmttype` | required for native | Native placement type        | `2`       | `integer` |

<a name="first-party-data"></a>

#### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

Global site or user data using `setConfig()`, or Bidder-specific using `setBidderConfig()` supports following fields:

- `ortb2.site.*`: Standard IAB OpenRTB 2.5 site fields
- `ortb2.site.content.data[]`: Standard IAB segment taxonomy site data
- `ortb2.site.ext.data.*`: Non standard arbitrary site data
- `ortb2.user.*`: Standard IAB OpenRTB 2.5 user fields
- `ortb2.user.data[]`: Standard IAB segment taxonomy user data
- `ortb2.user.ext.data.*`: Non standard arbitrary user data

Please note that field `ortb2.app.*`, in a webview context, is **not supported**.

AdUnit-specific data using `AdUnit.ortb2Imp` supports following fields:

- `ortb2.imp[].ext.data.*`

Example first party data that's available to all bidders and all adunits:

```javascript
pbjs.setConfig({
  ortb2: {
      site: {
          // standard IAB OpenRTB 2.5 site fields are passed in `ortb2.site.*`
          name: "example",
          cat: ["IAB2"],
          domain: "page.example.com",

          // standard IAB segment taxonomy site data is passed in `ortb2.site.content.data[]`
          content: {
              userrating: "4",
              data: [{ name: "www.sitedataprovider1.com" }]
          },

          // any non standard arbitrary site data is passed in `ortb2.site.ext.data.*`
          ext: { data: { arbitrarySiteKey: "arbitrary" } }
      },
      user: {
          // standard IAB OpenRTB 2.5 user fields are passed in `ortb2.user.*`
          keywords: "a,b",
          geo: { country: "FRA", lat: 48.9, lon: 2.2 },

          // standard IAB segment taxonomy user data are passed in `ortb2.user.data[]`
          data: [{ name: "www.userdataprovider1.com" }],

          // any non standard arbitrary user data is passed in `ortb2.user.ext.data.*`
          ext: { data: { arbitraryUserKey: "arbitrary" } }
      }
  }
});
```

Example of first party data available only to the Mediakeys bidder and applies across all ad units:

```javascript
pbjs.setBidderConfig({
    bidders: ['mediakeys'],
    config: {
        ortb2: {
            site: {
                ext: {
                    data: {
                        pageType: "article",
                        category: "tools"
                    }
                }
            },
            user: {
                ext: {
                    data: {
                        registered: true,
                        interests: ["cars"]
                    }
                }
            }
        }
    }
});
```

Example of an adunit-specific with first party data:

```javascript
var adUnit = {
    // applies to all bidders
    ortb2Imp: {
        instl:1
    },
    bids: [{
      bidder: 'mediakeys',
      params: {},
      // applies to mediakeys bidder only
      ortb2Imp: {
          ext: {
              data: {
                  pbadslot: "homepage-top-rect",
                  adUnitSpecificAttribute: "123"
              }
          }
      }
    }]
};
```

<a name="required-and-recommended-modules"></a>

#### Required and Recommended Modules

Mediakeys fully supports the following [Prebid.js Modules](https://docs.prebid.org/dev-docs/modules/):

{: .table .table-bordered .table-striped }
| Module                                                                                                | Scope                       |
|-------------------------------------------------------------------------------------------------------|-----------------------------|
| [Consent Management - GDPR](https://docs.prebid.org/dev-docs/modules/consentManagement.html)          | Required in Europe          |
| [Consent Management - US Privacy](https://docs.prebid.org/dev-docs/modules/consentManagementUsp.html) | Required in US - California |
| [Supply Chain Object](https://docs.prebid.org/dev-docs/modules/schain.html)                           | Required for all traffic    |
| [Instream Tracking](https://docs.prebid.org/dev-docs/modules/instreamTracking.html)                   | Required for Instream Video |
| [First Party Data Enrichment](https://docs.prebid.org/dev-docs/modules/enrichmentFpdModule.html)      | Recommended for all traffic |

Publishers must utilize the required modules in described scope to be able to receive bid responses.

Before using [Supply Chain Object](https://docs.prebid.org/dev-docs/modules/schain.html) Module, please confirm with the Mediakeys team
the proper `asi` and `sid` field values that you should pass.

<a name="mediatype-banner"></a>

### MediaType Banner

The Mediakeys adapter accepts any valid [OpenRTB Spec 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) property.

Example Ad Unit:

```javascript
const adUnits = [{
  code: 'banner-1',
  mediaTypes: {
    banner: {
      sizes: [[300, 250],[300, 600]],
    }
  },
  bids: [{
    bidder: 'mediakeys',
    params: {} // no params required.
  }]
}];
```

<a name="mediatype-video"></a>

### MediaType Video

The Mediakeys adapter accepts any valid [OpenRTB Spec 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) video property.

Properties can be defined at the adUnit `mediaTypes.video` or `bid[].params` level.

Please refer to the following table to find acceptable values for mediakeys bidder:

{: .table .table-bordered .table-striped }
| Name           | Scope       | Description                                                     | Example    | Type   |
|----------------|-------------|-----------------------------------------------------------------|------------|--------|
| context        | required    | instream or outstream                                           |"outstream" | string |
| playerSize (*) | required    | width, height of the player in pixels | [640,360]<br />translated to w and h in bid request | array&lt;integers&gt; |
| mimes          | recommended | Content MIME types supported | ["video/x-ms-wmv", "video/mp4"]<br />default: ["video/mp4"]| array&lt;string&gt;|
| protocols      | recommended | Array of supported video protocols: <br />2: VAST 2.0 <br />3: VAST 3.0 | [2,3]<br />default: [3] | array&lt;integers&gt;|
| maxduration    | recommended | Maximum video ad duration in seconds. | 30<br />default: not set | integer |
| skip           | recommended | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes. | 1<br />default: 0 | integer |

(*) Mediakeys bidder will adapt the bid response to send the video format closest to the `playerSize` (from an aspect ratio point of view). To maximize the responses, please consider requesting formats like:

- small video: `360x268` (minimal bandwidth, low quality)
- medium video: `640x360` (low bandwidth, medium quality)
- standard video: `640×480` (medium bandwidth, good quality)
- full wide video: `854×480` (high bandwidth, superior quality)
- HD video: `1280x720` (maximum bandwidth, best quality)

<a name="instream-video"></a>

#### Instream video

For [Instream Video](https://docs.prebid.org/prebid-video/video-getting-started.html#instream), you have to enable the [Instream Tracking Module](https://docs.prebid.org/dev-docs/modules/instreamTracking.html) to have Prebid emit the `onBidWon` required event.

Required Prebid configuration:

a. Enable the instream tracking module and whitelist mediakeys Vast server url.

```javascript
pbjs.que.push(function () {
    pbjs.setConfig({
        instreamTracking: {
            // enable the `bidWon` event required by mediakeys
            enabled: true,
            // enable mediakeys vast server to have Prebid emit the `bidWon` event
            urlPattern: /mediakeys\.io/
        }
    });
});
```

b. Do not mark the bid as "used" as it could prevent emitting the `bidWon` event.

```javascript
pbjs.que.push(function () {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        timeout: 1000,
        bidsBackHandler: function (bids) {
            const highestCpmBids = pbjs.getHighestCpmBids('video1');

            if (highestCpmBids.length > 0) {
                // !! DO NOT use this !!
                // pbjs.markWinningBidAsUsed({
                //     adUnitCode: adUnits[0].code
                // });
                invokeVideoPlayer(highestCpmBids[0].vastUrl);
            }
        }
    });
});
```

Example Ad Unit:

```javascript
const adUnits = [{
  code: 'video1',
  mediaTypes: {
    video: {
      context: 'instream',
      playerSize: [854, 480],
      // additional OpenRTB video params
      // placement: 2,
      // ...
      mimes: ['video/mp4'],
      protocols: [2, 3],
      skip: 1
    }
  },
  bids: [{
    bidder: 'mediakeys',
    params: {
      video: {
        // additional OpenRTB video params
        // will be merged with params defined at mediaTypes level
        api: [1]
      }
    }
  }]
}];
```

<a name="outstream-video"></a>

#### Outstream video

Required Prebid configuration:

You must set up your preferred outstream renderer in the ad unit and use the following example code to fetch the 
`vast xml` document from mediakeys ad-server.

Example Ad Unit:

```javascript
const adUnits = [{
  code: 'video1',
  mediaTypes: {
    video: {
      context: 'outstream',
      playerSize: [1280, 720],
      // additional OpenRTB video params
      // placement: 2,
      // ...
      mimes: ['video/mp4'],
      protocols: [2, 3],
      skip: 0
    }
  },
  // this renderer is required for outstream video mediatype
  renderer: {
    url: 'https://acdn.adnxs.com/video/outstream/ANOutstreamVideo.js',
    // the render method must fetch the vast xml document before displaying video
    render: function (bid) {
      var adResponse = fetch(bid.vastUrl).then(resp => resp.text()).then(text => ({
        ad: {
          video: {
            content: text,
            player_height: bid.playerHeight,
            player_width: bid.playerWidth
          }
        }
      }))

      adResponse.then((content) => {
        bid.renderer.push(() => {
          ANOutstreamVideo.renderAd({
            targetId: bid.adUnitCode,
            adResponse: content
          });
        });
      })
    }
  },
  bids: [{
    bidder: 'mediakeys',
    params: {
      placementId: 13232385,
      video: {
        // additional OpenRTB video params
        // will be merged with params defined at mediaTypes level
        api: [1]
      }
    }
  }]
}];
```

<a name="mediatype-native"></a>

### MediaType Native

The Mediakeys adapter accepts any valid [OpenRTB Native Ads Specification](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf) native property.

Please refer to [Prebid native ad unit documentation](https://docs.prebid.org/prebid/native-implementation.html#3-prebidjs-native-adunit-overview), and the following table to see required and recommended parameters.

{: .table .table-bordered .table-striped }
| Name           | Scope              | Description                                              | Example | Type      |
|----------------|--------------------|----------------------------------------------------------|---------|-----------|
| context        | required           | The context in which the ad appears                      | `1`     | integer   |
| plcmttype      | recommended        | The design/format/layout of the ad unit being offered    | `1`     | integer   |

Required Prebid configuration:

Refer to [Prebid documentation](https://docs.prebid.org/prebid/native-implementation.html#4-implementing-the-native-template)
to use your preferred method for native ad template rendering.

Example Ad Unit:

This example uses the [external javascript file rendering method](https://docs.prebid.org/prebid/native-implementation.html#43-implementing-the-custom-renderer-scenario).

```javascript
const adUnits = [{
  code: 'native-1',
  sizes: [360, 360],
  mediaTypes: {
    native: {
      rendererUrl: 'https://example.com/nativeRender.js',
      body: {
        required: true
      },
      title: {
        required: true,
        len: 120
      },
      sponsoredBy: {
        required: true
      },
      icon: {
        required: true,
        sizes: [180, 180]
      },
      image: {
        required: true,
        sizes: [300, 250]
      }
    }
  },
  bids: [{
    bidder: 'mediakeys',
    native: {
      context: 1,
      plcmttype: 1,
    }
  }]
}];
```
