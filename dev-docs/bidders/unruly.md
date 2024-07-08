---
layout: bidder
title: Unruly
description: Prebid Unruly Bidder Adaptor
biddercode: unruly
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video
userIds: all
prebid_member: false
safeframes_ok: check with bidder
deals_supported: check with bidder
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
gvl_id: 36
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name               | Scope          | Description                                                                                                                  | Example                                          | Type      |
|--------------------|----------------|------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------|
| `siteId`           | required       | The site ID from Unruly(Nexxen). This will be provided to you by your Unruly account manager, this is prefered.              | `123456`                                         | `integer` |
| `siteid`           | deprecated     | The site ID from Unruly. This will be provided to you by your Unruly account manager, this is backward compability.          | `123456`                                         | `integer` |
| `featureOverrides` | optional       | This param is a generic object for configuring Unruly outstream demand. To run UNmissable, set ‘canRunUnmissable’ to true.   | `"featureOverrides": {"canRunUnmissable": true}` | `object`  |

### Protected Audience API (FLEDGE) support

There’s an option to receive demand for Protected Audience API (FLEDGE/PAAPI)
ads using Unruly's (Nexxen) bid adapter.
Prebid’s [fledgeForGpt](https://docs.prebid.org/dev-docs/modules/fledgeForGpt.html)
module and Google Ad Manager is currently required.

The following steps should be taken to setup Protected Audience for Unruly(Nexxen):

1. Reach out to your account manager to coordinate set up:

2. Build and enable FLEDGE module as described in
[fledgeForGpt](https://docs.prebid.org/dev-docs/modules/fledgeForGpt.html)
module documentation.

    Make sure to enable Unruly bidder to participate in FLEDGE. If there are any other bidders to be allowed for that, add them to the **bidders** array:

    ```javascript
    pbjs.setBidderConfig({
      bidders: ["unruly"],
      config: {
        fledgeEnabled: true
      }
    });
    ```

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The following fields are supported:

- `ortb2.site.*`

AdUnit-specific data is supported using `AdUnit.ortb2Imp.ext.*`

Example of first party data available only to the Unruly (Nexxen) bidder. Applies across all ad units.  We support up to 5 custom keys.

```javascript
pbjs.setBidderConfig({
  bidders: ["unruly"],
  config: {
    ortb2: {
      site: {
        ext: {
          data: {
            customkey1: "value1",
            customkey2: "value2",
            customkey3: "value3",
            customkey4: "value4",
            customkey5: "value5"
          }
        }
      }
    }
  }
});
```
