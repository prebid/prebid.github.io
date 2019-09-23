---
layout: page_v2
page_type: module
title: Module - User ID
description: Supports multiple cross-vendor user IDs
module_code : userId
display_name : User ID
enable_download : true
sidebarType : 1
---

# User ID Module
{:.no_toc}

* TOC
{:toc}

## Overview

The User ID module supports multiple ways of establishing pseudonymous IDs for users, which is an important way of increasing the value of header bidding. Instead of having several exchanges sync IDs with dozens of demand sources, a publisher can choose to integrate with one of these ID schemes:

* **PubCommon ID** – an ID is generated on the user’s browser and stored for later use on this publisher’s domain.
* **Unified ID** – a simple cross-vendor approach – it calls out to a URL that responds with that user’s ID in one or more ID spaces (e.g. adsrvr.org).
* **DigiTrust ID** – an anonymous cryptographic ID generated in the user’s browser on a digitru.st subdomain and shared across member publisher sites.
* **ID5 ID** - a neutral identifier for digital advertising that can be used by publishers, brands and ad tech platforms (SSPs, DSPs, DMPs, Data Providers, etc.) to eliminate the need for cookie matching.
* **Criteo RTUS ID** – fetches a user id by reaching out to Criteo rtus endpoint for each bidder configured. The result is stored in the user's browser for 1 hour and is passed to bidder adapters to pass it through to SSPs and DSPs that support the ID scheme.
* **Identity Link** – provided by LiveRamp, this module calls out to the ATS (Authenticated Traffic Solution) library or a URL to obtain the user’s IdentityLink envelope.
* **netID** – provides an open, standardized, EU-GDPR compliant, IAB TCF aware, cross-device enabled Advertising Identifier Framework, which can be leveraged by publishers and advertisers (and vendors supporting them) to efficiently deliver targeted advertising bought through programmatic systems.

## How It Works

1. The publisher builds Prebid.js with the optional User ID module and the specific ID sub-module they would like to include. e.g. "gulp build --modules=userId,pubCommonIdSystem"
1. The page defines User ID configuration in `pbjs.setConfig()`
1. When `setConfig()` is called, and if the user has consented to storing IDs locally, the module is invoked to call the URL if needed
   1. If the relevant local storage is present, the module doesn't call the URL and instead parses the scheme-dependent format, injecting the resulting ID into bidRequest.userIds.
1. An object containing one or more IDs (bidRequest.userIds) is made available to Prebid.js adapters and Prebid Server S2S adapters.

Note that User IDs aren't needed in the mobile app world because device ID is available in those ad serving scenarios.

Also note that not all bidder adapters support all forms of user ID. See the tables below for a list of which bidders support which ID schemes.

## User ID, GDPR, and Opt-Out

When paired with the `CookieConsent` module, privacy rules are enforced:

* The module checks the GDPR consent string
* If no consent string is available OR if the user has not consented to Purpose 1 (local storage):
  * Calls to an external user ID vendor are not made.
  * Nothing is stored to cookies or HTML5 local storage.

In addition, individual users may opt-out of receiving cookies and HTML5 local storage by setting these values:

