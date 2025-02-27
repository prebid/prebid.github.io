---
layout: page_v2
title: How to Add a New Prebid.js User ID Module
description: Documentation on how to add a Prebid.js new user ID module
top_nav_section: dev_docs
nav_section: adapters
sidebarType: 1
---

# How to Add a New Prebid.js User ID Module
{: .no_toc }

* TOC
{:toc}

## Overview

A user ID module is responsible for providing user ID data to Prebid.js. The flow is as follows:

1. The publisher includes and configures your module as described in [Module - User ID](/dev-docs/modules/userId.html);
2. Prebid.js determines whether your ID should be included, depending on [consent management](/support/privacy-resources.html) or other [activity controls](/dev-docs/activity-controls.html);
3. If it is, it invokes your module's `getId` and `decode` methods to obtain an ID, and uses your `eids` configuration to transform it into an ORTB [EID](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md#objecteid) object;
4. Prebid.js then stores your ID (optionally and depending on the publisher's [storage configuration](/dev-docs/modules/userId.html#basic-configuration)) and injects it into the bid stream;
5. On subsequent sessions, Prebid.js retrieves your ID from storage (if applicable) and repeats this flow using `extendId` instead of `getId`.

## Module interface

A user ID module is a javascript file in the [modules](https://github.com/prebid/Prebid.js/tree/master/modules) folder that:

* has a file name that ends with 'IdSystem.js';
* is listed as a userID submodule in [.submodules.json](https://github.com/prebid/Prebid.js/blob/master/modules/.submodules.json);
* registers a module object using `submodule('userId', userIdSpec)`.

`userIdSpec` has the following properties:

{: .table .table-bordered .table-striped }
| Property   | Scope                              | Type   | Description                                                                                                   | 
|------------|------------------------------------|--------|---------------------------------------------------------------------------------------------------------------|
| `name`     | Required                           | String | Name of your ID provider, used to match your module with the publisher's [userIds configuration](/dev-docs/modules/userId.html#basic-configuration)            |
| `gvlid`    | Optional                           | Number | GVL ID to use for TCF. If omitted your module may be be excluded when TCF is in scope.                        |
| `getId`    | Required                           | Function | Retrieve serializable ID data, see [`getId`](#getId)                                                          |
| `extendId` | Optional                           | Function | Update previously stored ID data, see [`extendId`](#extendId)                                                 |
| `decode`  | Required                           | Function | Decode result from `getId` or `extendId`, see [`decode`](#decode)                                             |
| `eids`    | Optional, but strongly recommended | Object   | One or more [EID configurations](#eidConfig) used to translate the result from `decode` into ORTB EID Objects |

See [SharedIdSystem](https://github.com/prebid/Prebid.js/blob/master/modules/sharedIdSystem.js) for an example.

<a id="getId"></a>

### `getId(config, consentData, storedId)`

Invoked when:

* Prebid.js did not previously store your ID, or
* your previously stored ID has expired (depending on the publisher's `expires` and/or `refreshInSeconds`[storage configuration](/dev-docs/modules/userId.html#basic-configuration)), or
* consent data has changed since the last time it was stored, or
* the publisher explicitly asked for a refresh using [`refreshUserIds`](/dev-docs/publisher-api-reference/refreshUserIds.html).
 
#### Arguments

{: .table .table-bordered .table-striped }
 | Name                | Type   | Description                                                                                                                   | 
 |---------------------|--------|-------------------------------------------------------------------------------------------------------------------------------|
 | `config`            | Object | Configuration for your module as provided by the publisher                                                                    |
 | `consentData`       | Object |                                                                                                                               |
 | `consentData.gdpr`  | Object | TCF consent data when [consentManagementTcf](/dev-docs/modules/consentManagementTcf.html) is included, or null otherwise      |
 | `consentData.gpp`   | Object | GPP consent data when [consentManagementGpp](/dev-docs/modules/consentManagementGpp.html) is included, or null otherwise      |
 | `consentData.usp`   | String  | US Privacy string when [consentManagementUsp](/dev-docs/modules/consentManagementUsp.html) is included, or null otherwise     |
 | `consentData.coppa` | Boolean | COPPA flag as set by [publisher configuration](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#coppa) |
 | `storedId`          | String or Object | Your previously stored ID data, if any, as was returned by `getId` or `extendId`                                    |

#### Return value

`getId` should return an object containing one or both of:

{: .table .table-bordered .table-striped }
| Property    | Type | Description                                                                       |
|-------------|------|-----------------------------------------------------------------------------------|
| `id`        | String or Object | Serializable ID data. Objects will be passed through `JSON.stringify`             | 
| `callback`  | Function | Invoked at a later point with another callback function `setId` as first argument |

If your module can provide ID data synchronously it should set `id` directly;
otherwise it should provide a `callback` that calls its first argument `setId` passing it ID data. 

In both cases ID data should be a string or a plain, serializable JS object; this data is what may then get stored, passed to [`decode`](#decode) and, on later sessions, to `getId` or `extendId` as the `storedId` argument.    

#### Example: synchronous ID generation

```javascript
function getId(config, consentData, storedId) {
   return {id: storedId || generateUUID()}
}
```

#### Example: aynschronous ID retrieval

```javascript
function getId(config, consentData, storedId) {
    return {
        callback: function(setId) {
            fetch(ENDPOINT_URL, {
                body: JSON.stringify({
                    params: config.params,
                    consentData
                })
            }).then(async function(response) {
                if (reponse.ok) {
                    setId((await response.json()).id);
                }
            });
        }
    }
}
```

<a id="extendId"></a>

### `extendId(config, consentData, storedId)`

If provided, it's invoked when `getId` is not; namely:

* Prebid.js previously stored your ID, and
* the stored ID has not expired, and
* consent data has not changed since it was stored, and
* the publisher is not asking for a refresh.
 
Takes the same arguments and should return an object in the same format as [getId](#getId).

<a id="decode"></a>

### `decode(data, config)`

Decode ID data. Invoked every time data from your module is available, either from storage or `getId` / `extendId`. 

Arguments are:

{: .table .table-bordered .table-striped }
| Name     | Type               | Description                                    |
|----------|--------------------|------------------------------------------------|
| `data`   | String or Object  | ID data as provided by `getId` / `extendId`     |
| `config` | Object | Configuration for your module as provided by the publisher |

Should return an object with at least one entry where the key is an identifier for your ID provider and the value is the ID (which can have any type or structure).

The return value is what's made available to publishers through [`getUserIds()`](/dev-docs/publisher-api-reference/getUserIds.html) and to bid adapters in `bidRequest.userId`; it's also used to generate EIDs using your [EID configuration](#eidConfig).

For example:

```javascript
function decode(data, config) {
    return {exampleId: data};
}
```

would populate `bidRequest.userId.exampleId` and `pbjs.getUserIds().exampleId` with the ID as provided by `getId`; and would be used to generate EIDs your module's `eids.exampleId` configuration.

<a id="eidConfig"></a>

### EID configuration

For each `key` and `idValue` entry in the object returned by `decode`, Prebid.js will:
 
* Normalize `idValue` into an array `idValues`, which is either the same as `idValue` if that's already an array, or an array containing a single member `idValue`;
* look for a matching `key` in `eids` and, if present, use the corresponding value `eidConfig` to translate `idValues` into EID Objects;

`eidConfig` can be either a function or an object. 

#### EID translation functions

If a function, `eidConfig` is invoked with:

{: .table .table-bordered .table-striped }
| Name       | Type | Description                                                        |
|------------|------|--------------------------------------------------------------------|
| `idValues` | Array | ID values from `decode`, normalized to an array as described above |
| `config` | Object | Configuration for your module as provided by the publisher |

It should return an object or array of objects in the [ORTB EID](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md#objecteid) format.

Example:

```javascript
exampleIdSpec.eids = {
    exampleId: function(idValues, config) {
        return {
            source: 'exampleId.com',
            uid: idValues.map(value => ({
                id: value,
                atype: 1
            }))
        };
    }
}
```

#### EID configuration objects

If an object, `eidConfig` should contain:

{: .table .table-bordered .table-striped }
| Property    | Scope                                   | Type     | Description                                                                                                              | 
|-------------|-----------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------|
| `source`    | Required if `getSource` is not provided | String   | Value for `eid.source`                                                                                                   |
| `getSource` | Required if `source` is not provided    | Function | Returns a string to use for `eid.source`                                                                                 |
| `getEidExt` | Optional                                | Function | Returns an object to use for `eid.ext`                                                                                   |                                                                                      
| `getValue`  | Optional                                | Function | Returns a string to use for `eid.uid.id`. If not provided, members of `idValues` must be strings, and will be used as-is |
| `atype`     | Optional, but recommended               | Number   | Value for `eid.uid.atype`                                                                                                |
| `getUidExt` | Optional                                | Function | Returns an object to use for `eids.uid.ext`                                                                              |

All functions are invoked once for - and passed as an argument - each element in `idValues`.

Example:

```javascript
exampleIdSpec.eids = {
    exampleId: {
        source: 'exampleId.com',
        atype: 1
    }
}
```
