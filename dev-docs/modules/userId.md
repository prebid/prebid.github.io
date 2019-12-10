---
layout: page_v2
page_type: module
title: Module - User ID
description: Supports multiple cross-vendor user IDs
module_code : userId
display_name : User ID (including UnifiedID and PubCommonID)
enable_download : true
sidebarType : 1
---

# User ID Module
{:.no_toc}

* TOC
{:toc}

## Overview

The User ID module supports multiple ways of establishing pseudonymous IDs for users, which is an important way of increasing the value of header bidding. Instead of having several exchanges sync IDs with dozens of demand sources, a publisher can choose to integrate with one of these ID schemes:

* **Criteo ID for Exchanges** –  specific id for Criteo and its partners that enables optimal take rate on all web browsers.
* **DigiTrust ID** – an anonymous cryptographic ID generated in the user’s browser on a digitru.st subdomain and shared across member publisher sites.
* **ID5 Universal ID** - a neutral identifier for digital advertising that can be used by publishers, brands and ad tech platforms (SSPs, DSPs, DMPs, Data Providers, etc.) to eliminate the need for cookie matching.
* **Identity Link** – provided by LiveRamp, this module calls out to the ATS (Authenticated Traffic Solution) library or a URL to obtain the user’s IdentityLink envelope.
* **LiveIntent ID** – fetches a user ID based on identifiers that are present on the page. It calls the LiveIntent Identity Exchange endpoint which resolves the inbound identifiers to a stable ID.
* **Parrable ID** - an encrypted pseudonymous ID that is consistent across all browsers and webviews on a device for every publisher the device visits.  This module contacts Parrable to obtain the Parrable EID belonging to the specific device which can then be used by the bidder.
* **PubCommon ID** – an ID is generated on the user’s browser and stored for later use on this publisher’s domain.
* **Unified ID** – a simple cross-vendor approach – it calls out to a URL that responds with that user’s ID in one or more ID spaces (e.g. adsrvr.org).

## How It Works

1. The publisher builds Prebid.js with the optional User ID module and the specific ID sub-module they would like to include. e.g. "gulp build --modules=userId,pubCommonIdSystem"
1. The page defines User ID configuration in `pbjs.setConfig()`
1. When `setConfig()` is called, and if the user has consented to storing IDs locally, the module is invoked to call the URL if needed
   1. If the relevant local storage is present, the module doesn't call the URL and instead parses the scheme-dependent format, injecting the resulting ID into bidRequest.userIds.
1. An object containing one or more IDs (bidRequest.userIds) is made available to Prebid.js adapters and Prebid Server S2S adapters.

Note that User IDs aren't needed in the mobile app world because device ID is available in those ad serving scenarios.

Also note that not all bidder adapters support all forms of user ID. See the tables below for a list of which bidders support which ID schemes.

## User ID, GDPR, and Opt-Out

When paired with the [Consent Management](/dev-docs/modules/consentManagement.html) module, privacy rules are enforced:

* The module checks the GDPR consent string
* If no consent string is available OR if the user has not consented to Purpose 1 (local storage):
  * Calls to an external user ID vendor are not made.
  * Nothing is stored to cookies or HTML5 local storage.

In addition, individual users may opt-out of receiving cookies and HTML5 local storage by setting these values:

