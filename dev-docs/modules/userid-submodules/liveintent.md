---
layout: userid
title: LiveIntent nonID
description: LiveIntent nonID User ID sub-module
useridmodule: liveIntentIdSystem
bidRequestUserId: lipb.lipbid
eidsource: liveintent.com
example: '"1111"'
---

LiveIntent offers audience resolution by leveraging its next-generation identity solutions. The LiveIntent identity graph is built around a people-based set of data that is authenticated daily through active engagements with email newsletters and media across the web.

The LiveIntent `nonID` is a user identifier tied to an active, encrypted email in the graph and functions in cookie-challenged environments and browsers. Alongside the `nonID`, LiveIntent's user ID sub-module can resolve multiple other user identifiers called _attributes_ - such as `uid2`, `pubmatic`, and others. See the [Multiple user IDs](#multiple-user-ids) section for more details.

There are two ways to add the functionality of LiveIntent Identity sub-module to your _Prebid.js_ package:

1. The standard version, which allows publishers to include the module with full functionalities, like hashing email addresses and identity resolution.

    Add the **standard** LiveIntent Identity module to your Prebid.js package with:

    ```bash
    gulp build --modules=userId,liveIntentIdSystem
    ```

2. The minimal version, which allows publishers to deploy a smaller bundle with minimal features, including identity resolution.

    Add the **minimal** LiveIntent Identity module to your Prebid.js package with:

    ```bash
    LiveConnectMode=minimal gulp build --modules=liveIntentIdSystem
    ```

3. The external version, which requires a LiveConnect tag (>=3.0.0) installed on your page in addition to Prebid. Please contact LiveIntent for support in setting up LiveConnect.
This will significantly reduce the size of your Prebid.js bundle and allow you to use the newest features of LiveConnect. All other versions will be deprecated in the future.

    Add the **external** LiveIntent Identity module to your Prebid.js package with:

    ```bash
    LiveConnectMode=external gulp build --modules=liveIntentIdSystem
    ```

This is an example of how the `request.userId.lipb` object, which contains the resolution result, would look like:

```json
{
  "lipbid": "T7JiRRvsRAmh88",
  "pubmatic": "9E76F017-86D2-444B-BB4B-9DB35347DB54"
}
```

## Configure the LiveConnect Tag
Configuring the LiveConnect tag is a critical step in setting up effective identity resolution on your website. This tag helps capture user interactions, generate first-party cookies, and link these interactions to stable identifiers. By doing so, the LiveConnect tag transforms anonymous site traffic into actionable data, enabling you to better understand and engage with your audience.

