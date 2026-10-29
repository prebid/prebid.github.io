---
layout: bidder
title: Bidsmind
description: Prebid Bidsmind Bidder Adapter
aliasCode: adverxo
pbjs: true
pbs: true
pbs_app_supported: true
biddercode: bidsmind
userIds:
media_types: banner, native, video
schain_supported: true
dchain_supported: false
ortb_blocking_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
userId: no
safeframes_ok: false
deals_supported: true
fpd_supported: true
prebid_member: false
privacy_sandbox: no
sidebarType: 1
---

### Note

The Bidsmind Bidding adapter requires setup and approval before beginning. Please reach out to <prebid@bidsmind.com> for
more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|----------|----------|-----------------------|---------------------------|----------|
| `adUnitId`   | required | Unique identifier for the ad unit in Bidsmind platform. | `1` | `integer` |
| `auth`       | required | Authentication token provided by Bidsmind platform for the AdUnit. | `'61336e75e414c77c367eq5c47c2599ce80a8032b'` | `string` |

### Setting First Party Data (FPD)

Publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:

- ortb2.site.\*
- ortb2.app.\*
- ortb2.user.\*

Example first party data:

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
        }
    }
});
```

### ORTB Blocking

Bidsmind supports the next blocking parameters:

- Blocked advertisers list (`badv`) is an array of domains as strings.
- Blocked apps list (`bapp`) is an array of apps names as strings, for mobile apps in Google Play Store, these should be
  bundle or package names (e.g. com.foo.mygame). For apps in Apple App Store, these should be a numeric ID.
- Blocked categories list (`bcat`) is an array of IAB categories as strings.
- Blocked attributes list (`battr`) is an array of integers. Refer to section 5.3 of the IAB specification for a list of
  attributes.

#### Globally defined ORTB Blocking

```javascript
pbjs.setConfig({
    ortb2: {
        badv: ["domain1.com", "domain2.com"],
        bapp: ["com.foo.mygame", "284708449"],
        bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
    }
});
```

#### ORTB Blocking specific only to the Bidsmind bidder

```javascript
pbjs.setBidderConfig({
    bidders: ['bidsmind'], // Or alias
    config: {
        ortb2: {
            badv: ["domain1.com", "domain2.com"],
            bapp: ["com.foo.mygame"],
            bcat: ["IAB23-1", "IAB23-5", "IAB25-3", "IAB25-2"]
        }
    }
});
```

#### Media Type defined ORTB Blocking

Additionally `battr` ORTB blocking param may be set on media types to specify blocked creative
attributes. Refer to section 5.3 of the IAB specification for a list of attributes.
