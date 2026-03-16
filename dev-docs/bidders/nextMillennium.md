---
layout: bidder
title: NextMillennium
description: NextMillennium bid adapter
gvl_id: dev-docs/bidders/nextMillennium.md
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
safeframes_ok: true
deals_supported: false
floors_supported: false
fpd_supported: false
pbs_app_supported: false
pbjs: true
pbs: true
biddercode: nextMillennium
media_types: banner, video
prebid_member: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                              | Example         | Type            |
|----------------+----------+------------------------------------------+-----------------+-----------------|
| `placement_id` | optional | Placement ID, provided by nextMillennium | `'12345'`       | String          |
| `group_id`     | optional | Group ID, provided by nextMillennium     | `'12345'`       | String          |
| `adSlots`      | optional | `adSlots` is a specific location or container on a webpage where an advertisement is displayed. | `["stickytop"]` | Array of String |
| `allowedAds`   | optional | `allowedAds` is a list of ad types or formats that are permitted to be shown in a specific ad slot. | `["skin"]`      | Array of String |

Required one of the two parameters placement_id or group_id.

Further information for the auction on NextMillennium side is generated automatically.

For video ad requests, we recommend that you configure the `mediaTypes.video` parameters in your Ad Units ([https://docs.prebid.org/dev-docs/adunit-reference.html#video](https://docs.prebid.org/dev-docs/adunit-reference.html#video)).

### Additional options

#### disabledSendingStatisticData

The `disabledSendingStatisticData` parameter disables sending statistics data to the nextMillennium server, such as bidRequested, bidResponse, noBid and bidTimeout events.
An example of enabling this option:  

```javascript
pbjs.setBidderConfig({
  bidders: ['nextMillennium'],
  config: {
    disabledSendingStatisticData: true,
  },
})
```

#### Currency

By default, the currency used for requires is `USD`. But you can use any other currency in the request. To do this, you must set this currency through the Prebid.js configuration and all responses will be returned in this currency.

```javascript
pbjs.setConfig({
    // ...
    "currency": {
       "adServerCurrency": "JPY",
    }
    // ...
});
```

#### OpenRTB 2.6 supported parameters

The adapter for Prebid.js supports the following options:

* `site.pagecat`
* `site.keywords`
* `site.name`
* `site.cattax`
* `site.cat`
* `site.sectioncat`
* `site.search`
* `site.mobile`
* `site.privacypolicy`
* `site.kwarray`
* `site.content.cat`
* `site.content.language`
* `site.content.keywords`
* `site.publisher.id`
* `site.publisher.name`
* `site.publisher.cattax`
* `site.publisher.cat`
* `site.publisher.domain`
* `device.sua`
* `device.ip`
* `device.ipv6`
* `device.dnt`
* `device.lmt`
* `device.devicetype`
* `device.make`
* `device.model`
* `device.os`
* `device.osv`
* `device.hwv`
* `device.geo.lat`
* `device.geo.lon`
* `device.geo.type`
* `device.geo.accuracy`
* `device.geo.lastfix`
* `device.geo.ipservice`
* `device.geo.country`
* `device.geo.region`
* `device.geo.regionfips104`
* `device.geo.metro`
* `device.geo.city`
* `device.geo.zip`
* `device.geo.utcoffset`
* `device.language`
* `device.langb`
* `user.keywords`
* `bcat`
* `badv`
* `wlang`
* `wlangb`
* `cattax`

You can set these parameters through the Prebid.js configuration setup functions: [pbjs.setConfig](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html) or [pbjs.setBidderConfig](https://docs.prebid.org/dev-docs/publisher-api-reference/setBidderConfig.html).
An example of setting openrtb parameters for the entire prebid.js script.

```javascript
pbjs.setConfig({
  ortb2: {
    site: {
      pagecat: ['IAB2-11', 'IAB2-12', 'IAB2-14'],
      content: {
        cat: ['IAB2-11', 'IAB2-12', 'IAB2-14'],
        language: 'EN'
      },
    }
  }
});
```

An example of setting openrtb parameters only for the NextMillennium adapter.

```javascript
pbjs.setBidderConfig({
  bidders: ['bidderB'],
  config: {
    ortb2: {
      site: {
        pagecat: ['IAB2-11', 'IAB2-12', 'IAB2-14'],
        content: {
          cat: ['IAB2-11', 'IAB2-12', 'IAB2-14'],
          language: 'EN'
        },
      }
    }
  }
});
```

#### Support for OpenRTB 2.6 parameters at the Ad Units level

* `displaymanager`
* `displaymanagerver`
* `instl`
* `banner.btype`
* `banner.battr`
* `banner.mimes`
* `banner.topframe`
* `banner.expdir`
* `banner.api`
* `banner.format`
* `video.rqddurs`
* `video.battr`
* `video.maxextended`
* `video.minbitrate`
* `video.maxbitrate`
* `video.boxingallowed`
* `video.api`
* `video.companiontype`

Example of setting OpenRTB parameters at the Ad Units level:

```javascript
pbjs.addAdUnits({
  code: 'Some-Ad-Unit',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
    },
  },

  ortb2Imp: {
    mimes: ['image/jpeg', 'image/png'],
  },

  bids: [
    {
      bidder: 'nextMillennium',
      params: {
        placement_id: 13234567,
      },
    },
  ],
});

```