* `_pbjs_id_optout` cookie or HTML5 local storage
* `_pubcid_optout` cookie or HTML5 local storage (for backwards compatibility with the original PubCommonID module.

## Basic Configuration

By including this module and one or more of the sub-modules, a number of new options become available in `setConfig()`,
all of them under the `userSync` object as attributes of the `userIds` array
of sub-objects. The table below has the options that are common across ID systems. See the sections below for specific configuration needed by each system and examples.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | May be: `"criteo"`, `"digitrust"`, `"id5id"`, `identityLink`, `"liveIntentId"`, `"parrableId"`, `"pubCommonId"`,  or `"unifiedId"` | `"unifiedId"` |
| params | Based on User ID sub-module | Object | | |
| storage | Optional | Object | The publisher can specify some kind of local storage in which to store the results of the call to get the user ID. This can be either cookie or HTML5 storage. This is not needed when `value` is specified or the ID system is managing its own storage | |
| storage.type | Required | String | Must be either `"cookie"` or `"html5"`. This is where the results of the user ID will be stored. | `"cookie"` |
| storage.name | Required | String | The name of the cookie or html5 local storage where the user ID will be stored. | `"_unifiedId"` |
| storage.expires | Strongly Recommended | Integer | How long (in days) the user ID information will be stored. If this parameter isn't specified, session cookies are used in cookie-mode, and local storage mode will create new IDs on every page. | `365` |
| storage.refreshInSeconds | Optional | Integer | The amount of time (in seconds) the user ID should be cached in storage before calling the provider again to retrieve a potentially updated value for their user ID. If set, this value should equate to a time period less than the number of days defined in `storage.expires`. By default the ID will not be refreshed until it expires.
| value | Optional | Object | Used only if the page has a separate mechanism for storing a User ID. The value is an object containing the values to be sent to the adapters. | `{"tdid": "1111", "pubcid": {2222}, "id5id": "ID5-12345" }` |

## User ID Sub-Modules

### Criteo ID for Exchanges

Criteo is the leading advertising platform for the Open Internet. The Criteo ID for Exchanges module enables publishers to access Criteo’s unique demand - more than 20.000 advertisers & brands -  to monetize their exchange inventory with an optimal take rate across all browsing environments.
Note that direct access to that demand is also available through [Criteo Direct Bidder](https://www.criteo.com/products/criteo-direct-bidder/), in which case this module is unnecessary.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,criteoIdSystem

#### Criteo ID Configuration

The Criteo ID module does not require any configuration parameters. It should work as-is provided that bidders use it in their adapters.
When calling Criteo RTB, partners should forward this id in the field `user.ext.prebid_criteoid`.

List of the working bidders:
- AppNexus

{: .alert.alert-info :}
NOTE: For optimal performance, the Criteo Id module should be called at every opportunity. It embeds its own optimal caching mechanism. It's best not to use `params.storage` with this module as it may only lower the performances. If you are using multiple id systems, however, you may use it for the other id systems that supports it.

#### Criteo ID Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "criteo",
        }]
    }
});
{% endhighlight %}


### DigiTrust

