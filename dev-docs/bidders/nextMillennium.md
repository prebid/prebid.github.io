---
layout: bidder
title: NextMillennium
description: NextMillennium bid adapter
gvl_id: dev-docs/bidders/nextMillennium.md
tcfeu_supported: true
usp_supported: true
coppa_supported: false
schain_supported: false
dchain_supported: false
safeframes_ok: false
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
| Name           | Scope | Description                              | Example   | Type    |
|----------------+-------+-----------------------------------+-----------+---------|
| `placement_id` | required | Placement ID, provided by nextMillennium | `'12345'` | String  |
| `group_id`     | optional | Group ID, provided by nextMillennium     | `'12345'` | String  |

Required one of the two parameters placement_id or group_id.

Further information for the auction on NextMillennium side is generated automatically.

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

#### OpenRTB 2.5 supported parameters

The adapter for Prebid.js supports the following options:
* `site.pagecat`
* `site.content.cat`
* `site.content.language`
* `device.sua'`
* `site.keywords'`
* `site.content.keywords'`
* `user.keywords'`

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
