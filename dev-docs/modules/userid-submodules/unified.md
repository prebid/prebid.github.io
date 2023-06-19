---
layout: userid
title: Unified ID
description: Unified ID User ID sub-module
useridmodule: unifiedIdSystem
---


The Unified ID solution is provided by adsrvr.org and the Trade Desk.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=unifiedIdSystem

## Unified ID Registration

You can set up Unified ID in one of these ways:

- Register with The Trade Desk from their [Unified ID page](https://www.thetradedesk.com/industry-initiatives/unified-id-solution).
- Utilize a [managed services](https://prebid.org/product-suite/managed-services/) company who can do this for you.

The Unified ID privacy is covered under the [TradeDesk Services Privacy Policy](https://www.thetradedesk.com/general/privacy).

## Unified ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"unifiedId"` | `"unifiedId"` |
| params | Required for UnifiedId | Object | Details for UnifiedId initialization. | |
| params.partner | Either this or url required for UnifiedId | String | This is the partner ID value obtained from registering with The Trade Desk or working with a Prebid.js managed services provider. | `"myTtdPid"` |
| params.url | Required for UnifiedId if not using TradeDesk | String | If specified for UnifiedId, overrides the default Trade Desk URL. | "<https://unifiedid.org/somepath?args>" |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the Unified ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"tdid": "D6885E90-2A7A-4E0F-87CB-7734ED1B99A3"}` |

## Unified ID Examples

1) Publisher has a partner ID with The Trade Desk, and is using the default endpoint for Unified ID.

{: .alert.alert-warning :}
Bug: The default URL did not support HTTPS in Prebid.js 2.10-2.14. So instead of using
the 'partner' parameter, it's best to supply the Trade Desk URL as shown in this example.

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "unifiedId",
            params: {
                url: "//match.adsrvr.org/track/rid?ttd_pid=MyTtidPid&fmt=json"
            },
            storage: {
                type: "cookie",
                name: "pbjs-unifiedid",       // create a cookie with this name
                expires: 60                   // cookie can last for 60 days
            }
        }],
        syncDelay: 3000              // 3 seconds after the first auction
    }
});
```

2) Publisher supports UnifiedID with a vendor other than Trade Desk and HTML5 local storage.

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "unifiedId",
            params: {
                url: "URL_TO_UNIFIED_ID_SERVER"
            },
            storage: {
                type: "html5",
                name: "pbjs-unifiedid",    // set localstorage with this name
                expires: 60
            }
        }],
        syncDelay: 3000
    }
});
```

3) Publisher has integrated with UnifiedID on their own and wants to pass the UnifiedID directly through to Prebid.js.

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "unifiedId",
            value: {"tdid": "D6885E90-2A7A-4E0F-87CB-7734ED1B99A3"}
        }]
    }
});
```
