---
layout: bidder
title: Smaato
description: Prebid Smaato Bidder Adaptor
hide: true
biddercode: smaato
gdpr_supported: true
usp_supported: true
coppa_supported: true
media_types: banner
---

### Note

The Smaato adapter requires setup and approval from the Smaato team, even for existing Smaato publishers. Please reach out to your account team or prebid@smaato.com for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description          | Example    | Type     |
|------------|----------|----------------------|------------|----------|
| `publisherId` | required | Your Smaato publisher id  | `'1100012345'` | `string` |
| `adspaceId` | required | Your Smaato adspace id | `'11002234'`   | `string` |
| `yob` | optional | Users year of birth | `1950`   | `integer` |
| `gender` | optional | Users gender (f,m,o) | `'f'`   | `string` |
| `lat` | optional | Users latitude | `53.575`   | `float` |
| `lon` | optional | Users longitude | `10.015`   | `float` |
| `keywords` | optional | Site keywords | `'keyword1,keyword2,keyword3'`   | `string` |

### Example Ad Unit

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
            "adspaceId": "11002234",
            "yob": 1950,
            "gender": "f",
            "lat": 53.575,
            "lon": 10.015,
            "keywords": "keyword1,keyword2,keyword3"
        }
    }]
}
```