* `_pbjs_id_optout` cookie or HTML5 local storage
* `_pubcid_optout` cookie or HTML5 local storage (for backwards compatibility with the original PubCommonID module.

## Basic Configuration

By including this module and one or more of the sub-modules, a number of new options become available in `setConfig()`,
all of them under the `usersync` object as attributes of the `userIds` array
of sub-objects. The table below has the options that are common across ID systems. See the sections below for specific configuration needed by each system and examples.

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | May be: `"unifiedId"`, `"pubCommonId"`, `"digitrust"`, `"id5id"` or `identityLink` | `"unifiedId"` |
| params | Based on User ID sub-module | Object | | |
| storage | Optional | Object | The publisher can specify some kind of local storage in which to store the results of the call to get the user ID. This can be either cookie or HTML5 storage. This is not needed when `value` is specified or the ID system is managing its own storage | |
| storage.type | Required | String | Must be either `"cookie"` or `"html5"`. This is where the results of the user ID will be stored. | `"cookie"` |
| storage.name | Required | String | The name of the cookie or html5 local storage where the user ID will be stored. | `"_unifiedId"` |
| storage.expires | Optional | Integer | How long (in days) the user ID information will be stored. Default is 30 for UnifiedId and 1825 for PubCommonID | `365` |
| value | Optional | Object | Used only if the page has a separate mechanism for storing a User ID. The value is an object containing the values to be sent to the adapters. | `{"tdid": "1111", "pubcid": {2222}, "id5id": "ID5-12345" }` |

## Unified ID

The Unified ID solution is provided by adsrvr.org and the Trade Desk.

### Unified ID Registration

You can set up Unified ID in one of these ways:

- Register with The Trade Desk from their [Unified ID page](https://www.thetradedesk.com/industry-initiatives/unified-id-solution).
- Utilize a [managed services](/prebid/managed.html) company who can do this for you.

### Unified ID Configuration

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"unifiedId"` | `"unifiedId"` |
| params | Required for UnifiedId | Object | Details for UnifiedId initialization. | |
| params.partner | Either this or url required for UnifiedId | String | This is the partner ID value obtained from registering with The Trade Desk or working with a Prebid.js managed services provider. | `"myTtdPid"` |
| params.url | Required for UnifiedId if not using TradeDesk | String | If specified for UnifiedId, overrides the default Trade Desk URL. | "https://unifiedid.org/somepath?args" |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the Unified ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"tdid": "D6885E90-2A7A-4E0F-87CB-7734ED1B99A3"}` |

### Unified ID Examples

1) Publisher has a partner ID with The Trade Desk, and is using the default endpoint for Unified ID.

{: .alert.alert-warning :}
Bug: The default URL did not support HTTPS in Prebid.js 2.10-2.14. So instead of using
the 'partner' parameter, it's best to supply the Trade Desk URL as shown in this example.

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
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
    usersync: {
        userIds: [{
            name: "unifiedId",
            params: {
                url: "URL_TO_UNIFIED_ID_SERVER"
            },
            storage: {
                type: "html5",
                name: "pbjs-unifiedid"    // set localstorage with this name
            }
        }],
        syncDelay: 3000
    }
});
{% endhighlight %}

3) Publisher has integrated with UnifiedID on their own and wants to pass the UnifiedID directly through to Prebid.js.

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "unifiedId",
            value: {"tdid": "D6885E90-2A7A-4E0F-87CB-7734ED1B99A3"}
        }]
    }
});
{% endhighlight %}

## PubCommon ID

This module stores an unique user id in the first party domain and makes it accessible to all adapters. Similar to IDFA and AAID, this is a simple UUID that can be utilized to improve user matching, especially for iOS and MacOS browsers, and is compatible with ITP (Intelligent Tracking Prevention). It’s lightweight and self contained. Adapters that support Publisher Common ID will be able to pick up the user ID and return it for additional server-side cross device tracking.

There is no special registration or configuration for PubCommon ID.

### PubCommon ID Examples

1) Publisher supports PubCommonID and first party domain cookie storage

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "pubCommonId",
            storage: {
                type: "cookie",
                name: "_pubCommonId",       // create a cookie with this name
                expires: 1825               // expires in 5 years
            }
        }]
    }
});
{% endhighlight %}

2) Publisher supports both UnifiedID and PubCommonID and first party domain cookie storage

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "unifiedId",
            params: {
                partner: "myTtdPid"
            },
            storage: {
                type: "cookie",
                name: "pbjs-unifiedid"       // create a cookie with this name
            }
        },{
            name: "pubCommonId",
            storage: {
                type: "cookie",
                name: "pbjs-pubCommonId"     // create a cookie with this name
            }
        }],
        syncDelay: 5000       // 5 seconds after the first bidRequest()
    }
});
{% endhighlight %}


## DigiTrust

