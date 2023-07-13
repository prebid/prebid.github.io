---
layout: bidder
title: PubNative
pbs: true
media_types: banner, video, native
biddercode: pubnative
gdpr_supported: false
prebid_member: true
schain_supported: true
coppa_supported: true
usp_supported: true
sidebarType: 1
---

### Registration

Before adding PubNative as a new bidder, there are 3 prerequisites:

- As a Publisher, you need to have Prebid Mobile SDK integrated.
- You need a configured Prebid Server (either self-hosted or hosted by 3rd party).
- You need to be integrated with Ad Server SDK or internal product which communicates with Prebid Mobile SDK.

Please see [documentation](https://developers.pubnative.net/docs/prebid-adding-pubnative-as-a-bidder) for more info.

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| zone_id | required | The ad zone identifier | 1 | integer |
| app_auth_token | required | The app's authentication token | 'aaaabbbbcccc' | string |

### Test Parameters

Please consult with our Account Manager for testing.
We need to confirm that your ad request is correctly received by our system.

The following test parameters can be used to verify that Prebid Server is working properly with the
Pubnative adapter.

The following json can be used to do a request to prebid server for verifying its integration with Pubnative adapter.

```json
{
    "id": "some-impression-id",
    "site": {
      "page": "https://good.site/url"
    },
    "imp": [
      {
        "id": "test-imp-id",
        "banner": {
          "format": [
            {
              "w": 300,
              "h": 250
            }
          ]
        },
        "ext": {
          "pubnative": {
            "zone_id": 1,
            "app_auth_token": "b620e282f3c74787beedda34336a4821"
          }
        }
      }
    ],
    "device": {
      "os": "android",
      "h": 700,
      "w": 375
    },
    "tmax": 500,
    "test": 1
}
```
