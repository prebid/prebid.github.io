---
layout: analytics
title: Adloox
description: Adloox Prebid Analytics Adapter
modulecode: adloox
tcfeu_supported: true
usp_supported: true
coppa_supported: false
prebid_member: false
gvl_id: 93
enable_download: false
---

#### Disclosure

The adapter adds an HTML `<script>` tag to load Adloox's post-buy verification JavaScript (`https://j.adlooxtracking.com/ads/js/tfav_adl_X.js` at ~25kiB gzipped) when the [`bidWon` event](https://docs.prebid.org/dev-docs/publisher-api-reference.html#module_pbjs.onEvent) for each ad slot.

#### Registration

The [Adloox](https://adloox.com/) analytics adapter requires on-boarding and configuration
parameters supplied to you by Adloox account team. Please reach out to your account team or
<info@adloox.com> for more information.

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| client | required  | Your client name | `'adlooxtest'`  | string |
| clientid | required  | Your client ID | `127`  | integer |
| platformid | required  | Your platform ID | `2`  | integer |
| tagid | required  | Your tag configuration ID | `1234`  | integer |

For detailed instructions please look to the [integration guidelines shipped with the Prebid.js project](https://github.com/prebid/Prebid.js/blob/master/modules/adlooxAnalyticsAdapter.md) which also link to our Prebid video and real-time data provider options.

### Example Configuration

```
  pbjs.enableAnalytics({
    provider: 'adloox',
    options: {
      client: 'adlooxtest',  // supplied by Adloox
      clientid: 127,         // supplied by Adloox
      platformid: 0,         // supplied by Adloox
      tagid: 0               // supplied by Adloox
    }
  });
```