[DigiTrust](https://digitru.st) is a consortium of publishers, exchanges, and DSPs that provide a standard user ID for display advertising similar in concept to ID-for-Ads in the mobile world. Subscribers to the ID service get an anonymous, persistent and secure identifier for publishers and trusted third parties on all browser platforms, including those which do not support third party cookies by default.

### DigiTrust Registration

In order to utilize DigiTrust a publisher must register and be approved for membership. You may register online at: [https://www.digitru.st/signup/](https://www.digitru.st/signup/)

In addition to general usage and configuration of the User Id module, follow the additional instructions for configuring and deploying
DigiTrust as outlined in [DigiTrust Module Usage and Configration](/dev-docs/modules/digitrust.html).

### DigiTrust Configuration

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"digitrust"` | `"digitrust"` |
| params | Required for DigiTrust | Object | Details DigiTrust initialization. | |
| params.init | Required for DigiTrust | Object | Defines the member and site | `{ member: 'example_member_id', site: 'example_site_id' }` |
| params.callback | Optional for DigiTrust | Function | Allows init error handling | See example above |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the DigiTrust ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"digitrustid": {"data":{"id": "1111", ...}}}` |

Please consult the [DigiTrust Module Usage and Configration](/dev-docs/modules/digitrust.html) page for details on
DigiTrust parameters and usage. For more complete instructions please review the
[Prebid Integration Guide for DigiTrust](https://github.com/digi-trust/dt-cdn/wiki/Prebid-Integration-for-DigiTrust-Id)

### DigiTrust Examples

1) Publisher is a DigiTrust member and supports both PubCommonID and DigiTrust ID integrated with Prebid

{% highlight javascript %}
<script>
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "pubCommonId",
            storage: {
                type: "cookie",
                name: "_pubCommonId",       // create a cookie with this name
                expires: 1825               // expires in 5 years
            },
        {
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
    }
    }]
    }
});
</script>
{% endhighlight %}

Other examples:

- [DigiTrust Example 1](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/digitrust_Simple.html)
- [DigiTrust Example 2](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/digitrust_Full.html)

## ID5 ID

The ID5 ID is a neutral identifier for digital advertising that can be used by publishers, brands and ad tech platforms (SSPs, DSPs, DMPs, Data Providers, etc.) to eliminate the need for cookie matching. For more information about the ID5 ID, please visit [our documentation](https://console.id5.io/docs/public/prebid).

### ID5 ID Registration

The ID5 ID is free to use, but requires a simple registration with ID5. Please visit [id5.io/prebid](https://id5.io/prebid) to sign up and request your ID5 Partner Number to get started.

### ID5 ID Configuration

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| params | Required | Object | Details for the ID5 ID. | |
| params.partner | Required | Number | This is the ID5 Partner Number obtained from registering with ID5. | `173` |

{: .alert.alert-info :}
NOTE: The ID5 ID that is delivered to Prebid will be encrypted by ID5 with a rotating key to avoid unauthorized usage and to enforce privacy requirements. Therefore, we strongly recommend setting `storage.expires` to `5` days to ensure all demand partners receive an ID that has been encrypted with the latest key, has up-to-date privacy signals, and allows them to transact against it.

### ID5 ID Examples

1) Publisher wants to retrieve the ID5 ID through Prebid.js

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "id5Id",
            params: {
                partner: 173            // change to the Partner Number you received from ID5
            },
            storage: {
                type: "cookie",
                name: "pbjs-id5id",     // create a cookie with this name
                expires: 5              // cookie can last for 5 days to ensure it is
                                        // encrypted with the latest key from ID5
            }
        }],
        syncDelay: 1000                 // 1 second after the first bidRequest()
    }
});
{% endhighlight %}

2) Publisher has integrated with ID5 on their own and wants to pass the ID5 ID directly through to Prebid.js

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "id5Id",
            value: { "id5id": "ID5-8ekgswyBTQqnkEKy0ErmeQ1GN5wV4pSmA-RE4eRedA" }
        }]
    }
});
{% endhighlight %}

## IdentityLink

The Identity Link solution is provided by liveramp.com

### IdentityLink Registration

Please reach out to [prebid@liveramp.com](mailto:prebid@liveramp.com) and request your `placementId`. 

