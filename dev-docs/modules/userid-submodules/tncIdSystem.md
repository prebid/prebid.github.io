---
layout: userid
title: TNCID
description: TNCID UserID sub-module
useridmodule: tncIdSystem
bidRequestUserId: 
eidsource: 
example:
---

# TNCID UserID Module

## Prebid Configuration

First, make sure to add the TNCID submodule to your Prebid.js package with: 

```bash
gulp build --modules=tncIdSystem,userId
```

## TNCIDIdSystem module Configuration

{% include dev-docs/loads-external-javascript.md %}

You can configure this submodule in your `userSync.userIds[]` configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'tncId',
            params: {
              url: 'https://js.tncid.app/remote.min.js' //Optional
            }
        }],
        syncDelay: 5000
    }
});
```

## Configuration Params

{: .table .table-bordered .table-striped }

| Param Name | Required | Type | Description |
| --- | --- | --- | --- |
| name | Required | String | ID value for the TNCID module: `"tncId"` |
| params.url | Optional | String | Provide TNC fallback script URL, this script is loaded if there is no TNC script on page |