[DigiTrust](https://www.digitru.st) is a consortium of publishers, exchanges, and DSPs that provide a standard user ID for display advertising similar in concept to ID-for-Ads in the mobile world. Subscribers to the ID service get an anonymous, persistent and secure identifier for publishers and trusted third parties on all browser platforms, including those which do not support third party cookies by default.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,digiTrustIdSystem

#### DigiTrust Registration

In order to utilize DigiTrust a publisher must register and be approved for membership. You may register online at: [https://www.digitru.st/signup/](https://www.digitru.st/signup/)

In addition to general usage and configuration of the User Id module, follow the additional instructions for configuring and deploying
DigiTrust as outlined in [DigiTrust Module Usage and Configration](/dev-docs/modules/digitrust.html).

#### DigiTrust Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"digitrust"` | `"digitrust"` |
| params | Required for DigiTrust | Object | Details DigiTrust initialization. | |
| params.init | Required for DigiTrust | Object | Defines the member and site | `{ member: 'example_member_id', site: 'example_site_id' }` |
| params.callback | Optional for DigiTrust | Function | Allows init error handling | See example above |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the DigiTrust ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"digitrustid": {"data":{"id": "1111", ...}}}` |

Please consult the [DigiTrust Module Usage and Configration](/dev-docs/modules/digitrust.html) page for details on
DigiTrust parameters and usage. For more complete instructions please review the
[Prebid Integration Guide for DigiTrust](https://github.com/digi-trust/dt-cdn/wiki/Prebid-Integration-for-DigiTrust-Id)

#### DigiTrust Examples

1) Publisher is a DigiTrust member and supports both PubCommonID and DigiTrust ID integrated with Prebid

{% highlight javascript %}
<script>
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: "pubCommonId",
      storage: {
        type: "cookie",
        name: "_pubcid",       // create a cookie with this name
        expires: 365           // expires in 1 years
      }
    }, {
      name: "digitrust",
      params: {
        init: {
          member: 'example_member_id',
          site: 'example_site_id'
        },
        callback: function (digiTrustResult) {
          if (digiTrustResult.success) {
            console.log('Success in Digitrust init', digiTrustResult.identity.id);
          } else {
            console.error('Digitrust init failed');
          }
        }
      },
      storage: {
        type: "html5",
        name: "pbjsdigitrust",
        expires: 60
      }
    }]
  }});
</script>
{% endhighlight %}

Other examples:

- [DigiTrust Example 1](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/digitrust_Simple.html)
- [DigiTrust Example 2](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/digitrust_Full.html)

### ID5 Universal ID

The ID5 Universal ID is a shared, neutral identifier that publishers and ad tech platforms can use to recognise users even in environments where 3rd party cookies are not available. The ID5 Universal ID is designed to respect users' privacy choices and publishers’ preferences throughout the advertising value chain. For more information about the ID5 Universal ID, please visit [our documentation](https://console.id5.io/docs/public/prebid). We also recommend that you sign up for our [release notes](https://id5.io/universal-id/release-notes) to stay up-to-date with any changes to the implementation of the ID5 Universal ID in Prebid.

#### ID5 Universal ID Registration

The ID5 Universal ID is free to use, but requires a simple registration with ID5. Please visit [id5.io/universal-id](https://id5.io/universal-id) to sign up and request your ID5 Partner Number to get started.

#### ID5 Universal ID Configuration

First, make sure to add the ID5 submodule to your Prebid.js package with:

{% highlight bash %}
gulp build --modules=userId,id5IdSystem
{% endhighlight %}

The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| params | Required | Object | Details for the ID5 Universal ID. | |
| params.partner | Required | Number | This is the ID5 Partner Number obtained from registering with ID5. | `173` |

{: .alert.alert-info :}
**NOTE:** The ID5 Universal ID that is delivered to Prebid will be encrypted by ID5 with a rotating key to avoid unauthorized usage and to enforce privacy requirements. Therefore, we strongly recommend setting `storage.refreshInSeconds` to `8` hours (`8*3600` seconds) to ensure all demand partners receive an ID that has been encrypted with the latest key, has up-to-date privacy signals, and allows them to transact against it.

#### ID5 Universal ID Examples

1) Publisher wants to retrieve the ID5 Universal ID through Prebid.js

{% highlight javascript %}
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: "id5Id",
      params: {
        partner: 173             // change to the Partner Number you received from ID5
      },
      storage: {
        type: "cookie",
        name: "pbjs-id5id",      // create a cookie with this name
        expires: 90,             // cookie lasts for 90 days
        refreshInSeconds: 8*3600 // refresh ID every 8 hours to ensure it's fresh
      }
    }],
    syncDelay: 1000              // 1 second after the first bidRequest()
  }
});
{% endhighlight %}

2) Publisher has integrated with ID5 on their own (e.g. via the [ID5 API](https://github.com/id5io/id5-api.js)) and wants to pass the ID5 Universal ID directly through to Prebid.js

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "id5Id",
            value: { "id5id": "ID5-8ekgswyBTQqnkEKy0ErmeQ1GN5wV4pSmA-RE4eRedA" }
        }]
    }
});
{% endhighlight %}

### IdentityLink

IdentityLink, provided by [LiveRamp](http://liveramp.com) is a single person-based identifier which allows marketers, platforms and publishers to perform personalized segmentation, targeting and measurement use cases that require a consistent, cross-channel view of the user in anonymous spaces.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,identityLinkIdSystem

#### IdentityLink Registration

Please reach out to [prebid@liveramp.com](mailto:prebid@liveramp.com) and request your `placementId`.

#### IdentityLink Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"identityLink"` | `"identityLink"` |
| params | Required for Id Link | Object | Details for identityLink initialization. | |
| params.pid | This parameter is required for IdentityLink | String | This is the placementId, value needed for obtaining user’s IdentityLink envelope


#### IdentityLink Examples

1) Publisher passes a placement ID and elects to store the IdentityLink envelope in a cookie.


{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "identityLink",
            params: {
                pid: '999'             // Set your real identityLink placement ID here
            },
            storage: {
                type: "cookie",
                name: "idl_env",       // create a cookie with this name
                expires: 30            // cookie can last for 30 days
            }
        }],
        syncDelay: 3000              // 3 seconds after the first auction
    }
});
{% endhighlight %}

