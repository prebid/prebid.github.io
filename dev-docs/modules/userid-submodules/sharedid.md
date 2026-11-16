---
layout: userid
title: SharedID
description: SharedID User ID sub-module
useridmodule: sharedIdSystem
bidRequestUserId: sharedid
eidsource: sharedid.org
example: '{"id":"01EAJWWN...", "third":"01EAJ..."}'
---


This module stores an unique user id in the first party domain and makes it accessible to all adapters. Similar to IDFA and AAID, this is a simple UUID that can be utilized to improve user matching, especially for iOS and MacOS browsers, and is compatible with ITP (Intelligent Tracking Prevention). It’s lightweight and self contained. Adapters that support SharedId will be able to pick up the user ID and return it for additional server-side cross device tracking.

There is no special registration or configuration for SharedID. Each publisher's privacy policy should take
SharedID into account.  Prebid  recommends implementing a method where users can easily opt-out of targeted advertising. Please refer to the User Opt-Out section located at the bottom of this page. For more information check out Prebid's dedicated [identity page](/identity/sharedid.html)

Add it to your Prebid.js package with:

```bash
gulp build --modules=sharedIdSystem
```

## SharedID ID Configuration

In addition to the parameters documented above in the Basic Configuration section the following SharedID specific configuration is available:

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'sharedId'` |
| params | Optional | Object | Customized parameters | |
| params.create | Optional | Boolean | For publisher server support only.  If true, the publisher's server will create the (pubcid) cookie.  Default is true. | `true` |
| params.pixelUrl | Optional | String | For publisher server support only. Where to call out to for a server cookie -- see [Prebid Identity](/identity/sharedid.html) for more information. See also [Using pixelUrl](#using-pixelurl). | `/wp-json/pubcid/v1/extend/` |
| params.extend | Optional | Boolean | If true, the expiration time of the stored IDs will be refreshed during each page load.  Default is false. | `false` |
| storage | Required | Object | The publisher must specify some kind of local storage in which to store the results of the call to get the user ID. This can be either cookie or HTML5 storage. | |
| storage.expires | Integer | Required | How long the user ID information will be stored. | `365` |
| storage.name | String | Required | The name of the cookie or html5 local storage where the user ID will be stored. | `_pubcid` |
| storage.type | String | Required | This is where the results of the user ID will be stored. Must be either: Must be either: "cookie" or "html5". For server side implementations, which have the best identifier life and revenue impact, this must be a cookie. | `cookie` |

## SharedID Examples

1. Publisher supports SharedID and first party domain cookie storage

    ```javascript
    pbjs.setConfig({
        userSync: {
            userIds: [{
                name: "sharedId",
                storage: {
                    type: "cookie",
                    name: "_sharedid",         // create a cookie with this name
                    expires: 365             // expires in 1 years
                }
            }]
        }
    });
    ```

2. Publisher supports both UnifiedID and SharedID and first party domain cookie storage

    ```javascript
    pbjs.setConfig({
        userSync: {
            userIds: [{
                name: "unifiedId",
                params: {
                    partner: "myTtdPid"
                },
                storage: {
                    type: "cookie",
                    name: "pbjs-unifiedid",       // create a cookie with this name
                    expires: 60
                }
            },{
                name: "sharedId",
                params: {
                    pixelUrl: "/wp-json/pubcid/v1/extend/"
                },
                storage: {
                    type: "cookie",
                    name: "_sharedid",      // create a cookie with this name
                    expires: 180
                }
            }],
            syncDelay: 5000       // 5 seconds after the first bidRequest()
        }
    });
    ```

3. Publisher supports SharedID and first party domain cookie storage initiated by a first party server (see [Using pixelUrl](#using-pixelurl))

    ```javascript
    pbjs.setConfig({
        userSync: {
            userIds: [{
                name: "sharedId",
                params: {
                    pixelUrl: "/wp-json/pubcid/v1/extend/" //pixelUrl should be specified when the server plugin is used
                },
                storage: {
                    type: "cookie",
                    name: "_sharedid",        // create a cookie with this name
                    expires: 365              // expires in 1 year
                }
            }]
        }
    });
    ```

## Using pixelUrl

With `pixelUrl`, Prebid.js calls the endpoint as a pixel, and the endpoint sets the ID cookie from the server, so browsers that cap the lifetime of cookies written from script (such as Safari) keep it for its full lifetime. With `extend: true` the pixel is also called on later page views, refreshing the cookie.

After the pixel loads, Prebid.js reads the cookie again and uses what it then holds, without writing it again from script (in Prebid.js releases that include [#16204](https://github.com/prebid/Prebid.js/pull/16204)):

- If the endpoint set a different ID (for example one it generated with `create: false`, or one it restored), that ID is used.
- If the endpoint deleted the cookie (for example for Global Privacy Control or an opt-out), the ID is dropped and later auctions on the page don't send it. Auctions that ran before the pixel loaded (with `auctionDelay` of 0, the first auction) have already sent it, and a Publisher Provided ID already sent to Google Ad Manager through `userSync.ppid` can't be withdrawn.

Use `storage.type: "cookie"` with `pixelUrl`. The endpoint can't delete local storage, so with `html5` or `cookie&html5` storage, an ID it deletes from the cookie is still read from local storage; Prebid.js logs a warning for this configuration.
