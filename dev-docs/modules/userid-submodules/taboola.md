---
layout: userid
title: Taboola ID
description: Taboola ID User ID sub-module
useridmodule: taboolaIdSystem
bidRequestUserId: taboolaId
eidsource: taboola.com
example: '"abc123def456"'
---


Taboola is a global leader in powering recommendations across the open web. The Taboola ID module allows publishers to enable identity support for Taboola demand by leveraging a persistent user ID from Taboola's identity infrastructure.

This ID helps improve addressability, performance, and monetization opportunities across Taboola-integrated supply paths, particularly in environments where third-party cookies are limited or unavailable.

The Taboola privacy policy can be found at [www.taboola.com/privacy-policy](https://www.taboola.com/privacy-policy).

Add it to your Prebid.js package with:

```bash
gulp build --modules=taboolaIdSystem,userId
```

## Taboola ID Configuration

The Taboola ID module does not require any configuration parameters. If needed, it supports an optional `storage` config to persist the ID locally.

{: .alert.alert-info :}
NOTE: The Taboola ID module supports both first-party and server-side Prebid identity environments.

The following configuration parameters are available:

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description                                               | Example                                                   |
| --- | --- | --- |-----------------------------------------------------------|-----------------------------------------------------------|
| name | Required | String | The name of this sub-module                               | `"taboolaId"`                                             |
| storage |||                                                           |                                                           |
| storage.name | Required | String | The name of the cookie or html5 local storage key         | `"taboolaId"` (recommended)                               |
| storage.type | Required | String | This is where the taboola user ID will be stored          | `"cookie&html5"` (recommended) or `"html5"` |
| storage.expires | Strongly Recommended | Number | How long (in days) the user ID information will be stored | `365` (recommended)                                       |

## Taboola ID Example

```javascript
pbjs.setConfig({
       userSync: {
           userIds: [
               {
                   name: 'taboolaId',
                   storage: {          //Optionally specify where to store the ID, e.g. cookies or localStorage
                       name: 'taboolaId',
                       type: 'html5', // or 'html5&cookie'
                       expires: 365  // days
                   }
               }
           ]
       }
});
```