2) Publisher passes a placement ID and elects to store the IdentityLink envelope in HTML5 localStorage.

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "identityLink",
            params: {
                pid: '999'          // Set your real identityLink placement ID here
            },
            storage: {
                type: "html5",
                name: "idl_env",    // set localstorage with this name
                expires: 30
            }
        }],
        syncDelay: 3000
    }
});
{% endhighlight %}

### LiveIntent ID

LiveIntent offers audience resolution by leveraging our next-generation identity solutions. The LiveIntent identity graph is built around a people-based set of data that is authenticated daily through active engagements with email newsletters and media across the web. The LiveIntent ID is a user identifier tied to an active, anonymized email hash in our graph that functions in cookie-challenged environments like mobile browsers.

Add LiveIntent ID to your Prebid.js package with:


{: .alert.alert-info :}
gulp build --modules=userId,liveIntentIdSystem

The `request.userId.lipb` object would then look like
```
{
  "lipbid": "T7JiRRvsRAmh88",
  "segments": ["999"]
}
```

The adapters can be implemented to use the lipibid as the identifier, and segments to which that identifier is associated with.

#### LiveIntent ID Registration

To leverage the LiveIntent ID, you need to first set up a first-party cookie sync with LiveIntent. Please reach out to peoplebased@liveintent.com for more information.


#### LiveIntent ID configuration

|Param under userSync.userIds[]|Scope|Type|Description|Example|
|---|:---:|:---:|---:|---:|
|`name`|Required | `String`|The name of this module.|`'liveIntentId'`|
|`params`| Required|`Object`|Container of all module params.||
|`params.publisherId`| Required|`String`| The unique identifier for each publisher.|`'12432415'`|
|`params.partner`| Optional|`String`|The name of the partner whose data will be returned in the response.|`'prebid'`|
|`params.identifiersToResolve`|Optional|`Array[String]`|Used to send additional identifiers in the request for LiveIntent to resolve against the LiveIntent ID.|`['my-id']`|
|`params.url`| Optional|`String`|Use this to change the default endpoint URL if you can call the LiveIntent Identity Exchange within your own domain.|`'//idx.my-domain.com'`|

#### LiveIntent ID examples

1.To receive the LiveIntent ID, the setup looks like this.
```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "liveIntentId",
            params: {
              publisherId: "9896876"
            }
        }]
    }
})
```

2.If you are passing additional identifiers that you want to resolve to the LiveIntent ID, add those under the `identifiersToResolve` array in the configuration parameters.
```
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
})
```

### Parrable ID

The Parrable ID is a Full Device Identifier that can be used to identify a device across different browsers and webviews on a single device including browsers that have third party cookie restrictions.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,parrableIdSystem

#### Parrable ID Registration

Please contact Parrable to obtain a Parrable Partner Client ID and/or use the Parrable Partner Client ID provided by the vendor for each Parrable-aware bid adapter you will be using.  Note that if you are working with multiple Parrable-aware bid adapters you may use multiple Parrable Parter Client IDs.

#### Parrable ID Configuration

In addition to the parameters documented above in the Basic Configuration section the following Parrable specific configuration is required:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| params | Required | Object | Details for the Parrable ID. | |
| params.partner | Required | String | A list of one or more comma-separated Parrable Partner Client IDs for the Parrable-aware bid adapters you are using.  Please obtain Parrable Partner Client IDs from them and/or obtain your own. | `'30182847-e426-4ff9-b2b5-9ca1324ea09b'` |

{: .alert.alert-info :}
NOTE: The Parrable ID that is delivered to Prebid is encrypted by Parrable with a time-based key and updated frequently in the browser to enforce consumer privacy requirements and thus will be different on every page view, even for the same user.

We recommend setting `storage.expires` to no more than`364` days, which is the default cookie expiration that Parrable uses in the standalone Parrable integration.

#### Parrable ID Examples

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: `'parrableId'`,
            params: {
                partner: `'30182847-e426-4ff9-b2b5-9ca1324ea09b'`  // change to the Parrable Partner Client ID(s) you received from the Parrable Partners you are using
            },
            storage: {
                type: `'cookie'`,
                name: `'_parrable_eid'`,     // create a cookie with this name
                expires: 364               // cookie can last for up to 1 year
            }
        }],
        syncDelay: 1000
    }
});
{% endhighlight %}

