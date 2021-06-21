---
layout: bidder
title: Smaato
description: Prebid Smaato Bidder Adaptor
biddercode: smaato
gdpr_supported: true
usp_supported: true
coppa_supported: true
media_types: banner, video
userIds: criteo, pubCommonId, unifiedId
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: true
---

### Table of Contents

- [Bid Params](#smaato-bid-params)
- [App Object](#smaato-app-object)
- [First Party Data](#smaato-first-party)

### Registration

The Smaato adapter requires setup and approval from the Smaato team, even for existing Smaato publishers. Please reach out to your account team or prebid@smaato.com for more information.

<a name="smaato-bid-params" />

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description          | Example    | Type     |
|------------|----------|----------------------|------------|----------|
| `publisherId` | required | Your Smaato publisher id  | `'1100012345'` | `string` |
| `adspaceId` | required | Your Smaato adspace id | `'11002234'`   | `string` |
| `app` | optional | Object containing mobile app parameters.  See the [App Object](#smaato-app-object) for details.| `app : { ifa: '56700000-9cf0-22bd-b23e-46b96e40003a'}` | `object` |

<a name="smaato-app-object" />

#### App Object

Smaato supports using prebid within a mobile app's webview.

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                     | Example                                                                  | Type             |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|------------------|
| `ifa`             | String that contains the advertising identifier of the user (e.g. idfa or aaid).                                                | `'56700000-9cf0-22bd-b23e-46b96e40003a'`                                 | `string`         |
| `geo`             | Object that contains the latitude (`lat`) and longitude (`lon`) of the user.                                                    | `{ lat: 33.3, lon: -88.8 }`                                              | `object`         |


### Example Banner Ad Unit

```javascript
var adUnit = {
    "code": "header-bid-tag-1",
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

### Example Video Ad Unit

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
<a name="smaato-first-party" />

### First Party Data

The Smaato adapter supports passing through first party data configured in your prebid integration.

```javascript
pbjs.setConfig({
    fpd: {
        context: {
            keywords: "power tools"
        },
        user: {
            keywords: "a,b",
            gender: "M",
            yob: 1984
        }
});
```

### Test Parameters

Following example includes sample `imp` object with publisherId and adSlot which can be used to test Smaato Adapter

```
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
