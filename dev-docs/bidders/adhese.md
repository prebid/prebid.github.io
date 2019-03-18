---
layout: bidder
title: Adhese 
description: Prebid Adhese Bidder Adaptor
hide: true
biddercode: adhese
biddercode_longer_than_12: false
media_types: banner, video 
gdpr_supported: true
---

### Note
The Adhese bid adapter may require an additional setup from the Adhese team, even for existing Adhese customers. Please reach out to your support team or info@adhese.com for more information.
 
### bid params

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
