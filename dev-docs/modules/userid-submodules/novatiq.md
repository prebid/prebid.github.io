---
layout: userid
title: Novatiq Hyper ID
description: Novatiq Hyper ID User ID sub-module
useridmodule: novatiqIdSystem
---


The [Novatiq](https://www.novatiq.com) proprietary dynamic Hyper ID is a unique, non sequential and single use identifier for marketing activation. Our in network solution matches verification requests to telco network IDs safely and securely inside telecom infrastructure. The Novatiq Hyper ID can be used for identity validation and as a secured 1st party data delivery mechanism.

## Novatiq Hyper ID Configuration

Enable by adding the Novatiq submodule to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=novatiqIdSystem,userId


Module activation and configuration:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'novatiq',
      bidders: [
        `rubicon`
      ],
      params: {
        // change to the Partner Number you received from Novatiq
        sourceid '1a3'
        }
      }
    }],
    // 1000ms maximum auction delay, applies to all userId modules
    auctionDelay: 1000
  }
});
```

## Parameters for the Novatiq Module

<div class="table-responsive" markdown="1">
| Param  | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | Module identification: `"novatiq"` | `"novatiq"` |
| params | Required | Object | Configuration specifications for the Novatiq module. | |
| params.sourceid | Required (if applicable) | String | This is the Novatiq Partner Number obtained via Novatiq registration. | `1a3` |
| params.useSharedId | Optional | Boolean | Use the sharedID module if it's activated. | `true` |
| params.sharedIdName | Optional | String | Same as the SharedID "name" parameter <br /> Defaults to "_pubcid" | `"demo_pubcid"` |
| params.useCallbacks | Optional | Boolean | Use callbacks for custom integrations | `false` |
| params.urlParams | Optional | Object | Sync URl configuration for custom integrations | |
| params.urlParams.novatiqId | Optional | String | The name of the parameter used to indicate the Novatiq ID uuid | `snowflake` |
| params.urlParams.useStandardUuid | Optional | Boolean | Use a standard UUID format, or the Novatiq UUID format | `false` |
| params.urlParams.useSspId | Optional | Boolean | Send the sspid (sourceid) along with the sync request <br > Makes the params.sourceid optional if set | `false` |
| params.urlParams.useSspHost | Optional | Boolean | Send the ssphost along with the sync request | `false` |
{: .table .table-bordered .table-striped }
</div>


## Novatiq Hyper ID with Prebid SharedID Support

You can make use of the Prebid.js SharedId module as follows.

Enable by adding the Novatiq and SharedId submodule to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=novatiqIdSystem,userId

Module activation and configuration:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [
      {
      name: 'novatiq',
      bidders: [
        `rubicon`
      ],
      params: {
        // change to the Partner Number you received from Novatiq
        sourceid '1a3',

        // Use the sharedID module
        useSharedId: true,

        // optional: will default to _pubcid if left blank.
        // If not left blank must match "name" in the the module above
        sharedIdName: 'demo_pubcid'
        }
      }
    }],
    // 1000ms maximum auction delay, applies to all userId modules
    auctionDelay: 1000
  }
});
```


If you have any questions, please reach out to us at [prebid@novatiq.com](mailto:prebid@novatiq.com)
