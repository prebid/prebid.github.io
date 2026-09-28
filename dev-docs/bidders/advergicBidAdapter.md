---
layout: bidder
title: Advergic
description: Prebid Advergic Bidder Adapter
biddercode: advergic
tcfeu_supported: false
gvl_id: none
usp_supported: true
coppa_supported: true
gpp_sids: usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
media_types: banner
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
sidebarType: 1
userIds: criteo, id5Id, sharedId, pubProvidedId
---

## Note

The Advergic bidder requires an account ID before it can be used. Publishers should contact [hello@advergic.com](mailto:hello@advergic.com) to request an `accountId` and test setup.

## Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `accountId` | required | Advergic account identifier. Publishers should obtain this value from Advergic. | `'12345'` | `string` |
| `endpointId` | optional | Advergic endpoint or placement identifier. When supplied, it is used as the OpenRTB impression `tagid`; otherwise the ad unit code is used. | `'homepage_300x250'` | `string` |
| `publisherId` | optional | Publisher identifier supplied by Advergic. | `'pub-123'` | `string` |
| `custom` | optional | Publisher-defined custom data passed to Advergic in the impression extension. | `{ section: 'sports' }` | `object` |
| `position` | optional | Banner position value passed to Advergic. | `1` | `integer` |

## Test Parameters

The following example shows the required setup. Replace `YOUR_TEST_ACCOUNT_ID` with the test `accountId` provided by Advergic.

```javascript
var adUnits = [
  {
    code: 'test-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      }
    },
    bids: [
      {
        bidder: 'advergic',
        params: {
          accountId: 'YOUR_TEST_ACCOUNT_ID'
        }
      }
    ]
  }
];
```

## Banner

The Advergic adapter supports the `banner` media type. Banner sizes are read from `mediaTypes.banner.sizes` and sent to the Advergic endpoint as OpenRTB banner formats.

## First Party Data

The adapter supports Prebid First Party Data through `ortb2` and `ortb2Imp`.

Global site, user, device, regulations, and source data are preserved when available. Impression-level OpenRTB data from `ortb2Imp` is also preserved and sent with the corresponding impression.

Publishers should use the standard Prebid First Party Data configuration:

```javascript
pbjs.setConfig({
  ortb2: {
    site: {
      content: {
        data: [
          {
            name: 'section',
            segment: [
              { id: 'sports' }
            ]
          }
        ]
      }
    },
    user: {
      data: [
        {
          name: 'publisher_data',
          segment: [
            { id: '123' }
          ]
        }
      ]
    }
  }
});
```

## Floors

The adapter supports Prebid Floors. When a floor is available, the adapter sends `bidfloor` and `bidfloorcur` in the OpenRTB impression.

## User IDs

The adapter forwards Prebid user IDs supplied through `userIdAsEids` in the OpenRTB `user.ext.eids` object.

The adapter also maintains an Advergic user ID in browser local storage when storage access is available.

## Event Tracking

The adapter can send additional event notifications to Advergic for win, timeout, and bidder-error analytics.

Publishers can disable these additional event-tracking requests without disabling the auction:

```javascript
pbjs.setConfig({
  advergic: {
    disableEventTracking: true
  }
});
```

The normal bid request and bid response processing continue when event tracking is disabled.

## User Sync

Advergic supports both image and iframe user synchronization when the publisher enables the corresponding Prebid user-sync type.

If the bidder response does not provide sync URLs, the adapter uses the Advergic default sync endpoint.

Example:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['advergic'],
        filter: 'include'
      }
    }
  }
});
```

## Privacy

The adapter passes supported privacy signals to the Advergic endpoint:

* GDPR consent
* US Privacy / CCPA consent
* GPP consent
* COPPA

The adapter forwards the supplied GPP string and applicable section IDs.

The adapter does not currently declare an IAB Global Vendor List ID. `tcfeu_supported` is therefore not enabled in this documentation.

## Supply Chain

The adapter supports the Prebid Supply Chain Object (`schain`) and forwards it in the OpenRTB `source.ext.schain` field.
