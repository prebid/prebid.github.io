---
layout: bidder
title: Sharethrough
biddercode: sharethrough
description: Prebid Sharethrough Adaptor
gdpr_supported: true
coppa_supported: true
floors_supported: true
media_types: banner, video, native
safeframes_ok: true
schain_supported: true
gvl_id: 80
userIds: all
usp_supported: true
pbjs: true
pbs: true
fpd_supported: true
ortb_blocking_supported: partial
sidebarType: 1
---

### Disclosure:

This adapter is known to use an HTTP 1 endpoint. Header bidding often generates multiple requests to the same host and bidders are encouraged to change to HTTP 2 or above to help improve publisher page performance via multiplexing.

### Note:
The Sharethrough bidder adapter requires additional setup and approval from the Sharethrough Integrations team. Please reach out to your account manager for more information to start using it.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                | Example                      | Type                 |
|-------------|----------|------------------------------------------------------------|------------------------------|----------------------|
| `pkey`      | required | The placement key                                          | `'DfFKxpkRGPMS7A9f71CquBgZ'` | `string`             |
| `bcat`      | optional | (deprecated) Array of blocked IAB Categories               | `['IAB1-2', 'IAB1-3']`       | `string[]`           |
| `badv`      | optional | (deprecated) Array of blocked Advertisers by their domains | `['ford.com', 'pepsi.com']`  | `string[]`           |

Note: Providing `bcat` and `badv` via Bid Params is deprecated, the First Party Data method should be preferred (see below). 
When both methods are provided, first party data values will be used and bid param values will be ignored.

#### First Party Data
Publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:
- `ortb2.site.*`
- `ortb2.user.*`

For example:
```js
pbjs.setConfig({
  ortb2: {
    site: {
      name: "example",
      cat: ["IAB2"],
      keywords: "power tools, drills",
      content: {
        userrating: "4"
      }
    },
    user: {
      yob: 1985,
      gender: "m",
      keywords: "a,b",
      ext: {
        data: {
          registered: true,
          interests: ["cars"]
        }
      }
    }
  }
});
```

#### ORTB Blocking
Sharethrough supports blocking advertiser domains (`badv`) and/or IAB Categories (`bcat`) via First Party Data.

For example:
```js
pbjs.setConfig({
  ortb2: {
    bcat: ["IAB1", "IAB2-1"],
    badv: ["domain1.com", "domain2.com"],
  }
});
```
