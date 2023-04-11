---
layout: userid
title: LiveIntent nonID
description: LiveIntent nonID User ID sub-module
useridmodule: liveIntentIdSystem
---


LiveIntent offers audience resolution by leveraging our next-generation identity solutions. The LiveIntent identity graph is built around a people-based set of data that is authenticated daily through active engagements with email newsletters and media across the web. The LiveIntent nonID is a user identifier tied to an active, encrypted email in our graph and functions in cookie-challenged environments and browsers.

Build your Prebid.js package to include the LiveIntent nonID using the standard version which allows publishers to include the module with full functionalities, like hashing email addresses and identity resolution.

Add the **full** LiveIntent Identity module to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,liveIntentIdSystem

The `request.userId.lipb` object would look like:
```
{
  "lipbid": "T7JiRRvsRAmh88",
  "segments": ["999"]
}
```

The adapters can be implemented to use the lipbid as the identifier and segments to which that identifier is associated with. To enable identity resolution for a specific publisher, LiveIntent builds a model on the backend with data collected via an additional call issued on each page load.

## LiveIntent ID Registration

Please register with us if you’re not already a LiveIntent customer: [https://www.liveintent.com/prebid-registration/](https://www.liveintent.com/prebid-registration/)

LiveIntent’s privacy policies for the services rendered can be found at [https://www.liveintent.com/services-privacy-policy/](https://www.liveintent.com/services-privacy-policy/)

## How does LiveIntent ID work

The LiveIntent ID sub-module resolves the identity of audiences by connecting impression opportunities to a stable identifier - the nonID. In order to provide resolution one or more first-party cookies are used to create a stable identifier.

How does LiveIntent ID sub-module decide, which first-party cookies to use:
1. By default LiveIntent ID sub-module generates its own first-party identifier on the publisher’s domain. Publishers have the option to disable the cookie generation when configuring the LiveIntent ID sub-module.
2. A publisher can also define in the configuration which additional first-party cookies should be used. These can be used in a combination with the LiveIntent first-party cookie.

The LiveIntent ID sub-module sends the defined identifiers to the identity graph, which processes them and creates a nonID. The parameters being sent are described [here](https://github.com/liveintent-berlin/live-connect/blob/HEAD/COLLECTOR_PARAMS.md)

For the identity resolution the LiveIntent ID sub-module makes a request to LiveIntent’s identity resolution API, which returns a nonID and the audience segment(s) a user belongs to. The nonID and the segment ID are then exposed by the Prebid User ID Module to Prebid adapters to be sent out in a bid request. An SSP can then make the impression opportunity available to any buyers targeting the segment.

The first-party cookie generation and identity resolution functionality is provided by the LiveConnect JS library, included within the LiveIntent ID sub-module. LiveIntent has created a shared library that is open source, available at [https://www.npmjs.com/package/live-connect-js](https://www.npmjs.com/package/live-connect-js).

The LiveIntent ID sub-module follows the standard Prebid.js initialization based on the GDPR consumer opt-out choices. With regard to CCPA, the LiveConnect JS receives a us_privacy string from the Prebid US Privacy Consent Management Module and respects opt-outs.

## Configuring requested attributes

Attributes other than the nonID can be requested using the `requestedAttributesOverrides` configuration option.

Among others, LiveIntent's user id sub-module can be configured to request the attributes 'uid2', 'medianet' and 'bidswitch'. Each of these attributes will result in a separate id returned by LiveIntent's user id sub-module. For example, in case 'uid2' is configured to be requested - additionally to the nonID - the `request.userId` object would look like this:

{% highlight javascript %}
```
{
    ...
    "lipb" : {
        "lipbid": "sample-nonid-value",
        "segments": ["999"],
        "uid2" : "sample-uid2-value"
    },
    "uid2" : {
        "id" : "sample-uid2-value"
    }
    ...
}
```
{% endhighlight %}

Note that 'uid2' is exposed as part of 'lipb' as well as separately as 'uid2'. 'medianet' and 'bidswitch' behave the same way.

For the attributes 'lipbid' (nonID), 'uid2', 'medianet' and 'bidswitch' there is also support for their conversion into OpenRTB EIDS format. Please refer to [userId.md](../userId.md) for more information on conversion and [eids.md](https://github.com/prebid/Prebid.js/blob/master/modules/userId/eids.md) for output format examples.

### Resolving uid2

An attribute that requires special mention here is 'uid2'. If this attribute is resolved by the id sub-module, it will be exposed in the same format as from the Unified ID 2.0 user id module. If both the LiveIntent module and the uid2 module manage to resolve an uid2, the one from the uid2 module will be used. Enabling this option in addition to the uid2 module is an easy way to increase your uid2 resolution rates. Example configuration to enable uid2 resolution:

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            "name": "liveIntentId",
            "params": {
                "publisherId": "12432415",
                "requestedAttributesOverrides": {'uid2': true},
            },
        }]
    }
});
{% endhighlight %}