### PubCommon ID

This module stores an unique user id in the first party domain and makes it accessible to all adapters. Similar to IDFA and AAID, this is a simple UUID that can be utilized to improve user matching, especially for iOS and MacOS browsers, and is compatible with ITP (Intelligent Tracking Prevention). It’s lightweight and self contained. Adapters that support Publisher Common ID will be able to pick up the user ID and return it for additional server-side cross device tracking.

There is no special registration or configuration for PubCommon ID.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId

{: .alert.alert-warning :}
For historic reasons, PubCommon is bundled with the User ID module in Prebid.js 1.x and 2.x. This will change in Prebid.js 3.0, which will require specifically adding pubCommonIdSystem to the gulp build command

#### PubCommon ID Examples

1) Publisher supports PubCommonID and first party domain cookie storage

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "pubCommonId",
            storage: {
                type: "cookie",
                name: "_pubcid",         // create a cookie with this name
                expires: 365             // expires in 1 years
            }
        }]
    }
});
{% endhighlight %}

2) Publisher supports both UnifiedID and PubCommonID and first party domain cookie storage

{% highlight javascript %}
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
            name: "pubCommonId",
            storage: {
                type: "cookie",
                name: "_pubcid",     // create a cookie with this name
                expires: 180
            }
        }],
        syncDelay: 5000       // 5 seconds after the first bidRequest()
    }
});
{% endhighlight %}



### Unified ID

The Unified ID solution is provided by adsrvr.org and the Trade Desk.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId

{: .alert.alert-warning :}
For historic reasons, Unified ID is bundled with the User ID module in Prebid.js 1.x and 2.x. This will change in Prebid.js 3.0, which will require specifically adding unifiedIdSystem to the gulp build command


#### Unified ID Registration

You can set up Unified ID in one of these ways:

