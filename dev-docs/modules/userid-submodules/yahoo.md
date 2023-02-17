---
layout: userid
title: Yahoo ConnectID
description: Yahoo ConnectID User ID sub-module
useridmodule: connectIdSystem
---

Yahoo ConnectID is a person based ID and does not depend on 3rd party cookies. It enables ad tech platforms to recognize and match users consistently across the open web. Built on top of Yahoo’s robust and proprietary ID Graph it delivers a higher find rate of audiences on publishers’ sites user targeting that respects privacy.

## Honoring Privacy Choices

Yahoo ConnectID provides multiple mechanisms for users to manage their privacy choices. Users can manage their choices via [ConnectID Control Portal](http://connectid.yahoo.com), on the [Yahoo Privacy Dashboard](https://legal.yahoo.com/us/en/yahoo/privacy/dashboard/index.html) and [NAI’s Audience Matched Opt Out page](https://optout.networkadvertising.org/optout/email).  No further actions are required by Publishers as Yahoo will ensure that privacy choices selected by users via one of these methods are honored. We will automatically stop generating ConnectIDs for users who have opted-out.

When desired, additional privacy control can be provided to your users. Within your privacy policy or website privacy settings, [Create an Easy Opt-in Opt-out Toggle](https://documentation.help.yahooinc.com/platform/SSP/Sellers/Integrate/Create-an-Easy-OptIn-Optout-Toggle.htm) for ConnectID.

Finally, ConnectID follows all global privacy laws (such as the CCPA) and industry frameworks (such as NAI, DAA and IAB). Yahoo will auto-detect most privacy signals present on the page (including those set by prebid libraries) and not generate a ConnectID for users that have opted-out.


## Yahoo ConnectID Registration

A Yahoo supplied publisher specific pixel Id is required. Please reach out to your account manager for assistance with setup.

Add support for Yahoo ConnectID to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,connectIdSystem


## Yahoo ConnectID Configuration

<div class="table-responsive" markdown="1">
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'connectId'` |
| params | Required | Object | Container of all module params. ||
| params.pixelId | Required | Number | The Yahoo supplied publisher specific pixel Id  | `8976` |
| params.he | Optional | String | The SHA-256 hashed user email address. One of either the `he` parameter or the `puid` parameter must be supplied. |`'ed8ddbf5a171981db8ef938596ca297d5e3f84bcc280041c5880dba3baf9c1d4'`|
| params.puid | Optional | String | The publisher-supplied user identifier. One of either the `he` parameter or the `puid` parameter must be supplied. | `"P-975484817"` |
| storage | Required | Object | Defines where and for how long the results of the call to get a user ID will be stored. | |
| storage.type | Required | String | Defines where the resolved user ID will be stored (either `'cookie'` or `'html5'` localstorage).| `'html5'` |
| storage.name | Required | String | The name of the cookie or html5 localstorage where the resolved user ID will be stored. | `'connectId'` |
| storage.expires | Recommended | Integer | How long (in days) the user ID information will be stored. The recommended value is `15` | `15` |
{: .table .table-bordered .table-striped }
</div>


## Yahoo ConnectID Examples

```
// [Sample #1]: Using a hashed email.
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "connectId",
            params: {
              pixelId: 8976,
              he: "ed8ddbf5a171981db8ef938596ca297d5e3f84bcc280041c5880dba3baf9c1d4"
            },
            storage: {
              type: "html5",
              name: "connectId",
              expires: 15
            }
        }]
    }
})
```

```
// [Sample #2]: Using a publisher-supplied user identifier.
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "connectId",
            params: {
              pixelId: 8976,
              puid: "P-975484817"
            },
            storage: {
              type: "html5",
              name: "connectId",
              expires: 15
            }
        }]
    }
})
```

```
// [Sample #3]: Using a hashed email and a publisher-supplied user identifier.
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "connectId",
            params: {
              pixelId: 8976,
              he: "ed8ddbf5a171981db8ef938596ca297d5e3f84bcc280041c5880dba3baf9c1d4",
              puid: "P-975484817"
            },
            storage: {
              type: "html5",
              name: "connectId",
              expires: 15
            }
        }]
    }
})
```
