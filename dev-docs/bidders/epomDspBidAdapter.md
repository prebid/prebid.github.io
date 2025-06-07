---

layout: bidder
title: Epom DSP
description: Prebid Epom DSP Bid Adapter
biddercode: epom\_dsp
tcfeu\_supported: true
gvl\_id: none
usp\_supported: true
coppa\_supported: false
gpp\_sids: tcfeu, usnat
schain\_supported: true
dchain\_supported: false
userId: none
media\_types: banner
safeframes\_ok: true
deals\_supported: true
floors\_supported: true
fpd\_supported: false
pbjs: true
pbs: false
prebid\_member: false
multiformat\_supported: will-bid-on-one
ortb\_blocking\_supported: false
privacy\_sandbox: no
sidebarType: 1
--------------

## Overview

The **Epom DSP Bid Adapter** enables publishers to monetize inventory via the Epom DSP Exchange using the OpenRTB protocol. It supports **banner media types** and enforces required fields to ensure bid validity and proper auction participation.

---

## Bid Parameters

| Name          | Scope    | Description                                                     | Example                                                            | Type     |
| ------------- | -------- | --------------------------------------------------------------- | ------------------------------------------------------------------ | -------- |
| `endpoint`    | required | Full URL to the Epom DSP bidding endpoint                       | `'https://bidder.epommarket.com/bidder/v2_5/bid?key=your_api_key'` | `string` |
| `placementId` | optional | Placement identifier provided by Epom                           | `'12345'`                                                          | `string` |
| `bidfloor`    | optional | Minimum CPM for bid, in USD (unless FX enabled on tenant level) | `0.50`                                                             | `number` |

---

## Example Ad Unit Configuration

```javascript
var adUnits = [{
  code: 'epom-banner-div',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'epom_dsp',
    params: {
      endpoint: 'https://bidder.epommarket.com/bidder/v2_5/bid?key=d0b9fb9de9dfbba694dfe75294d8e45a'
    },
    imp: [{
      id: '2',
      banner: {
        w: 300,
        h: 250,
        btype: [4],
        pos: 0,
        api: [3]
      },
      bidfloor: 0.01,
      bidfloorcur: 'USD'
    }],
    site: {
      id: 'fc59bd54-36df-4d33-830c-fdsfds',
      domain: 'epom.com',
      publisher: {
        id: 'testid'
      },
      content: {
        id: '1234567',
        title: 'Car Show',
        series: 'All About Cars',
        season: '2',
        cat: ['IAB2-2']
      }
    },
    device: {
      ua: navigator.userAgent,
      ip: '176.112.120.50',
      devicetype: 2,
      os: 'windows',
      js: 1,
      language: 'US',
      carrier: 'VERIZON',
      connectiontype: 5
    },
    user: {
      id: 'testiduser'
    },
    id: 'NewIdTest',
    cur: ['USD'],
    bcat: ['IAB25-2', 'IAB25-1'],
    badv: []
  }]
}];
```

---

## Required Fields for Bid Request Validation

To be considered **valid**, a bid request must include the following:

| Field         | Location      | Description                                                           |
| ------------- | ------------- | --------------------------------------------------------------------- |
| `request.id`  | root          | Unique ID for the request                                             |
| `imp[]`       | root          | Must contain at least one impression object                           |
| `imp[i].id`   | imp object    | Unique impression ID                                                  |
| `site.domain` | site object   | Must be present (or `app.bundle` if app-based)                        |
| `device.ip`   | device object | Device IP address (required unless IP forwarding feature is disabled) |
| `cur[]`       | root          | Must be `['USD']` unless currency FX is enabled on tenant level       |

If any of the above is missing or malformed, the bid request will be **rejected** by the adapter during validation (`isBidRequestValid`).

---

## Privacy Compliance

The Epom DSP adapter supports the following privacy frameworks:

* **GDPR**: via `bidderRequest.gdprConsent.consentString`
* **US Privacy (CCPA)**: via `bidderRequest.uspConsent`
* **GPP**: Supports `tcfeu` and `usnat` sections

---

## Testing & Debugging

To test integration, use a configuration similar to this inside a local HTML page with Prebid.js:

```html
<script src="https://cdn.jsdelivr.net/npm/prebid.js@9.41.0/dist/not-for-prod/prebid.min.js"></script>
<script>
  pbjs.que.push(function() {
    pbjs.setConfig({ debug: true });

    pbjs.setBidderConfig({
      bidders: ['epom_dsp'],
      config: {
        epomSettings: {
          endpoint: 'https://bidder.epommarket.com/bidder/v2_5/bid?key=your_key'
        }
      }
    });

    pbjs.addAdUnits([/* ...adUnits as above... */]);
    pbjs.requestBids({
      bidsBackHandler: function(bidResponses) {
        console.log('Epom DSP Responses:', bidResponses);
      }
    });
  });
</script>
```

---

## Support

For questions or assistance integrating Epom DSP into your Prebid setup, please contact:
📩 [support@epom.com](mailto:support@epom.com)