For detailed configuration instructions, refer to the following resources:
[LiveConnect for HIRO Clients Configuration Guide](https://support.liveintent.com/hc/en-us/articles/30245171256724-LiveConnect-Configuration-Guide-for-HIRO-Clients)

If you need a publisher id or distributor id for the LiveConnect script on the page, please connect your LiveIntent representative for it.
If you're not already a LiveIntent customer, feel free to [reach out](https://www.liveintent.com/get-in-touch/) to us. You can also explore the [LiveIntent’s privacy policies](https://www.liveintent.com/services-privacy-policy/).

## How LiveIntent user ID sub-module works

The LiveIntent user ID sub-module resolves the identity of audiences by connecting impression opportunities to a stable identifier. LiveIntent builds a model on the backend with data collected through an additional call issued on each page load. In order to provide ID resolution, the sub-module uses one or more first-party cookies. See the [query parameters description](https://github.com/LiveIntent/live-connect/blob/HEAD/COLLECTOR_PARAMS.md) for more details.

The following first-party cookies are supported:

1. Default first-party cookie: By default, LiveIntent ID sub-module generates its own first-party identifier on the publisher’s domain. Publishers have the option to disable the cookie generation when configuring the sub-module.
2. Publisher defined first-party cookie: Publishers have the flexibility to configure and choose additional first-party cookies for use in conjunction with the LiveIntent first-party cookie.

### Identity resolution

For the identity resolution, the LiveIntent ID sub-module makes a request to LiveIntent’s identity resolution API, which returns a `nonID` and additional attributes. The identifier and attributes are then exposed by the Prebid User ID Module to Prebid adapters to be sent out in a bid request. An SSP can then make the impression opportunity available to buyers that would like to target the audience.

The first-party cookie generation and identity resolution functionality is provided by [LiveConnect JS](https://www.npmjs.com/package/live-connect-js) - an open source JS library which is included within the LiveIntent ID sub-module.

The LiveIntent ID sub-module follows the standard _Prebid.js_ initialization based on the GDPR consumer opt-out choices. With regard to CCPA, the LiveConnect JS receives a us_privacy string from the Prebid US Privacy Consent Management Module and respects opt-outs.

## Configure requested attributes

Attributes other than the `nonID` can be requested using the `requestedAttributesOverrides` configuration option.

For example, the configuration below requests the `nonID` as well as `uid2`, the `medianet` ID, the `bidswitch` ID and the `magnite` ID:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: "liveIntentId",
      params: {
        publisherId: "12432415",
        requestedAttributesOverrides: {
          uid2: true,
          medianet: true,
          bidswitch: true,
          magnite: true
        }
      }
    }]
  }
});
```

### Multiple user IDs

The attributes `uid2`, `medianet`, `magnite`, `bidswitch`, `pubmatic`, `openx`, `sovrn`, `index`, `thetradedesk`, `sharethrough`, `sonobi`, `vidazoo`, `zetassp`, `triplelift` and `fpid` are treated specially by LiveIntent's user ID sub-module. Each of these attributes will result in a separate ID returned by the sub-module. Note: `thetradedesk` will be exposed as `tdid` because of historical reasons.

#### Note

* `thetradedesk` will be exposed as `tdid` because of historical reasons.
* In order for `segments` to be present in `ortb2.user.data` of the bid requests, you need to configure the [liveIntentRTDProvider](/dev-docs/modules/liveIntentRtdProvider.html) module. 

For example, in case `uid2` is configured to be requested in addition to the `nonID`, the `request.userId` object would look like the following:

```javascript
{
  // ...
  "lipb" : {
    "lipbid": "sample-nonid-value",
    "uid2" : "sample-uid2-value"
  },
  "uid2" : {
    "id" : "sample-uid2-value"
  }
  //...
}
```

NOTE: `uid2` is exposed as part of `lipb` as well as separately as `uid2`. `medianet`, `magnite`, `bidswitch`, `pubmatic`, `openx`, `sovrn`, `index`, `thetradedesk` (as `tdid`), `sharethrough`, `vidazoo`, `zetassp`, `triplelift` and `fpid` behave the same way.

For the attributes `lipbid` (nonID), `uid2`, `medianet`, `magnite`, `bidswitch`, `pubmatic`, `openx`, `sovrn`, `index`, `thetradedesk` (`tdid`), `sharethrough`, `vidazoo`, `zetassp`, `triplelift` and `fpid` there is also support for their conversion into OpenRTB EIDS format. Please refer to [User ID Module](../userId.md) documentation for more information on conversion, and [Example of eids array generated by UserId Module](https://github.com/prebid/Prebid.js/blob/master/modules/userId/eids.md) for output format examples.

### FPID

The `fpid` is a first party identifier that can be exposed through the liveconnect user ID module. In order to use this functionality tell the module which identifier you want to use as a `fpid` in the config params:

```javascript
{
  "params": {
    "fpid": {
      "strategy": "cookie", // "cookie" | "html5" -- Where the identifier should be read from
      "name": "foobar" // key in the chosen storage backend
    }
  }
}
```

Additionally, add it to the requested attributes:

```javascript
{
    //...
    "params": {
        "fpid": {
          "strategy": "cookie",
          "name": "foobar"
        },
        "requestedAttributesOverrides": {'fpid': true}
    }
    //...
}
```

The user id result will contain both the `fpid` directly in the `lipb` object and separately:

```javascript
{"lipb":{"fpid":"foobar"},"fpid":{"id":"foobar"}}
```

The same applies for the eids:

```javascript
[{"source":"fpid.liveintent.com","uids":[{"id":"foobar","atype":1}]}]
```

NOTE: If COPPA applies, LiveIntent’s user ID module will not return the `fpid`.

### Request uid2

An attribute that requires special mention here is `uid2`. If this attribute is resolved by the ID sub-module, it will be exposed in the same format as from the Unified ID 2.0 user ID module. If both the LiveIntent sub-module and the `uid2` module manage to resolve a `uid2`, the one with the highest priority according to the configuration will be used. See the [Prebid multiple identifiers populated by user id sub-module](../userId.md#prebid-multiple-identifiers-populated-by-user-id-submodule) section of the User ID documentation for more information.

Enabling this option in addition to the `uid2` module is an easy way to increase your `uid2` resolution rates. The following is an example configuration of `uid2` resolution:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: "liveIntentId",
      params: {
        publisherId: "12432415",
        requestedAttributesOverrides: { uid2: true }
      }
    }]
  }
});
```

## LiveIntent ID configuration

