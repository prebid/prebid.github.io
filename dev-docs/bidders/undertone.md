---
layout: bidder
title: Undertone
description: Prebid undertone Bidder Adaptor
biddercode: undertone
media_types: display, video
gvl_id: 677
tcfeu_supported: true
usp_supported: true
schain_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
pbjs: true
pbs: true
sidebarType: 1
---



### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                               | Example    | Type      |
|---------------|----------|-------------------------------------------|------------|-----------|
| `placementId` | required | Your placement ID (provided by undertone) | `"13as14d0"` | `string`  |
| `publisherId` | required | publisher ID (provided by undertone)      | `12345`    | `integer` |

#### Video Object

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                    | Example                                   | Type            |
|------------------|----------|------------------------------------------------|-------------------------------------------|-----------------|
| `playbackMethod` | optional | Playback method supported by the publisher.<br/>`1`: Auto-play sound on<br/>`2`: Auto-play sound off<br/>`3`: Click-to-play sound on<br/>`4`: Mouse-over sound on| `1` | `integer` |
| `maxDuration`    | optional | Maximum video ad duration in seconds. | `30` | `integer` |
| `skippable`      | optional | Skippability of the inventory. Possible values: `true` - only skippable inventory is allowed, `false` - skippable inventory is not allowed, null/missing - all inventory is allowed (default value). | `true` | `boolean` |

Supported from version 3.27.0 and above

### Configuration

To maximize revenue efficiency, please enable iframe-based user syncing. This functionality will improve user match rates and will help increasing the bid rate.

Example code to enable iframe user-sync for Undertone:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['undertone'],
        filter: 'include'
      }
    }
  }
});
```

Note: Combine the above the configuration with any other UserSync configuration. Multiple setConfig() calls overwrite each other and only last call for a given attribute will take effect.
