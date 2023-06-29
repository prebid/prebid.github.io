---
layout: bidder
title: Adhese 
description: Prebid Adhese Bidder Adaptor
pbjs: true
pbs: true
biddercode: adhese
media_types: banner, video 
gdpr_supported: true
userIds: id5Id
gvl_id: 553
pbs_app_supported: true
sidebarType: 1
---

### Registration

The Adhese bid adapter may require an additional setup from the Adhese team, even for existing Adhese customers. Please reach out to your support team or <info@adhese.com> for more information.

Prebid Server host companies need to work with Adhese for each additional publisher.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description        | Example                      | Type     |
|---------------|----------|--------------------|------------------------------|----------|
| `account`     | required | Adhese account name   | `'demo'`                  | `string` |
| `location`    | required | Adhese location name  | `'_adhese_prebid_demo_'`  | `string` |
| `format`      | required | Adhese format name    | `'leaderboard'`           | `string` |
| `data`        | optional | Custom target data    | `{ 'ci': [9000, 9050] }`  | `object` |

### Configuration

Adhese supports 'iframe' UserSync configuration only.

For Prebid.js v1.15.0 and later:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*',      // '*' represents all bidders
        filter: 'include'
      }
    }
  }
});
```

For Prebid.js v1.14.0 and before:

```javascript
pbjs.setConfig({
   userSync: {
    iframeEnabled: true,
    enabledBidders: ['adhese']
 }});
```

Note: Combine the above the configuration with any other UserSync configuration. Multiple setConfig() calls overwrite each other and only last call for a given attribute will take effect.

<!-- workaround bug where code blocks at end of a file are incorrectly formatted-->
