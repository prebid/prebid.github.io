---
layout: userid
title: TNCID by The Newco
description: TNCID UserID sub-module
useridmodule: tncIdSystem
bidRequestUserId: tncId
eidsource: thenewco.it
example: '"1111"'
---

TNCID is a shared persistent identifier that improves user recognition compared to both third-party and first-party cookies. This enhanced identification capability enables publishers and advertisers to consistently recognize their audiences, leading to improved monetization and more precise targeting.  The Newco User ID sub-module adds powerful TNCID user identification technology to your Prebid.js bidstream. 
For more details, visit our <a href="https://www.thenewco.tech">website</a> and contact us to request your publisher-id and the on-page tag.

## Prebid Configuration

First, make sure to add the TNCID submodule to your Prebid.js package with: 

```bash
gulp build --modules=tncIdSystem,userId
```

## TNCIdSystem module Configuration 

{% include dev-docs/loads-external-javascript.md %}

You can configure this submodule in your `userSync.userIds[]` configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'tncId',
            params: {
              url: 'TNC-fallback-script-url' // Fallback url, not required if onpage tag is present (ask TNC for it)
            },
            storage: {
              type: "cookie",
              name: "tncid",
              expires: 365 // in days
            }
        }],
        syncDelay: 5000
    }
});
```

## Configuration Params

The following configuration parameters are available:

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this sub-module | `"tncId"` |
| params ||| Details for the sub-module initialization ||
| params.url | Required | String | TNC script fallback URL - This script is loaded if there is no TNC script on page | `"https://js.tncid.app/remote.min.js"` |