- Register with The Trade Desk from their [Unified ID page](https://www.thetradedesk.com/industry-initiatives/unified-id-solution).
- Utilize a [managed services](/prebid/managed.html) company who can do this for you.

#### Unified ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"unifiedId"` | `"unifiedId"` |
| params | Required for UnifiedId | Object | Details for UnifiedId initialization. | |
| params.partner | Either this or url required for UnifiedId | String | This is the partner ID value obtained from registering with The Trade Desk or working with a Prebid.js managed services provider. | `"myTtdPid"` |
| params.url | Required for UnifiedId if not using TradeDesk | String | If specified for UnifiedId, overrides the default Trade Desk URL. | "https://unifiedid.org/somepath?args" |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the Unified ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"tdid": "D6885E90-2A7A-4E0F-87CB-7734ED1B99A3"}` |

#### Unified ID Examples

1) Publisher has a partner ID with The Trade Desk, and is using the default endpoint for Unified ID.

{: .alert.alert-warning :}
Bug: The default URL did not support HTTPS in Prebid.js 2.10-2.14. So instead of using
the 'partner' parameter, it's best to supply the Trade Desk URL as shown in this example.

{% highlight javascript %}
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
{% endhighlight %}

2) Publisher supports UnifiedID with a vendor other than Trade Desk and HTML5 local storage.

{% highlight javascript %}
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
{% endhighlight %}

3) Publisher has integrated with UnifiedID on their own and wants to pass the UnifiedID directly through to Prebid.js.

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "unifiedId",
            value: {"tdid": "D6885E90-2A7A-4E0F-87CB-7734ED1B99A3"}
        }]
    }
});
{% endhighlight %}


## Adapters Supporting the User ID Sub-Modules

{% assign bidder_pages = site.pages | where: "layout", "bidder" %}

<table class="pbTable">
<tr class="pbTr"><th class="pbTh">Bidder</th><th class="pbTh">IDs Supported</th></tr>
{% for item in bidder_pages %}
{% if item.userIds != nil %}
<tr class="pbTr"><td class="pbTd">{{item.biddercode}}</td><td class="pbTd">{{item.userIds}}</td></tr>
{% endif %}
{% endfor %}
</table>

## Bidder Adapter Implementation

### Prebid.js Adapters

Bidders that want to support the User ID module in Prebid.js, need to update their bidder adapter to read the indicated bidRequest attributes and pass them to their endpoint.

{: .table .table-bordered .table-striped }
| ID System Name | ID System Host | Prebid.js Attr | Example Value |
| --- | --- | --- | --- | --- | --- |
| CriteoID | Criteo | bidRequest.userId.criteoId | `"1111"` |
| DigiTrust | IAB | bidRequest.userId.digitrustid | `{data: {id: "DTID", keyv: 4, privacy: {optout: false}, producer: "ABC", version: 2}` |
| ID5 ID | ID5 | bidRequest.userId.id5id | `"1111"` |
| IdentityLink | Trade Desk | bidRequest.userId.idl_env | `"1111"` |
| LiveIntent ID | Live Intent | bidRequest.userId.lipb.lipbid | `"1111"` |
| Parrable ID | Parrable | bidRequest.userId.parrableid | `"eidVersion.encryptionKeyReference.encryptedValue"` |
| PubCommon ID | n/a | bidRequest.userId.pubcid | `"1111"` |
| Unified ID | Trade Desk | bidRequest.userId.tdid | `"1111"` |

For example, the adapter code might do something like:

{% highlight javascript %}
   if (bidRequest.userId && bidRequest.userId.pubcid) {
    url+="&pubcid="+bidRequest.userId.pubcid;
   }
{% endhighlight %}

### Prebid Server Adapters

Bidders that want to support the User ID module in Prebid Server, need to update their server-side bid adapter to read the desired OpenRTB attributes noted in the example below and send them to their endpoint.

{% highlight bash %}
{
    "user": {
        "ext": {
            "eids": [{
                "source": "adserver.org",  // Unified ID
                "uids": [{
                    "id": "111111111111",
                    "ext": {
                        "rtiPartner": "TDID"
                    }
                }]
            },{
                "source": "pubcommon",
                "uids": [{
                    "id":"11111111"
                }]
            },
            {
                "source": "id5-sync.com",
                "uids": [{
                    "id": "ID5-12345"
                }]
            },
            {
                source: "parrable.com",
                uids: [{
                    id: "01.1563917337.test-eid"
                }]
            },{
                "source": "identityLink",
                "uids": [{
                    "id": "11111111"
                }]
            },{
                "source": "criteo",
                "uids": [{
                    "id": "11111111"
                }]
            },{
                "source": "liveintent.com",
                "uids": [{
                    "id": "11111111"
                }]
            }],
            "digitrust": {              // DigiTrust is not in the eids section
                "id": "11111111111",
                "keyv": 4
            }
        }
    }
}
{% endhighlight %}

### ID Providers

If you're an ID provider that wants to get on this page:

- Fork Prebid.js and write a sub-module similar to one of the *IdSystem modules already in the [modules](https://github.com/prebid/Prebid.js/tree/master/modules) folder.
- Follow all the guidelines in the [contribution page](https://github.com/prebid/Prebid.js/blob/master/CONTRIBUTING.md).
- Submit a Pull Request against the [Prebid.js repository](https://github.com/prebid/Prebid.js).
- Fork the prebid.org [documentation repository](https://github.com/prebid/prebid.github.io), modify the /dev-docs/modules/userId.md, and submit a documentation Pull Request as well.

<a name="getUserIds"></a>

### Exporting User IDs

If you need to export the user IDs stored by Prebid User ID module, the `getUserIds()` function will return an object formatted the same as bidRequest.userId.

```
pbjs.getUserIds() // returns object like bidRequest.userId. e.g. {"pubcid":"1111", "tdid":"2222"}
```

## Passing UserIds to Google Ad Manager for targeting

User IDs from Prebid User ID module can be passed to GAM for targeting in Google Ad Manager or to pass ahead in Google Exchange Bidding using ```userIdTargeting``` module. More details can be found [here](https://github.com/prebid/Prebid.js/blob/master/modules/userIdTargeting.md). In short, you just need to add the optional userIdTargeting sub-module into your `gulp build` command and the additional `userIdTargeting` config becomes available.

## Further Reading

* [Prebid.js Usersync](/dev-docs/publisher-api-reference.html#setConfig-Configure-User-Syncing)
* [GDPR ConsentManagement Module](/dev-docs/modules/consentManagement.html)
* [DigiTrust Module Usage and Configration](/dev-docs/modules/digitrust.html)
