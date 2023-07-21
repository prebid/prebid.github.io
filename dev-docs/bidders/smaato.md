---
layout: bidder
title: Smaato
description: Prebid Smaato Bidder Adaptor
biddercode: smaato
gdpr_supported: true
gvl_id: 82
usp_supported: true
coppa_supported: true
gpp_supported: true
media_types: banner, video, native
userIds: all
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: true
floors_supported: true
fpd_supported: true
schain_supported: true
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Registration](#registration)
- [Note](#note)
- [Bid Params](#bid-params)
  - [App Object](#app-object)
- [Example Ad Units](#example-ad-units)
  - [Example Banner Ad Unit](#example-banner-ad-unit)
  - [Example Video Ad Unit](#example-video-ad-unit)
  - [Example Native Ad Unit](#example-native-ad-unit)
  - [Example AdPod (long-form) Video Ad Unit](#example-adpod-long-form-video-ad-unit)
- [First Party Data](#first-party-data)
- [Test Parameters](#test-parameters)

<a name="smaato-registration"></a>

### Registration

The Smaato adapter requires setup and approval from the Smaato team, even for existing Smaato publishers. Please reach out to your account team or <prebid@smaato.com> for more information.

<a name="smaato-note"></a>

### Note

The Smaato adapter will convert bidfloors to 'USD' currency as needed.

<a name="smaato-bid-params"></a>

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description          | Example    | Type     |
|------------|----------|----------------------|------------|----------|
| `publisherId` | required | Your Smaato publisher id  | `'1100012345'` | `string` |
| `adspaceId` | required | Your Smaato adspace id. Required for non adpod requests | `'11002234'`   | `string` |
| `adbreakId` | required | Your Smaato adbreak id. Required for adpod (long-form video) requests | `'41002234'`   | `string` |
| `app` | optional | Object containing mobile app parameters.  See the [App Object](#smaato-app-object) for details.| `app : { ifa: '56700000-9cf0-22bd-b23e-46b96e40003a'}` | `object` |

##### Note

In case of AdPods, the Smaato adapter will only read the first `imp[].skadn` entry for each AdPod, such that there should only be one `skadn` occurrence per AdPod.

<a name="smaato-app-object"></a>

#### App Object

Smaato supports using prebid within a mobile app's webview.

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                     | Example                                                                  | Type             |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|------------------|
| `ifa`             | String that contains the advertising identifier of the user (e.g. idfa or aaid).                                                | `'56700000-9cf0-22bd-b23e-46b96e40003a'`                                 | `string`         |
| `geo`             | Object that contains the latitude (`lat`) and longitude (`lon`) of the user.                                                    | `{ lat: 33.3, lon: -88.8 }`                                              | `object`         |

<a name="smaato-example-ad-units"></a>

### Example Ad Units

#### Example Banner Ad Unit

```javascript
var adUnit = {
    "code": "banner unit",
    "mediaTypes": {
        "banner": {
            "sizes": [320, 50]
        }
    },
    "bids": [{
        "bidder": "smaato",
        "params": {
            "publisherId": "1100012345",
            "adspaceId": "11002234"
        }
    }]
}
```

#### Example Video Ad Unit

```javascript
var adUnit = {
    "code": "video unit",
    "mediaTypes": {
        "video": {
            "context": "instream",
            "playerSize": [640, 480],
            "mimes": ["video/mp4"],
            "minduration": 5,
            "maxduration": 30,
            "startdelay": 0,
            "linearity": 1,
            "protocols": [7],
            "skip": 1,
            "skipmin": 5,
            "api": [7],
            "ext": {"rewarded": 0}
        }
    },
    "bids": [{
        "bidder": "smaato",
        "params": {
            "publisherId": "1100012345",
            "adspaceId": "11002234"
        }
    }]
};
```

#### Example Native Ad Unit

```javascript
var adUnit = {
    "code": "native unit",
    "mediaTypes": {
        native: {
            sendTargetingKeys: false,
            image: {
                required: true,
                sizes: [150, 50]
            },
            icon: {
                required: true,
                sizes: [50, 50]
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
            },
            cta: {
                required: false
            },
            rating: {
                required: false
            }
        }
    },
    "bids": [{
        "bidder": "smaato",
        "params": {
            "publisherId": "1100012345",
            "adspaceId": "11002234"
        }
    }]
};
```

#### Example AdPod (long-form) Video Ad Unit

```javascript
var adUnit = {
    "code": "adpod unit",
    "mediaTypes": {
        "video": {
            "context": "adpod",
            "playerSize": [640, 480],
            "adPodDurationSec": 300,
            "durationRangeSec": [15, 30],
            "requireExactDuration": false,
            "mimes": ["video/mp4"],
            "startdelay": 0,
            "linearity": 1,
            "protocols": [7],
            "skip": 1,
            "skipmin": 5,
            "api": [7],
        }
    },
    "bids": [{
        "bidder": "smaato",
        "params": {
            "publisherId": "1100042525",
            "adbreakId": "400000000"
        }
    }]
};
```

<a name="smaato-first-party"></a>

### First Party Data

Publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:

- ortb2.site.keywords
- ortb2.site.content
- ortb2.user.keywords
- ortb2.user.yob
- ortb2.user.gender
- ortb2.user.ext.eids
- ortb2.device.geo
- ortb2.device.ifa

The IAB standard taxonomies are not supported.

Example first party data that's available to all bidders and all adunits:

```javascript
pbjs.setConfig({
    ortb2: {
        site: {
            keywords: "kw1,kw2", 
            content: {
                title: "title1",
                series: "series1"
                }
            }, 
        user: {
            keywords: "a,b", 
            gender: "M", 
            yob: 1984
        },
        device: {
            ifa: "identifier",
            geo: {
                lat: 53.5488,
                lon: 9.9872
            }
        }
    }
});
```

<a name="smaato-test-parameters"></a>

### Test Parameters

Following example includes sample `imp` object with publisherId and adSlot which can be used to test Smaato Adapter

```json
"imp":[
      {
         "id":"1C86242D-9535-47D6-9576-7B1FE87F282C",
         "banner":{
            "format":[
               {
                  "w":300,
                  "h":50
               },
               {
                  "w":300,
                  "h":250
               }
            ]
         },
         "ext":{
            "smaato":{
               "publisherId":"100042525",
               "adspaceId":"130563103"
            }
         }
      }
   ]
```
