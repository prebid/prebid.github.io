---
layout: userid
title: PubProvided ID
description: PubProvided ID User ID sub-module
useridmodule: pubProvidedIdSystem
---


The PubProvided Id module allows publishers to set and pass a first party user id into the bid stream. This module has several unique characteristics:

1. The module supports a user defined function, that generates an eids-style object:

```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "pubProvidedId",
            params: {
                eidsFunction: getIdsFn   // any function that exists in the page
            }
        }]
    }
});
```

Or, the eids values can be passed directly into the `setConfig` call:
```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "pubProvidedId",
            params: {
                eids: [{
                    source: "domain.com",
                    uids: [{
                        id: "value read from cookie or local storage",
                        atype: 1,
                        ext: {
                            stype: "ppuid"
                        }

                    }]
                }, {
                    source: "3rdpartyprovided.com",
                    uids: [{
                        id: "value read from cookie or local storage",
                        atype: 3,
                        ext: {
                            stype: "dmp"
                        }
                    }]
                }]
            }
        }]
    }
});
```

In either case, bid adapters will receive the eid values after consent is validated.

2. This design allows for the setting of any number of uuids in the eids object. Publishers may work with multiple ID providers and nest their own id within the same eids object.  The opportunity to link a 1st party uuid and a 3rd party generated UUID presents publishers with a unique ability to address their users in a way demand sources will understand.

3. Finally, this module allows publishers to broadcast their user id, derived from in-house tech, directly to buyers within the confines of existing compliance (CCPA & GDPR) frameworks.

4. The `eids.uids.ext.stype` "source-type" extension helps downstream entities know what do with the data. Currently defined values are:

- dmp - this uid comes from the in-page dmp named in eids.source
- ppuid - this uid comes from the publisher named in eids.source
- other - for setting other id origin signals please use the [adCOM!](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/master/AdCOM%20v1.0%20FINAL.md#object--extended-identifier-uids-) `atype` spec

5. Bid adapters listening for "userIds.pubProvidedId" will not receive a string, please use the userIdAsEids value/function to return the userid as a string.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=pubProvidedIdSystem


## PubProvided Configuration

{: .table .table-bordered .table-striped }
| Params under usersync.userIds[]| Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the ID module  | `"PubProvided"` |
| params | Optional | Object | Details for syncing. | |
| params.eidsFunction | Optional | function | any function that exists in the page | getIdsFn() |
| uids.atype | optional | int | ADCOM - Type of user agent the match is from | `"1"` |
| uids.ext.stype | Optional | String | Description of how the id was generated and by whom ('ppuid','DMP','other') | `DMP` |
