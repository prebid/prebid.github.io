---
layout: userid
title: SharedID
description: SharedID User ID sub-module
useridmodule: sharedIdSystem
---


This module stores a unique user id in the first party domain and makes it accessible to all adapters. Similar to IDFA and AAID, this is a simple UUID that can be utilized to improve user matching, especially for iOS and MacOS browsers, and is compatible with ITP (Intelligent Tracking Prevention). It’s lightweight and self contained. Adapters that support SharedId will be able to pick up the user ID and return it for additional server-side cross device tracking.

There is no special registration or configuration for SharedID. Each publisher's privacy policy should take
SharedID into account.  Prebid recommends implementing a method where users can easily opt-out of targeted advertising. Please refer to the User Opt-Out section located at the bottom of this page. For more information check out Prebid's dedicated [identity page](/identity/sharedid.html)

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=sharedIdSystem

## SharedID ID Configuration

In addition to the parameters documented above in the Basic Configuration section the following SharedID specific configuration is available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'sharedId'` |
| params | Optional | Object | Customized parameters | |
| params.create | Optional | Boolean | For publisher server support only.  If true, the publisher's server will create the (pubcid) cookie.  Default is true. | `true` |
| params.pixelUrl | Optional | String | For publisher server support only. Where to call out to for a server cookie -- see [Prebid Identity](/identity/sharedid.html) for more information. | `/wp-json/pubcid/v1/extend/` |
| params.extend | Optional | Boolean | If true, the expiration time of the stored IDs will be refreshed during each page load. Default is false. | `false` |
| storage | Required | Object | The publisher must specify some kind of local storage in which to store the results of the call to get the user ID. This can be either cookie or HTML5 storage. |
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

3. Publisher supports SharedID and first party domain cookie storage initiated by a first party server

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
