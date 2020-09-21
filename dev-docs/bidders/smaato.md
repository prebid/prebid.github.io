---
layout: bidder
title: Smaato
description: Prebid Smaato Bidder Adaptor
hide: true
biddercode: smaato
gdpr_supported: true
usp_supported: true
coppa_supported: true
media_types: banner, video
pbjs: true
pbs: true
---

### Registration

The Smaato adapter requires setup and approval from the Smaato team, even for existing Smaato publishers. Please reach out to your account team or prebid@smaato.com for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description          | Example    | Type     |
|------------|----------|----------------------|------------|----------|
| `publisherId` | required | Your Smaato publisher id  | `'1100012345'` | `string` |
| `adspaceId` | required | Your Smaato adspace id | `'11002234'`   | `string` |

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
         "id":“1C86242D-9535-47D6-9576-7B1FE87F282C,
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
