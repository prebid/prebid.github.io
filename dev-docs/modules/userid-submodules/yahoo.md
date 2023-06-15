---
layout: userid
title: Yahoo ConnectID
description: Yahoo ConnectID User ID sub-module
useridmodule: connectIdSystem
---

Yahoo ConnectID is a person based ID and does not depend on 3rd party cookies. It enables ad tech platforms to recognize and match users consistently across the open web. Built on top of Yahoo's robust and proprietary ID Graph it delivers higher monetization while respecting user privacy via multiple controls.

Add support for Yahoo ConnectID to your Prebid.js package using:

{: .alert.alert-info :}
gulp build --modules=userId,connectIdSystem

## Yahoo ConnectID Registration

A Yahoo-supplied publisher-specific pixel ID is required. Reach out to [connectid.support@yahooinc.com](mailto:connectid.support@yahooinc.com) for assistance with setup.


## Yahoo ConnectID Configuration
Note: Parameters are case-sensitive. ConnectID is the proper name of our product, however, when used in code it is spelled as connect**I**d. Follow the example in the table below.

<div class="table-responsive" markdown="1">
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `"connectId"` |
| params | Required | Object | Container of all module params. ||
| params.pixelId | Required | Number |
The Yahoo-supplied publisher-specific pixel ID. | `"0000"` |
| params.he | Optional | String | The SHA-256 hashed user email address which has been lowercased prior to hashing.  |`"ed8ddbf5a171981db8ef938596ca297d5e3f84bcc280041c5880dba3baf9c1d4"`|
| params.puid | Optional | String | A domain-specific user identifier such as a first-party cookie. If not passed, a puid value will be auto-generated and stored in local and / or cookie storage.  | `"ab9iibf5a231ii1db8ef911596ca297d5e3f84biii00041c5880dba3baf9c1da"` |
{: .table .table-bordered .table-striped }
</div>


## Yahoo ConnectID Examples

```
// [Sample #1]: Using a hashed email only.

pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "connectId",
            params: {
              pixelId: "0000",
              he: "ed8ddbf5a171981db8ef938596ca297d5e3f84bcc280041c5880dba3baf9c1d4"
            }
        }]
    }
})
```

```
// [Sample #2]: Neither a hashed email nor a publisher user identifier is passed.

pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "connectId",
            params: {
              pixelId: "0000",
            }
        }]
    }
})
```

```
// [Sample #3]: Using a hashed email and a publisher user identifier such as a first-party cookie.

pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "connectId",
            params: {
              pixelId: "0000",
              he: "ed8ddbf5a171981db8ef938596ca297d5e3f84bcc280041c5880dba3baf9c1d4"
         puid: "ab9iibf5a231ii1db8ef911596ca297d5e3f84biii00041c580dba3baf9c1da"
            }
        }]
    }
})
```

## Implementation Verification
Follow the steps below to check that ConnectIDs are being successfully retrieved and included on ad requests.
1) Open a Prebid-enabled page on the website.
2) Open the browser console and enter pbjs.getUserIds().
3) Verify connectId is in the list.
   - If connectId is not in the list, the correct pixelId parameter is likely not being passed. Verify you are using the correct value provided by Yahoo. Reach out to [connectid.support@yahooinc.com](mailto:connectid.support@yahooinc.com) for assistance.
4) Verify that ConnectID is successfully included in the ad requests.
   - Go to the Network tab and search for an ad call event to any of the SSPs that you are using (e.g., “prebid-client”).
   - Navigate to the Payload tab. Check that yahoo.com is listed as a source in the user.ext.eids array.
5) Repeat steps 1-4 after an email is provided via login or some other mechanism used to collect user registration on the website.

## Honoring Privacy Choices

Yahoo ConnectID provides multiple mechanisms for users to manage their privacy choices. Users can manage their choices via [ConnectID Control Portal](http://connectid.yahoo.com), on the [Yahoo Privacy Dashboard](https://legal.yahoo.com/us/en/yahoo/privacy/dashboard/index.html) and [NAI’s Audience Matched Opt Out page](https://optout.networkadvertising.org/optout/email).  No further actions are required by Publishers as Yahoo will ensure that privacy choices selected by users via one of these methods are honored. We will automatically stop generating ConnectIDs for users who have opted-out.

When desired, additional privacy control can be provided to your users. Within your privacy policy or website privacy settings, [Create an Easy Opt-in Opt-out Toggle](https://documentation.help.yahooinc.com/platform/SSP/Sellers/Integrate/Create-an-Easy-OptIn-Optout-Toggle.htm) for ConnectID.

Finally, ConnectID follows all global privacy laws (such as the CCPA) and industry frameworks (such as NAI, DAA and IAB). Yahoo will auto-detect most privacy signals present on the page (including those set by Prebid libraries) and not generate a ConnectID for users that have opted-out.

## Yahoo ConnectID Optional Parameters
Please note that the storage related parameters are optional. We recommend that you omit them, since ConnectID module is pre-configured with the most optimal storage parameters already.

<div class="table-responsive" markdown="1">
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| storage | Optional | Object | Defines where and for how long the results of the call to get a user ID will be stored. | |
| storage.type | Optional | String | Defines where the resolved user ID will be stored (either 'cookie' or 'html5' local storage). | `'cookie'` |
| storage.name | Optional | String | The name of the cookie or html5 local storage where the resolved user ID will be stored. | `'connectId'` |
| storage.expires | Optional | Integer | How long (in days) the user ID information will be stored. | `15` |
{: .table .table-bordered .table-striped }
</div>