{: .alert.alert-info :}
NOTE: For optimal performance, the LiveIntent ID sub-module should be called at every opportunity. It is best not to use `params.storage` with this sub-module as it has its own optimal caching mechanism.

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this sub-module. | `liveIntentId` |
| params | Required | Object | Container of all module params. ||
| params.publisherId |Optional| String | The unique identifier for each publisher (for existing LiveIntent customers)|`12432415`|
| params.distributorId |Optional| String | The unique identifier for each distributor (for existing LiveIntent customers). It will be ignored if `params.liCollectConfig.appId` is provided. |`did-0123`|
| params.ajaxTimeout |Optional| Number |This configuration parameter defines the maximum duration of a call to the `IdentityResolution` endpoint. By default, 5000 milliseconds.|`5000`|
| params.partner | Optional| String |The name of the partner whose data will be returned in the response.|`prebid`|
| params.identifiersToResolve |Optional| Array[String] |Used to send additional identifiers in the request for LiveIntent to resolve against the LiveIntent ID and additional attributes.|`['my-id']`|
| params.requestedAttributesOverrides | Optional | Object | Object containing booleans used to override the default resolution. Attributes set to `true` will be added to the resolved list, while attributes set to `false` will be removed. Valid attributes are `nonId`, `uid2`, `medianet`, `magnite`, `bidswitch`, `pubmatic`, `openx`, `sovrn`, `index`, `thetradedesk` (`tdid`), `sharethrough`, `vidazoo`, `zetassp`, `triplelift`, `segments` and `fpid`. | `{'uid2': true}` |
| params.emailHash |Optional| String |The hashed email address of a user. We can accept the hashes, which use the following hashing algorithms: md5, sha1, sha2.|`1a79a4d60de6718e8e5b326e338ae533`|
| params.ipv4 |Optional| String |The IPv4 address of a user. |`1.2.3.4`|
| params.ipv6 |Optional| String |The IPv6 address of a user. |`2001:db8:3333:4444:5555:6666:7777:8888`|
| params.userAgent |Optional| String |The user agent of a user. Example of a Safari string: |`Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1`|
| params.url | Optional| String |Use this to change the default endpoint URL if you can call the LiveIntent Identity Exchange within your own domain.|`https://idx.my-domain.com`|
| params.liCollectConfig |Optional| Object |Container of all collector params.||
| params.liCollectConfig.fpiStorageStrategy |Optional| String |This parameter defines whether the first-party identifiers that LiveConnect creates and updates are stored in a cookie jar, or in local storage. If nothing is set, default behaviour would be `cookie`. Allowed values: [`cookie`, `ls`, `none`]|`cookie`|
| params.liCollectConfig.ajaxTimeout |Optional| Number |This configuration parameter defines the maximum duration of a call to the collector endpoint. By default, 5000 milliseconds.|`5000`|
| params.liCollectConfig.fpiExpirationDays |Optional| Number |The expiration time of an identifier created and updated by LiveConnect. By default, 730 days.|`729`|
| params.liCollectConfig.collectorUrl |Optional| String |The parameter defines where the signal pixels are pointing to. The params and paths will be defined subsequently. If the parameter is not set, LiveConnect will by default emit the signal towards `https://rp.liadm.com`.| `https://rp.liadm.com`|
| params.liCollectConfig.appId |Optional| String |LiveIntent's media business entity application ID.|`a-0012`|
| params.fpid.name | Optional | String | The parameter is cookie/localstorage key name | `'__super_duper_cookie'`|
| params.fpid.strategy | Optional | String | The parameter defines where to get the identifier from. Either from the cookie jar, `'cookie'`, or from the local storage, `'html5'`. | `'html5'`|
| storage | Required | Object | This object defines where and for how long the results of the call to get a user ID will be stored. | |
| storage.type | Required | String | This parameter defines where the resolved user ID will be stored (either `'cookie'` or `'html5'` localstorage).| `'cookie'` |
| storage.name | Required | String | The name of the cookie or html5 localstorage where the resolved user ID will be stored. | `'pbjs_li_nonid'` |
| storage.expires | Recommended | Integer | How long (in days) the user ID information will be stored. The recommended value is `1` | `1` |

## LiveIntent ID examples

1. To receive the LiveIntent ID, the setup looks like the following example:

    ```javascript
    pbjs.setConfig({
      userSync: {
        userIds: [{
          name: "liveIntentId",
          params: {
            publisherId: "9896876"
          }
        }]
      }
    });
    ```

2. If you are passing additional identifiers that you want to resolve to the LiveIntent ID, add the ID under the `identifiersToResolve` array in the configuration parameters as shown in the following example:

    ```javascript
    pbjs.setConfig({
      userSync: {
        userIds: [{
          name: "liveIntentId",
          params: {
            publisherId: "9896876",
            identifiersToResolve: ["my-own-cookie"]
          }
        }]
      }
    });
    ```

3. If all the supported configuration params are passed, then the setup will look as follows:

    ```javascript
    pbjs.setConfig({
      userSync: {
        userIds: [{
          name: "liveIntentId",
          params: {
            publisherId: "9896876",
            distributorId: "did-0123",
            identifiersToResolve: ["my-own-cookie"],
            requestedAttributesOverrides: { uid2: true, magnite: true, bidswitch: true },
            url: "https://publisher.liveintent.com/idex",
            partner: "prebid",
            ajaxTimeout: 1000,
            liCollectConfig: {
              fpiStorageStrategy: "cookie",
              fpiExpirationDays: 730,
              collectorUrl: "https://rp.liadm.com",
              appId: "a-0012"
            },
            fpid: {
              strategy: "cookie"
              name: "foobar"
            }
          }
        }]
      }
    });
    ```

Please note: the `distributorId` will be ignored when `liCollectConfig.appId` is present.