## LiveIntent ID configuration

{: .alert.alert-info :}
NOTE: For optimal performance, the LiveIntent ID module should be called at every opportunity. It is best not to use `params.storage` with this module as the module has its own optimal caching mechanism.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'liveIntentId'` |
| params | Required | Object | Container of all module params. ||
| params.publisherId |Optional| String | The unique identifier for each publisher (for existing LiveIntent customers)|`'12432415'`|
| params.ajaxTimeout |Optional| Number |This configuration parameter defines the maximum duration of a call to the IdentityResolution endpoint. By default, 1000 milliseconds.|`1000`|
| params.partner | Optional| String |The name of the partner whose data will be returned in the response.|`'prebid'`|
| params.identifiersToResolve |Optional| Array[String] |Used to send additional identifiers in the request for LiveIntent to resolve against the LiveIntent ID.|`['my-id']`|
| params.requestedAttributesOverrides | Optional | Object | Object containing booleans used to override the default resolution. Attributes set to true will be added to the resolve list, while attributes set to false will be removed | `{'uid2': true}` |
| params.emailHash |Optional| String |The hashed email address of a user. We can accept the hashes, which use the following hashing algorithms: md5, sha1, sha2.|`1a79a4d60de6718e8e5b326e338ae533`|
| params.url | Optional| String |Use this to change the default endpoint URL if you can call the LiveIntent Identity Exchange within your own domain.|`'https://idx.my-domain.com'`|
| params.liCollectConfig |Optional| Object |Container of all collector params.||
| params.liCollectConfig.fpiStorageStrategy |Optional| String |This parameter defines whether the first party identifiers that LiveConnect creates and updates are stored in a cookie jar, or in local storage. If nothing is set, default behaviour would be `cookie`. Allowed values: [`cookie`, `ls`, `none`]|`'cookie'`|
| params.liCollectConfig.fpiExpirationDays |Optional| Number |The expiration time of an identifier created and updated by LiveConnect.By default, 730 days.|`729`|
| params.liCollectConfig.collectorUrl |Optional| String |The parameter defines where the signal pixels are pointing to. The params and paths will be defined subsequently. If the parameter is not set, LiveConnect will by default emit the signal towards `https://rp.liadm.com`.|`'https://rp.liadm.com'`|
| params.liCollectConfig.appId |Optional| String |LiveIntent's media business entity application id.|`'a-0012'`|
| storage | Required | Object | This object defines where and for how long the results of the call to get a user ID will be stored. | |
| storage.type | Required | String | This parameter defines where the resolved user ID will be stored (either `'cookie'` or `'html5'` localstorage).| `'cookie'` |
| storage.name | Required | String | The name of the cookie or html5 localstorage where the resolved user ID will be stored. | `'pbjs_li_nonid'` |
| storage.expires | Recommended | Integer | How long (in days) the user ID information will be stored. The recommended value is `1` | `1` |

## LiveIntent ID examples

1. To receive the LiveIntent ID, the setup looks like this.
```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "liveIntentId",
            params: {
              publisherId: "9896876"
            },
            storage: {
            type: “cookie”,
            name: “pbjs_li_nonid”,    //create a cookie with this name
            expires: 1                // cookie is stored for 1 day
            }
        }]
    }
})
```

2. If you are passing additional identifiers that you want to resolve to the LiveIntent ID, add those under the `identifiersToResolve` array in the configuration parameters.
```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "liveIntentId",
            params: {
              publisherId: "9896876",
              identifiersToResolve: ["my-own-cookie"]
            },
            storage: {
            type: “cookie”,
            name: “pbjs_li_nonid”,    //create a cookie with this name
            expires: 1                // cookie is stored for 1 day
            }
        }]
    }
})
```

3. If all the supported configuration params are passed, then the setup looks like this.
```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "liveIntentId",
            params: {
              publisherId: "9896876",
              identifiersToResolve: ["my-own-cookie"],
              url: "https://publisher.liveintent.com/idex",
              partner: "prebid",
              ajaxTimeout: 1000,
              liCollectConfig: {
                fpiStorageStrategy: "cookie",
                fpiExpirationDays: 730,
                collectorUrl: "https://rp.liadm.com",
                appId: "a-0012"
              }
            },
            storage: {
            type: “cookie”,
            name: “pbjs_li_nonid”,    //create a cookie with this name
            expires: 1                // cookie is stored for 1 day
            }
        }]
    }
})
```
