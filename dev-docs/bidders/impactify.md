---
layout: bidder
title: Impactify
description: Prebid Impactify Bidder Adapter
pbjs: true
pbs: true
biddercode: impactify
tcfeu_supported: true
tcf2_supported: true
usp_supported: true
schain_supported: true
coppa_supported: true
media_types: video
userIds: criteo, id5Id, pubCommonId, unifiedId, uid2, netId
gvl_id: 606
sidebarType: 1
---

### Note

The Impactify adaptator requires setup and validation from the Impactify team. Simply email us your contact details at <support@impactify.io> and we'll make sure we'll connect you within 48h.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                        | Example        | Type      |
|---------------|----------|----------------------------------------------------|----------------|-----------|
| `appId`       | required | Impactify publisher id  (Contact us)               | `'example.com'`  | `string`  |
| `format`      | required | Impactify ad format (screen or display)            | `'screen'`       | `string`  |
| `style`       | required | Impactify ad style (inline, impact or static)      | `'impact'`       | `string`  |

### Configuration

Impactify recommends the UserSync configuration below. Without it, the Impactify adapter will not be able to perform user syncs, which lowers match rate and reduces monetization.

Note : Impactify adapter needs storage access to work properly (Do not forget to set storageAllowed to true).

{% include dev-docs/storageAllowed.md %}

For Prebid.js v1.15.0 and later:

```javascript
pbjs.bidderSettings = {
    impactify: {
        storageAllowed: true // Mandatory
    }
};

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

pbjs.bidderSettings = {
    impactify: {
        storageAllowed: true // Mandatory
    }
};

pbjs.setConfig({
   userSync: {
    iframeEnabled: true,
    enabledBidders: ['impactify']
 }});
```

Note: Combine the above configuration with any other UserSync configuration. Multiple setConfig() calls overwrite each other and only the last call for a given attribute will take effect.
