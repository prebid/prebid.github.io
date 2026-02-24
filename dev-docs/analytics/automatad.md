---
layout: analytics
title: Automatad
description: Automatad Prebid Analytics Adapter
modulecode: automatadAnalytics
tcfeu_supported: false
usp_supported: false
coppa_supported: false
prebid_member: false
enable_download: false
---

#### Instructions for usage

The [Automatad](https://automatad.com/) analytics adapter requires on-boarding, configuration
parameters & addition of an external script that will be supplied to you by your Automatad account team. Please reach out to your account team or
<cs@automatad.com> for more information.

#### Adapter Configuration Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|--------------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| siteID | required  | Your site ID | `N8vZLx`  | string |
| publisherID | required  | Your publisher ID | `PXfvBq`  | string |
| logDebug | optional  | Flag to collect debug data pertaining to auctions. Defaults to false | `false`  | boolean |

### Example Configuration

```js
import CONSTANTS '../src/constants.json';
// ...
const EVENTS = CONSTANTS.EVENTS
// ...
pbjs.enableAnalytics({
  provider: 'automatadAnalytics',
  options: {
    siteID: 'N8vZLx',        // supplied by Automatad
    publisherID: 'PXfvBq',   // supplied by Automatad
    logDebug: false          // Defaults to false
  },
  includeEvents: [
      EVENTS.AUCTION_INIT,
      EVENTS.BID_RESPONSE,
      EVENTS.AUCTION_DEBUG,
      EVENTS.BID_WON,
      EVENTS.BIDDER_DONE,
      EVENTS.NO_BID,
      EVENTS.BID_TIMEOUT
  ]
});
```
