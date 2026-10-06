---
layout: bidder
title: HypeLab
description: Prebid HypeLab Bidder Adapter
pbjs: true
pbs: true
biddercode: hypelab
sidebarType: 1
media_types: banner, video, native
userIds: all
safeframes_ok: false
floors_supported: false
fpd_supported: false
gvl_id: none
pbs_app_supported: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
---

## Registration

The HypeLab adapter requires setup and approval from the HypeLab team. Please reach out to your account manager for more information.

## Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --------------- | ---------- | ------------------ | --------- | ---------- |
| `property_slug` | required | The property slug | `prebid` | `string` |
| `placement_slug` | required | The placement slug | `test_placement` | `string` |

## Example Banner Configuration

```js
var adUnits = [
  {
    code: "banner-div",
    mediaTypes: {
      banner: {
        sizes: [[728, 90]],
      },
    },
    bids: [
      {
        bidder: "hypelab",
        params: {
          property_slug: "prebid",
          placement_slug: "test_placement",
        },
      },
    ],
  },
];
```

## Prebid Server Params

The Prebid Server adapter uses the same bidder parameters as the Prebid.js adapter.
HypeLab's Prebid Server adapter supports banner, video, and native media types.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --------------- | ---------- | ------------------ | --------- | ---------- |
| `property_slug` | required | The HypeLab property slug | `prebid` | `string` |
| `placement_slug` | required | The HypeLab placement slug | `test_placement` | `string` |

## Prebid Server Test Request

The following request can be sent to Prebid Server's `/openrtb2/auction` endpoint
to verify that the HypeLab adapter is configured correctly for banner inventory.

```json
{
  "id": "hypelab-test-request",
  "test": 1,
  "imp": [
    {
      "id": "hypelab-banner-imp",
      "banner": {
        "format": [
          {
            "w": 300,
            "h": 250
          }
        ]
      },
      "ext": {
        "prebid": {
          "bidder": {
            "hypelab": {
              "property_slug": "prebid",
              "placement_slug": "test_placement"
            }
          }
        }
      }
    }
  ],
  "site": {
    "page": "https://publisher.example"
  },
  "device": {
    "ua": "Mozilla/5.0"
  }
}
```
