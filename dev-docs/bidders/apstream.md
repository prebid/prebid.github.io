---
layout: bidder
title: AP Stream
description: AP Stream Bidder Adapter
biddercode: apstream
pbjs: true
media_types: banner
gdpr_supported: false
gvl_id: 394
sidebarType: 1
---

Note: This bidder passes consent strings but not the gdprApplies flag to its backend. This may result in some incorrect GDPR processing, such as when the consent string is not yet available but the publisher has decided GDPR always applies. See https://github.com/prebid/Prebid.js/issues/7775

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope      | Description                                     | Example            | type    |
| :-----------   | :--------- | :------------                                   | :----------------- | :---    |
| `publisherId`  | optional*  | Publisher Id will be generated on AP Stream.    | '1234'             | string  |
| `code`         | optional   | Ad code                                         | 'S1_Leaderboard'   | string  |
| `adunitId`     | optional   | Ad unit Id                                      | 1234               | integer |
| `endpoint`     | optional   | Endpoint for custom bidder                      | 'site.com/v1'      | string  |
| `test`         | optional*  | Use test endpoint                               | true               | boolean |
| `sendDsu`      | optional   | Send DSU to bidder (default `true`)             | false              | boolean |

\* see description below

#

### Bidder config

Here parameters `test` and `publisherId` can be set globally, but will be overrided if set in specific bid.

```
pbjs.setBidderConfig({
    bidders: ["apstream"],
    config: {
        appstream: {
            publisherId: '1234
            test: true
        }
    }
});
```