### IdentityLink Configuration

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"identityLink"` | `"identityLink"` |
| params | Required for Id Link | Object | Details for identityLink initialization. | |
| params.pid | This parameter is required for IdentityLink | String | This is the placementId, value needed for obtaining user’s IdentityLink envelope


### IdentityLink Examples

1) Publisher passes a placement ID and elects to store the IdentityLink envelope in a cookie.


{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "identityLink",
            params: {
                pid: '999'             // Set your real identityLink placement ID here
            },
            storage: {
                type: "cookie",  
                name: "idl_env",       // create a cookie with this name
                expires: 60            // cookie can last for 60 days
            }
        }],
        syncDelay: 3000              // 3 seconds after the first auction
    }
});
{% endhighlight %}

2) Publisher passes a placement ID and elects to store the IdentityLink envelope in HTML5 localStorage.

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "identityLink",
            params: {
                pid: '999'          // Set your real identityLink placement ID here
            },
            storage: {
                type: "html5",
                name: "idl_env"    // set localstorage with this name
            }
        }],
        syncDelay: 3000
    }
});
{% endhighlight %}

## Criteo RTUS

Criteo Real Time User Sync (RTUS) is designed for use as an alternative for platforms that cannot drop their cookies due to Safari 3rd party restriction.

### Criteo RTUS Registration

In order to use a Criteo rtus id a bidder must reach out to Criteo and get their unique client identifier.

### Criteo RTUS Configuration

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] |  Scope   |  Type  |  Description                                                        |  Example             |
|--------------------------------|----------|--------|---------------------------------------------------------------------|----------------------|
| params                         | Required | Object | Details of Criteo ID                                                |                      |
| params.clientIdentifier        | Required | Object | Object containing bidder code as key and client identifier as value | `{ "appnexus": 30 }` |

{: .alert.alert-info :}
NOTE: Criteo user id's max age is 1 hour. Criteo rtus module makes a request to criteo endpoint every hour to fetch new user id. Do not use `params.storage` when adding configuration for criteortus. If you are using multiple id systems then you can use storage (if that id system supports it). Read more about the `storage` property under [Basic Configuration](#basic-configuration).

### Criteo RTUS Example

This example assumes the publisher is working with AppNexus as one of the demand partners and AppNexus has partnered with Criteo.

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "criteortus",
            params: {
              clientIdentifier: {
                "appnexus": 30
              }
            }
        }]
    }
});
{% endhighlight %}


## netID

The [European netID Foundation (EnID)](https://developerzone.netid.de/index.html) aims to establish with the netID an independent European alternative in the digital market for Demand and Supply side. With the netID Single-Sign-On, the EnID established an open standard for consumer logins for services of Buyers and Brands, that also includes user-centric consent management capabilities that results in a standardized, EU-GDPR compliant, IAB TCF aware, cross-device enabled Advertising Identifier, which can be leveraged by publishers and advertisers (and vendors supporting them) to efficiently deliver targeted advertising through programmatic systems to already more than 38 million Europeans on mobile and desktop devices.

The EnID is a non-profit organization which is open to any contributing party on both, the demand and supply side to make identity work for consumers as well as the advertising ecosystem.

### netID Examples

1) Publisher stores netID via his own logic

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "netId",
            value: {
                name: "netId",
                value: {
                    "netId":"5600b800-3b26-44d1-9d94-eabe61322096"
                }
            }
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
| PubCommon ID | n/a | bidRequest.userId.pubcid | `"1111"` |
| Unified ID | Trade Desk | bidRequest.userId.tdid | `"2222"` |
| DigiTrust | IAB | bidRequest.userId.digitrustid | `{data: {id: "DTID", keyv: 4, privacy: {optout: false}, producer: "ABC", version: 2}` |
| ID5 ID | ID5 | bidRequest.userId.id5id | `"ID5-12345"` |
| netID | netID | bidRequest.userId.netId | `"5600b800-3b26-44d1-9d94-eabe61322096"` |

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
            },
            {
                "source": "pubcommon",  // PubCommon ID
                "uids": [{
                    "id":"11111111"
                }]
            },
            {
                "source": "id5id",      // ID5 ID
                "uids": [{
                    "id": "ID5-12345"
                }]
            }
            ],
            "digitrust": {              // DigiTrust
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
