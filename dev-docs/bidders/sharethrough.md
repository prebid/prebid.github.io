---
layout: bidder
title: Sharethrough
biddercode: sharethrough
description: Prebid Sharethrough Adaptor
tcfeu_supported: true
coppa_supported: true
floors_supported: true
media_types: banner, video
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

### Before You Begin

The Sharethrough bidder adapter requires additional setup and approval from the Sharethrough Integrations team. Please reach out to your account manager for more information to start using it.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                | Example                      | Type                 |
|-------------|----------|------------------------------------------------------------|------------------------------|----------------------|
| `pkey`      | required | The placement key                                          | `'DfFKxpkRGPMS7A9f71CquBgZ'` | `string`             |
| `bcat`      | optional | (deprecated) Array of blocked IAB Categories               | `['IAB1-2', 'IAB1-3']`       | `string[]`           |
| `badv`      | optional | (deprecated) Array of blocked Advertisers by their domains | `['ford.com', 'pepsi.com']`  | `string[]`           |

**Note**: Providing `bcat` and `badv` via Bid Params is deprecated, the First Party Data method should be preferred (see below).
When both methods are provided (i.e. when `badv` and `bcat` are specified both as bid params and through the first party ortb2 method), first party data values will be used and bid param values will be ignored.

#### Configuration

Sample banner setup:

```
<script>
  var adUnits = [
    {
      code: "my-html-div-tag-id",
      ortb2Imp: {
        ext: {
            gpid: "/1111/homepage-leftnav",
        }
      },
      mediaTypes: {
        banner: {
          sizes: [[250,250],[300,300]]
        }
      },
      bids: [
        {
          bidder: "sharethrough",
          params: {
            pkey: "pkey1",
            // you can set badv and bcat here too, but it is not recommended
            // see the "ORTB Blocking" section for a preferred alternate setup for
            // badv and bcat
          }
        }
      ]
    }
  ]

  pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
  });
</script>
```

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

### Additional Notes

#### Request and Response Attributes

- TTL is 360 for display and native, 3600 for video (in milliseconds).
- Safeframes are supported.
- Advertiser domains are available in bid responses at `meta.advertiserDomains`
- Bids are returned in **net** - that is, the bids returned reflect the bid amount with revenue sharing already taken into account. No adjustment is necessary.
- Sharethrough is GDPR and COPPA compliant.

#### Supported Media Types

- Banner
- Native
- Video (instream and outstream)

#### Default Ad Server Key Value

- `sharethrough`

### Prebid Module Support

For publishers using PBJS version 5 and above, current module support includes:

- Price Floors
- Supply Chain Object
- User ID
