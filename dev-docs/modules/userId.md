---
layout: page_v2
page_type: module
title: Module - User ID
description: Vendor-specific user ID sub-modules are available to support a range of identification approaches.
module_code : userId
display_name : User ID
enable_download : false
sidebarType : 1
---

# User ID Module
{:.no_toc}

* TOC
{:toc}

## Overview

The User ID module supports multiple ways of establishing pseudonymous IDs for users, which is an important way of increasing the value of header bidding. Instead of having several exchanges sync IDs with dozens of demand sources, a publisher can choose to integrate with any of a number of ID schemes.

## How It Works

1. The publisher determines which user ID modules to add to their Prebid.js package and consults with their legal counsel to determine the appropriate user disclosures.
1. The publisher builds Prebid.js by specifying one or more ID sub-modules they would like to include. e.g. "gulp build --modules=____IdSystem". You also need to add the `userId` module to your Prebid.js distribution.
1. The page defines User ID configuration in `pbjs.setConfig()`
1. When `setConfig()` is called, and if the user has consented to storing IDs locally, the module is invoked to call the URL if needed
   1. If the relevant local storage is present, the module doesn't call the URL and instead parses the scheme-dependent format, injecting the resulting ID into `bidRequest.userId`.
   1. If GDPR applies, the consent signal from the CMP is hashed and stored in a cookie called `_pbjs_userid_consent_data`. This is required so that ID sub-modules may be called to refresh their ID if the user's consent preferences have changed from the previous page, and ensures cached IDs are no longer used if consent is withdrawn.
1. An object containing one or more IDs (`bidRequest.userId`) is made available to Prebid.js adapters and Prebid Server S2S adapters.
1. In addition to `bidRequest.userId`, `bidRequest.userIdAsEids` is made available to Prebid.js adapters and Prebid Server S2S adapters. `bidRequest.userIdAsEids` has userIds in ORTB EIDS format.
1. The page can call [pbjs.getUserIds()](/dev-docs/publisher-api-reference/getUserIds.html), [pbjs.getUserIdsAsEids()](/dev-docs/publisher-api-reference/getUserIdsAsEids.html), or [pbjs.getUserIdsAsync()](/dev-docs/publisher-api-reference/getUserIdsAsync.html).

{: .alert.alert-info :}
Note: If your ID structure is complicated, it is helpful to add tests for pbjs.getUserIds(), pbjs.getUserIdsAsEids() and pbjs.getUserIdsAsync().

{: .alert.alert-info :}
Note: To add a custom data type for the response of pbjs.getUserIdsAsEids(), see other examples within the createEidsArray method in /modules/userId/eid.js

{: .alert.alert-info :}
Note that User IDs aren't needed in the mobile app world because device ID is available in those ad serving scenarios.

{: .alert.alert-info :}
Note that not all bidder adapters support all forms of user ID. See the tables below for a list of which bidders support which ID schemes.

{: .alert.alert-info :}
As of Prebid 4.0, this module will attempt storage in the main domain of the publisher's website instead of a subdomain, unless this behavior is overriden by a submodule.

## User ID, GDPR, Permissions, and Opt-Out

When paired with the [Consent Management](/dev-docs/modules/consentManagement.html) module, privacy rules are enforced:

* The module checks the GDPR consent string
* If no consent string is available OR if the user has not consented to Purpose 1 (local storage):
  * Calls to an external user ID vendor are not made.
  * Nothing is stored to cookies or HTML5 local storage.

In addition, individual users may opt-out of receiving cookies and HTML5 local storage by setting these values:

* `_pbjs_id_optout` cookie or HTML5 local storage. The value can be anything -- if it exists, the user is considered opted out and no userId modules will fire.
* `_pubcid_optout` cookie or HTML5 local storage. This is for backwards compatibility with the original PubCommonID module, as of 5.0 known as the SharedId module. Likewise, the value can be anything.

### Publisher First Party Opt-Out

Without third-party cookies, mechanisms like the [NAI](https://optout.networkadvertising.org) don't work, so some publishers may want to implement a first party opt-out so their users aren't tagged with first party cookies containing IDs.

Publishers that want to do this should design their workflow and then set `_pbjs_id_optout` cookie or HTML5 local storage. For instance:

- read from an in-page javascript variable and set `_pbjs_id_optout` to any value.
- call an in-page function and use the results to create a `_pbjs_id_optout` cookie with any value.


## Basic Configuration

By including this module and one or more of the sub-modules, a number of new options become available in `setConfig()`,
under the `userSync` object as attributes of the `userIds` array
of sub-objects.

Publishers using Google AdManager may want to sync one of the identifiers as their Google PPID for frequency capping or reporting.
The PPID in GAM (which is unrelated to the PPID UserId Submodule) has strict rules; refer to [Google AdManager documentation](https://support.google.com/admanager/answer/2880055?hl=en) for them. Please note, Prebid uses a [GPT command](https://developers.google.com/publisher-tag/reference#googletag.PubAdsService) to sync identifiers for publisher convenience. It doesn't currently work for instream video requests, as Prebid typically interacts with the player, which in turn may interact with IMA. IMA does has a [similar method](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.ImaSdkSettings#setPpid) as GPT, but IMA does not gather this ID from GPT.

{: .table .table-bordered .table-striped }
| Param under userSync | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| ppid | Optional | String | Must be a source from the [pbjs.getUserIdsAsEids()](#getUserIdsAsEids) array | `"pubcid.org"` |

The table below has the options that are common across ID systems. See the sections below for specific configuration needed by each system and examples.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | May be: `"33acrossId"`, `"admixerId"`, `"qid"`, `"adtelligentId"`, `"amxId"`, `"britepoolId"`, `"criteo"`, `"fabrickId"`, `"hadronId"`, `"id5id"`, `identityLink`, `"idx"`, `"intentIqId"`, `"justId"`, `"liveIntentId"`, `"lotamePanoramaId"`, `"merkleId"`, `"naveggId"`, `"mwOpenLinkId"`, `"netId"`, `"novatiqId"`, `"parrableId"`, `"quantcastId"`, `"pubProvidedId"`, `"sharedId"`, `"tapadId"`, `"teadsId"`, `"unifiedId"`,`"uid2"`, `"verizonMediaId"`, `"zeotapIdPlus"` | `"unifiedId"`
| params | Based on User ID sub-module | Object | | |
| bidders | Optional | Array of Strings | An array of bidder codes to which this user ID may be sent. | `['bidderA', 'bidderB']` |
| storage | Optional | Object | The publisher can specify some kind of local storage in which to store the results of the call to get the user ID. This can be either cookie or HTML5 storage. This is not needed when `value` is specified or the ID system is managing its own storage | |
| storage.type | Required | String | Must be either `"cookie"` or `"html5"`. This is where the results of the user ID will be stored. | `"cookie"` |
| storage.name | Required | String | The name of the cookie or html5 local storage where the user ID will be stored. | `"_unifiedId"` |
| storage.expires | Strongly Recommended | Integer | How long (in days) the user ID information will be stored. If this parameter isn't specified, session cookies are used in cookie-mode, and local storage mode will create new IDs on every page. | `365` |
| storage.refreshInSeconds | Optional | Integer | The amount of time (in seconds) the user ID should be cached in storage before calling the provider again to retrieve a potentially updated value for their user ID. If set, this value should equate to a time period less than the number of days defined in `storage.expires`. By default the ID will not be refreshed until it expires.
| value | Optional | Object | Used only if the page has a separate mechanism for storing a User ID. The value is an object containing the values to be sent to the adapters. | `{"tdid": "1111", "IDP": "IDP-2233", "id5id": {"uid": "ID5-12345"}}` |

## Permissions
Publishers can control which user ids are shared with the bid adapters they choose to work with by using the bidders array.  The bidders array is part of the User id module config, publisher may choose to send an id to some bidders but not all, the default behavior is that each user id go to all bid adapters the publisher is working with.

Use the optional `bidders` parameter to define an array of bidder codes to which this user ID may be sent.

In this example the SharedID sub adapter is only allowed to be sent to the Rubicon adapter.
```
userIds: [
  {
    name: "sharedId",
    bidders: [
      'rubicon'
    ],
    params: {
      syncTime: 60,      // in seconds
      defaultis24hours
    },
    storage: {
      type: "cookie",
      name: "sharedid",
      expires: 28        // in days
    }
  }
]
```
The Rubicon bid adapter would then receive
```
{
  "bidder": "rubicon",
  ...
  "userId": {
    "sharedid": {
      "id": "01*******",
      "third": "01E*******"
    }
  },
  "userIdAsEids": [
    {
      "source": "sharedid.org",
      "uids": [
        {
          "id": "01**********",
          "atype": 1,
          "ext": {
            "third": "01***********"
          }
        }
      ]
    }
  ],
  ...
}
```

## User ID Sub-Modules

### 33Across ID

The 33Across User ID sub-module is a way for publishers to monetize their cookieless inventory across multiple supply-side platforms via Prebid.JS. The sub-module provides publishers with addressability for their open marketplace cookieless inventory and access to cookieless demand. The 33Across User ID sub-module utilizes Lexicon technology to connect Publishers to Demand partners via proprietary technologies in a probabilistic and privacy-safe manner. Please contact [PrebidUIM@33across.com](mailto:PrebidUIM@33across.com) to get your authorization process started.

#### 33Across ID Configuration

Please make sure to add the 33across user ID sub-module to your Prebid.js package with:

```shell
gulp build --modules=33acrossIdSystem,userId
```

The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this sub-module | `"33acrossId"` |
| params ||| Details for the sub-module initialization ||
| params.pid | Required | String | Partner ID (PID) | Please reach out to [PrebidUIM@33across.com](mailto:PrebidUIM@33across.com) and request your PID |
| storage |||||
| storage.name | Required | String | The name of the cookie or html5 local storage key | `"33acrossId"` (recommended) |
| storage.type | Required | String | This is where the 33across user ID will be stored | `"html5"` (recommended) or `"cookie"` |
| storage.expires | Strongly Recommended | Number | How long (in days) the user ID information will be stored | `90` (recommended) |
| storage.refreshInSeconds | Strongly Recommended | Number | How many seconds until the ID is refreshed | `8 * 3600` (recommended) |

#### 33Across ID Example
```
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: "33acrossId",
      params: {
        pid: "0010b00002GYU4eBAH" // Example ID
      },
      storage: {
        name: "33acrossId",
        type: "html5",
        expires: 90,
        refreshInSeconds: 8 * 3600
      }
    }]
  }
});
```


### AdmixerID

Admixer ID, provided by [Admixer](https://admixer.com/), is a universal ID solution that doesn't rely on 3rd party cookies and helps publishers and advertisers to recognize users across various browsers and environments.  Our sub adapter takes deterministic signals like email and phone as input and returns an anonymous id that unlocks access to a wide range of Admixer's demand sources, amplifying audience segmentation, targeting and measurement.

The Admixer privacy policy is at https://admixer.com/privacy/

Add Admixer ID module to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=admixerIdSystem

#### AdmixerID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"admixerId"` | `"admixerId"` |
| params | Required | Object | Details for admixer initialization. | |
| params.pid | Optional | String | id provided by admixer | "458frgde-djd7-3ert-gyhu-12fghy76dnmko" |
| params.e | Optional | String | The hashed email address of a user. We can accept the hashes, which use the following hashing algorithms: md5, sha1, sha256. | "3d400b57e069c993babea0bd9efa79e5dc698e16c042686569faae20391fd7ea" |
| params.p | Optional | String | The hashed phone number of a user. We can accept the hashes, which use the following hashing algorithms: md5, sha1, sha256. | "05de6c07eb3ea4bce45adca4e0182e771d80fbb99e12401416ca84ddf94c3eb9" |

#### AdmixerID Examples

1) Individual params may be set for the Admixer ID Submodule.

{% highlight javascript %}
   pbjs.setConfig({
       userSync: {
           userIds: [{
               name: "admixerId",
               storage: {
                   name: "admixerId",
                   type: "cookie",
                   expires: 30
               },
               params: {
                   pid: "4D393FAC-B6BB-4E19-8396-0A4813607316", // example id
                   e: "3d400b57e069c993babea0bd9efa79e5dc698e16c042686569faae20391fd7ea", // example hashed email (sha256)
                   p: "05de6c07eb3ea4bce45adca4e0182e771d80fbb99e12401416ca84ddf94c3eb9" //example hashed phone (sha256)
               }
           }],
           auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
       }
   });
{% endhighlight %}

### adQuery QiD

The adQuery QiD is a first-party identifier designed for publishers using the Adquery adapter. For more information please contact [prebid@adquery.io](prebid@adquery.io)

#### adQuery QiD Configuration

First, add the adQuery QiD module to your Prebid.js build:

```shell
gulp build --modules=userId,adqueryIdSystem
```

Then configure the qui in your `userSync` configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'qid',
            storage: {
                name: 'qid',
                type: 'html5',
                expires: 365,
            }
        }]
    }
});
```

This will add a `userId.qid` property to all bidRequests. This will be read by the Adquery bid adapter, and any other adapters that support EIDs:

```javascript
{
  qid: 'p9v2dpnuckkzhuc92i'
}
```

### Adtelligent

The [Adtelligent](https://adtelligent.com) ID system is a unique per-session user identifier for providing high quality DMP data for advertisers

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,adtelligentIdSystem

#### Adtelligent Configuration

adtelligentIdSystem adapter doesn't require any configuration or storage params. The adapter performs asynchronously and to achieve better performance it is recommended to set the `storage` object `refreshInSeconds` to a short period, such as ten minutes. At the end of the set storage refresh the adapter will refresh its configuration.

#### Adtelligent Example

{% highlight javascript %}
 pbjs.setConfig({
     userSync: {
         userIds: [{
             name: 'adtelligent'
         }]
     }
 });
{% endhighlight %}

Example with a short storage for ~10 minutes and refresh in 5 minutes:

{% highlight javascript %}
    pbjs.setConfig({
        userSync: {
            userIds: [{
                name: 'adtelligent',
                storage: {
                    type: "html5",
                    name: "adt_id",
                    expires:0.003,
                    refreshInSeconds: 60 * 5
                }
            }]
        }
    });
{% endhighlight %}

### AMX RTB ID

The AMX RTB ID is a first-party identifier designed for publishers using the AMX RTB adapter. For more information please contact [prebid@amxrtb.com](prebid@amxrtb.com)

#### AMX RTB ID Configuration

First, add the AMX RTB ID module to your Prebid.js build:

```shell
gulp build --modules=userId,amxIdSystem
```

Then configure the amxId in your `userSync` configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'amxId',
            storage: {
                name: 'amxId',
                type: 'html5',
                expires: 14,
            }
        }]
    }
});
```

This will add a `userId.amxId` property to all bidRequests. This will be read by the AMX RTB bid adapter, and any other adapters that support EIDs:

```javascript
{
  amxId: '3ca11058-ecbc-419f-bda7-b52fe7baf02a'
}
```

### BritePool

The [BritePool](https://britepool.com) ID is a persistent identifier that enables identity resolution for people-based marketing in the cookieless world. Every BritePool ID is associated with a real identity. As a result, publishers, SSPs and DSPs that integrate with BritePool, or automated
integration partners (such as PubMatic), are able to maximize revenues without cookies. As addressable individuals visit publisher websites and mobile apps, the BritePool IDs associated with these identities are passed into the bidstream; enabling advertisers to transact against these BritePool ID's and publishers to maximize the revenues associated with their inventory and audience. The BritePool ID combines consumer privacy with easy, rapid integration for publishers and does not significantly increase the computing resources required of DSPs and SSPs.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=britepoolIdSystem

#### BritePool Registration

Please reach out to [prebid@britepool.com](mailto:prebid@britepool.com) and request your `api_key`.

The BritePool privacy policy is at [https://britepool.com/services-privacy-notice/](https://britepool.com/services-privacy-notice/).

#### BritePool Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"britepoolId"` | `"britepoolId"` |
| params | Required | Object | Details for britepool initialization. | |
| params.api_key | Required | String | BritePool API Key provided by BritePool | "458frgde-djd7-3ert-gyhu-12fghy76dnmko" |
| params.url | Optional | String | BritePool API url | "https://sandbox-api.britepool.com/v1/britepool/id" |
| params.identifier | Required | String | Where identifier in the params object is the key name. At least one identifier is required. Available Identifiers `aaid` `dtid` `idfa` `ilid` `luid` `mmid` `msid` `mwid` `rida` `ssid` `hash` | `params.ssid` `params.aaid` |

#### BritePool Examples

1) Individual params may be set for the BritePool User ID Submodule. At least one identifier must be set in the params.

{% highlight javascript %}
   pbjs.setConfig({
       userSync: {
           userIds: [{
               name: "britepoolId",
               storage: {
                   name: "britepoolid",
                   type: "cookie",
                   expires: 30
               },
               params: {
                   url: "https://sandbox-api.britepool.com/v1/britepool/id", // optional. used for testing
                   api_key: "xxx", // provided by britepool
                   hash: "yyyy", // example identifier
                   ssid: "r894hvfnviurfincdejkencjcv" // example identifier
               }
           }],
           syncDelay: 3000 // 3 seconds after the first auction
       }
   });
{% endhighlight %}

### Criteo ID for Exchanges

Criteo is the leading advertising platform for the Open Internet. The Criteo ID for Exchanges module enables publishers to access Criteo’s unique demand - more than 20.000 advertisers & brands -  to monetize their exchange inventory with an optimal take rate across all browsing environments.
Note that direct access to that demand is also available through [Criteo Direct Bidder](https://www.criteo.com/products/criteo-direct-bidder/), in which case this module is unnecessary.

The Criteo privacy policy is at [https://www.criteo.com/privacy/](https://www.criteo.com/privacy/).

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=criteoIdSystem

#### Criteo ID Configuration

The Criteo ID module does not require any configuration parameters. It should work as-is provided that bidders use it in their adapters.
When calling Criteo RTB, partners should forward this id in the field `user.ext.prebid_criteoid`.

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

### Czech Publisher Exchange ID (CPExID)

CPExID is provided by [Czech Publisher Exchange](https://www.cpex.cz/), or CPEx. It is a user ID for ad targeting by using first party cookie, or localStorage mechanism. Please contact CPEx before using this ID.

{: .alert.alert-info :}
gulp build --modules=cpexIdSystem

#### CPExId Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"cpexId"` |

#### CPExId Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'cpexId'
        }]
    }
});
{% endhighlight %}

### AudienceOne ID by DAC

AudienceOne ID, provided by [D.A.Consortium Inc.](https://www.dac.co.jp/), is ID for ad targeting by using 1st party cookie.
Please contact D.A.Consortium Inc. before using this ID.

Add the AudienceOne ID to your Prebid.js Package with:

{: .alert.alert-info :}
gulp build --modules=dacIdSystem

#### AudienceOne ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"dacId"` |

#### AudienceOne ID Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'dacId'
        }]
    }
});
{% endhighlight %}

### Deepintent DPES ID by Deepintent

The DeepIntent Healthcare Marketing Platform is the first and only DSP that combines real-world health data, premium partnerships, and custom integrations to reach patients and providers across any device.  DeepIntent empowers publishers to maximize their inventory, collaborate and transact directly with advertisers, and grow their business in a safe, controlled, transparent, and privacy-compliant way. Our publisher partners sell inventory on every channel via real-time bidding or conducting one-to-one trading with hundreds of the country’s leading healthcare brands and agencies.

DeepIntent’s DPES ID is a shared user identifier built for healthcare marketers and publishers integrated within DeepIntent’s Healthcare Marketplace. The DPES ID lets users protect and manage their privacy throughout the advertising value chain. User data written and associated with the DPES ID is not stored on DeepIntent’s servers. Instead, this data is stored in a decentralized way on a user’s browser. Users can still opt out of the ads by navigating to https://option.deepintent.com/adchoices

#### Deepintent DPES ID Registration

DPES ID is free to use and requires a simple registration with DeepIntent. Please reach out to DeepIntent’s Publisher Development team at prebid@deepintent.com to learn more and get started. Once a publisher registers with DeepIntent’s platform, DeepIntent will provide a simple code snippet to be integrated with the publisher’s website. This code snippet will capture and store information per the publisher’s end user agreement. The DPES User ID module uses the DPES ID by passing it within the DeepIntent Prebid adapter.

#### Deepintent DPES ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module: `"deepintentId"` | `"deepintentId"` |
| storage | Required | Object | Storage settings for how the User Id module will cache the Deepintent ID locally | |
| storage.type | Required | String | This is where the results of the user ID will be stored. Deepintent`"html5"` or `"cookie"`. | `"html5"` |
| storage.name | Optional | String | The name of the local storage where the user ID will be stored. Deepintent | `"_dpes_id"` |
| storage.expires | Optional | Integer | How long (in days) the user ID information will be stored. Deepintent recommends `90`. | `90` |

#### Deepintent DPES ID Examples

1) Publisher stores the hashed identity from healthcare identity in cookie
{% highlight javascript %}
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'deepintentId',
      storage: {
        type: 'cookie',           // "html5" is the required storage type option is "html5"
        name: '_dpes_id',
        expires: 90             // storage lasts for 90 days, optional if storage type is html5
      }
    }],
    auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
  }
});
{% endhighlight %}

2) Publisher stores the hashed identity from healthcare identity in localstorage
{% highlight javascript %}
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'deepintentId',
      storage: {
        type: 'html5'           // "html5" is the required storage type option is "html5"
        name: '_dpes_id'
      }
    }],
    auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
  }
});
{% endhighlight %}

### DMD ID by DMD Marketing Corp

DMD is the preeminent supplier of US-based healthcare professional (HCP) identity data to the pharmaceutical, health system and medical publishing industries. DMD is the only data provider that has acquired its deterministic identity data through a fully consented, first-party, opt-in process. DMD’s privacy policy that can be found at [Privacy Policy](https://hcn.health/privacy-policy).

For assistance setting up your module, please contact us at prebid@dmdconnects.com

Add the DMD ID to your Prebid.js Package with:

{: .alert.alert-info :}
gulp build --modules=userId,dmdIdSystem

#### DMD ID Registration

Please reach out to [prebid@dmdconnects.com](mailto:prebid@dmdconnects.com) to request your `api_key`

#### DMD ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of Module | `"dmdId"` |
| storage | Required | Object |  |
| storage.name | Required | String | `dmd-dgid` |
| params | Required | Object | Container of all module params. |  |
| params.api_key | Required | String | This is your `api_key` as provided by DMD Marketing Corp. | `3fdbe297-3690-4f5c-9e11-ee9186a6d77c` |

#### DMD ID Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'dmdId',
            params: {
                api_key: '3fdbe297-3690-4f5c-9e11-ee9186a6d77c' // provided to you by DMD
            }
        }]
    }
});
{% endhighlight %}

### Fabrick ID by Neustar

[Neustar Fabrick™](https://www.home.neustar/fabrick) is a unified identity ecosystem that powers connections between brands, publishers, and consumers to accelerate marketing performance across online and offline channels.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=fabrickIdSystem

#### Fabrick Registration

Please reach out to [FabrickIntegrations@team.neustar](mailto:FabrickIntegrations@team.neustar) to request your `apiKey`.

#### Fabrick Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `"fabrickId"` |
| params | Required | Object | Container of all module params. | |
| params.apiKey | Required | String | This is your apiKey as provided by Neustar. | |
| params.e | | String | This is a hashed email address used to link a user to their Fabrick ID. | |
| params.p | | String | This is a hashed phone number used to link a user to their Fabrick ID. | |
| params.i4 | | String | This is an IPv4 address used to link a user to their Fabrick ID. | |
| params.i6 | | String | This is an IPv6 address used to link a user to their Fabrick ID. | |
| params.m | | String | This is a mobile advertising ID (IDFA/AAID) used to link a user to their Fabrick ID. | |
| params.ia | | String | This is an identifier for advertising (IFA) used to link a user to their Fabrick ID. | |
| params.iv | | String | This is an identifier for vendors (IFV) used to link a user to their Fabrick ID. | |
| params.1pd | | String | This is the 1st party user ID (e.g. a Customer ID/CUSTID). Note: This requires separate delivery of identity log files keyed off the 1st party user ID to establish an identity sync. | |
| params.u | | String | This is the page_url - the url which the user is currently browsing. Note: Encoding is required for any character outside of alphabets (A-Z a-z), digits (0-9), hyphen (-), underscore (_) tilde (~), and dot (.). | |
| params.f | | String | This is the referrer_url - the url which the user visited prior to landing on the page_url. Note: Encoding is required for any character outside of alphabets (A-Z a-z), digits (0-9), hyphen (-), underscore (_) tilde (~), and dot (.). | |
| params.ifa_type | | String | This denotes the source of the IFA. Please refer to [IAB IFA Guidelines](https://iabtechlab.com/wp-content/uploads/2018/12/OTT-IFA-guidelines.final_Dec2018.pdf) for recommended values and additional details. | |
| params.lmt | | Boolean | Possible values are '0' or '1'. A value of '1' indicates that a user has requested that ad tracking and measurement be disabled. If a value of '1' is being passed, the real IFA must not be sent via the 'ia' parameter – a 'synthetic' or 'session' IFA can be sent. Please refer to [IAB IFA Guidelines](https://iabtechlab.com/wp-content/uploads/2018/12/OTT-IFA-guidelines.final_Dec2018.pdf) for recommended values and additional details. | |

#### Fabrick Examples

1) Publisher passes an apiKey and hashed email address and elects to store the Fabrick ID envelope in a cookie.

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'fabrickId',
            params: {
                apiKey: '123456789', // provided to you by Neustar
                e: '31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66' // example hashed email address (sha256)
            },
            storage: {
                name: 'pbjs_fabrickId',
                type: 'cookie',
                expires: 7
            }
        }]
    }
});
{% endhighlight %}

2) Publisher passes an apiKey and hashed email address and elects to store the fabrickId envelope in HTML5 localStorage.

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'fabrickId',
            params: {
                apiKey: '123456789', // provided to you by Neustar
                e: '31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66' // example hashed email address (sha256)
            },
            storage: {
                type: "html5",
                name: "pbjs_fabrickId",
                expires: 7
            }
        }]
    }
});
{% endhighlight %}

### FLoC ID

The [Federated Learning of Cohorts (FLoC)](https://web.dev/floc/) system provides a privacy-preserving mechanism for interest-based ad selection. As a user moves around the web, their browser uses the FLoC algorithm to work out an "interest cohort", which will be the same for thousands of browsers with a similar recent browsing history. The user's browser is associated with one interest cohort at a time and recalculates its cohort periodically (currently once every seven days during this initial origin trial) on the user's device, without sharing individual browsing data with the browser vendor or anyone else.

There are two important things to note when using the FLoC Userid Sub adapter.

1. Unlike other user id subadapters FLoC ids cannot be stored in a cookie or Local Storage. FLoC ids change periodically and should always be fetched from the FLoC API

2. The function `(getGlobal()).getUserIds` returns `userId.flocId.id=value` into the bid request **NOT** `userid.userIdAsEids`.

To include the FLoC user id module use:

`$ gulp build --modules=flocIdSystem`

{: .alert.alert-info :}
Note: FLoC is still in a trial period. [How to take part in the FLoC origin trial](https://developer.chrome.com/blog/floc/). During the trial, a token is
required. Publishers may get their own token or use sharedid's token if they choose. Use this without the line breaks:
A3dHTSoNUMjjERBLlrvJSelNnwWUCwVQhZ5tNQ+sll7y+LkPPVZXtB77u2y7CweRIxiYaGw
GXNlW1/dFp8VMEgIAAAB+eyJvcmlnaW4iOiJodHRwczovL3NoYXJlZGlkLm9yZzo0NDMiLC
JmZWF0dXJlIjoiSW50ZXJlc3RDb2hvcnRBUEkiLCJleHBpcnkiOjE2MjYyMjA3OTksImlzU
3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9


### FTrack ID from Flashtalking By Mediaocean

The FTrack Identity Framework (["FTrack"](https://www.flashtalking.com/identity-framework#FTrack)) User ID Module allows publishers to take advantage of Flashtalking's FTrack ID during the bidding process.

Flashtalking’s cookieless tracking technology uses probabilistic device recognition to derive a privacy-friendly persistent ID for each device.

Questions? Comments? Bugs? Praise? Please contact FlashTalking's Prebid Support at [prebid-support@flashtalking.com](mailto:prebid-support@flashtalking.com)

Complete information available on the Flashtalking [privacy policy page](https://www.flashtalking.com/privacypolicy).

#### FTrack ID from Flashtalking By Mediaocean Configuration

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'FTrack',
      params: {
        url: 'https://d9.flashtalking.com/d9core', // required, if not populated ftrack will not run
        ids: {
          'device id': true,
          'single device id': true,
          'household id': true
        }
      },
      storage: {
        type: 'html5',           // "html5" is the required storage type
        name: 'FTrackId',        // "FTrackId" is the required storage name
        expires: 90,             // storage lasts for 90 days
        refreshInSeconds: 8*3600 // refresh ID every 8 hours to ensure it's fresh
      }
    }],
    auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
  }
});
```

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| :-- | :-- | :-- | :-- | :-- |
| name | Required | String | The name of this module: `"FTrack"` | `"FTrack"` |
| params | Required | Object | The IDs available, if not populated then the defaults "Device ID" and "Single Device ID" will be returned | |
| params.url | Required | String | The URL for the ftrack library reference. If not populated, ftrack will not run. | 'https://d9.flashtalking.com/d9core' |
| params.ids | Optional | Object | The ftrack IDs available, if not populated then the defaults "Device ID" and "Single Device ID" will be returned | |
| params.ids['device id'] | Optional | Boolean | Should ftrack return "device id". Set to `true` to return it. If set to `undefined` or `false`, ftrack will not return "device id". Default is `false` | `true` |
| params.ids['single device id'] | Optional | Boolean | Should ftrack return "single device id". Set to `true` to return it. If set to `undefined` or `false`, ftrack will not return "single device id". Default is `false` | `true` |
| params.ids['household id'] | Optional; _Requires pairing with either "device id" or "single device id"_ | Boolean | __1.__ Should ftrack return "household id". Set to `true` to attempt to return it. If set to `undefined` or `false`, ftrack will not return "household id". Default is `false`.  __2.__ _This will only return "household id" if value of this field is `true` **AND** "household id" is defined on the device._ __3.__ _"household id" requires either "device id" or "single device id" to be also set to `true`, otherwise ftrack will not return "household id"._ | `true` |
| storage | Required | Object | Storage settings for how the User ID module will cache the FTrack ID locally | |
| storage.type | Required | String | This is where the results of the user ID will be stored. FTrack **requires** `"html5"`. | `"html5"` |
| storage.name | Required | String | The name of the local storage where the user ID will be stored. FTrack **requires** `"FTrackId"`. | `"FTrackId"` |
| storage.expires | Optional | Integer | How long (in days) the user ID information will be stored. FTrack recommends `90`. | `90` |
| storage.refreshInSeconds | Optional | Integer | How many seconds until the FTrack ID will be refreshed. FTrack strongly recommends 8 hours between refreshes | `8*3600` |

### GrowthCode

[GrowthCode](https://growthcode.io/) offers scaled infrastructure-as-a-service 
to empower independent publishers to harness data and take control of 
identity and audience while rapidly aligning to industry changes and 
margin pressure.

#### GrowthCode Configuration

First, make sure to add the GrowthCode submodule to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=growthCodeIdSystem,userId

The following configuration parameters are available:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'growthCodeId',
      params: {
          pid: 'TEST01', // Set your Partner ID here for production (obtained from Growthcode)
          publisher_id: '_sharedID',
          publisher_id_storage: 'html5'
      }
    }]
  }
});
```
The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope    | Type   | Description | Example         |
|--------------------------------|----------|--------| --- |-----------------|
| name                           | Required | String | The name of this module. | `"growthCodeId"` |
| params                         | Required | Object | Details of module params. |                 |
| params.pid                     | Required | String | This is the Partner ID value obtained from GrowthCode | `"TEST01"`        |
| params.url | Optional | String | Custom URL for server | |
| params.publisher_id | Optional | String | Name if the variable that holds your publisher ID | `"_sharedID"` |
| params.publisher_id_storage | Optional | String | Publisher ID storage (cookie, html5) | `"html5"` |

### Hadron ID from Audigent

Audigent is a next-generation data management platform and a first-of-a-kind "data agency" containing some of the most exclusive content-consuming audiences across desktop, mobile and social platforms. Our HadronId module allows for user id resolution and Audigent user data segmentation to be retrieved for users across the web.  For assistance setting up your module please contact us at [prebid@audigent.com](mailto:prebid@audigent.com).

#### HadronId Configuration
Add the Hadron ID system to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,hadronIdSystem

Add HadronId to the userSync configuration.

```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'hadronId',
            storage: {
                name: 'hadronId',
                type: 'html5'
            },
            params: {
                partnerId: 1234
            }
        }]
    }
});
```

The `request.userId.hadronId` will contain the Audigent HadronId:
```
{
  "hadronId": "0201chpvai07jv2yg08xizqr0bwpa1w0evvmq014d2ykn0b5oe"
}
```
The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the HadronID module - `"hadronId"` | `"hadronId"` |
| params | Optional | Object | Used to store params for the HadronId system |
| params.url | Optional | String | Set an alternate GET url for HadronId with this parameter |
| params.urlArg | Optional | Object | Optional url parameter for params.url |
| params.partnerId | Required | Number | This is the Audigent Partner ID obtained from Audigent. |

### ID+

ID+, powered by zeotap, enables the marketing ecosystem to overcome challenges posed by the demise of identifiers and a fast-changing regulatory landscape. ID+ is an open invitation to the entire industry to build the future of identity together.

This sub-module enables the user’s ID+ to be available in the bid request.

More information on ID+ can be found here: [https://idplus.io/](https://idplus.io/)

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=zeotapIdPlusIdSystem

#### ID+ Registration

You can set up your ID+ account by contacting our support team at [support.idplus@zeotap.com](mailto:support.idplus@zeotap.com) or via [https://idplus.io/contact-us](https://idplus.io/contact-us.html) and we will get back to you.

ID+ is covered under zeotap privacy policy: [Zeotap Privacy Policy](https://zeotap.com/website-privacy-policy).

#### ID+ Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "zeotapIdPlus"
        }]
    }
});
{% endhighlight %}


### ID5 Universal ID

The ID5 ID is a shared, neutral identifier that publishers and ad tech platforms can use to recognise users even in environments where 3rd party cookies are not available. The ID5 ID is designed to respect users' privacy choices and publishers’ preferences throughout the advertising value chain. For more information about the ID5 ID and detailed integration docs, please visit [our documentation](https://support.id5.io/portal/en/kb/articles/prebid-js-user-id-module).


#### ID5 ID Registration

The ID5 ID is free to use, but requires a simple registration with ID5. Please visit [our website](https://id5.io/solutions/#publishers) to sign up and request your ID5 Partner Number to get started.

The ID5 privacy policy is at [https://id5.io/platform-privacy-policy](https://id5.io/platform-privacy-policy).

#### ID5 ID Configuration

First, make sure to add the ID5 submodule to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=id5IdSystem,userId

The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module: `"id5Id"` | `"id5Id"` |
| params | Required | Object | Details for the ID5 ID. | |
| params.partner | Required | Number | This is the ID5 Partner Number obtained from registering with ID5. | `173` |
| params.pd | Optional | String | Partner-supplied data used for linking ID5 IDs across domains. See [our documentation](https://support.id5.io/portal/en/kb/articles/passing-partner-data-to-id5) for details on generating the string. Omit the parameter or leave as an empty string if no data to supply | `"MT1iNTBjY..."` |
| params.abTesting | Optional | Object | Allows publishers to easily run an A/B Test. If enabled and the user is in the Control Group, the ID5 ID will NOT be exposed to bid adapters for that request | Disabled by default |
| params.abTesting.enabled | Optional | Boolean | Set this to `true` to turn on this feature | `true` or `false` |
| params.abTesting.controlGroupPct | Optional | Number | Must be a number between `0.0` and `1.0` (inclusive) and is used to determine the percentage of requests that fall into the control group (and thus not exposing the ID5 ID). For example, a value of `0.20` will result in 20% of requests without an ID5 ID and 80% with an ID. | `0.1` |
| params.disableExtensions | Optional | Boolean | Set this to `true` to force turn off extensions call. Default `false` | `true` or `false` |

{: .alert.alert-info :}
**NOTE:** The ID5 ID that is delivered to Prebid will be encrypted by ID5 with a rotating key to avoid unauthorized usage and to enforce privacy requirements. Therefore, we strongly recommend setting `storage.refreshInSeconds` to `8` hours (`8*3600` seconds) or less to ensure all demand partners receive an ID that has been encrypted with the latest key, has up-to-date privacy signals, and allows them to transact against it.

##### A Note on A/B Testing

Publishers may want to test the value of the ID5 ID with their downstream partners. While there are various ways to do this, A/B testing is a standard approach. Instead of publishers manually enabling or disabling the ID5 User ID Module based on their control group settings (which leads to fewer calls to ID5, reducing our ability to recognize the user), we have baked this in to our module directly.

To turn on A/B Testing, simply edit the configuration (see above table) to enable it and set what percentage of users you would like to set for the control group. The control group is the set of user where an ID5 ID will not be exposed in to bid adapters or in the various user id functions available on the `pbjs` global. An additional value of `ext.abTestingControlGroup` will be set to `true` or `false` that can be used to inform reporting systems that the user was in the control group or not. It's important to note that the control group is user based, and not request based. In other words, from one page view to another, a user will always be in or out of the control group.

#### ID5 Universal ID Examples

{: .alert.alert-warning :}
**ATTENTION:** As of Prebid.js v4.14.0, ID5 requires `storage.type` to be `"html5"` and `storage.name` to be `"id5id"`. Using other values will display a warning today, but in an upcoming release, it will prevent the ID5 module from loading. This change is to ensure the ID5 module in Prebid.js interoperates properly with the [ID5 API](https://github.com/id5io/id5-api.js) and to reduce the size of publishers' first-party cookies that are sent to their web servers. If you have any questions, please reach out to us at [prebid@id5.io](mailto:prebid@id5.io).

Publisher wants to retrieve the ID5 ID through Prebid.js

{% highlight javascript %}
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'id5Id',
      params: {
        partner: 173,            // change to the Partner Number you received from ID5
        pd: 'MT1iNTBjY...',      // optional, see table above for a link to how to generate this
        abTesting: {             // optional
          enabled: true,         // false by default
          controlGroupPct: 0.1   // valid values are 0.0 - 1.0 (inclusive)
        }
      },
      storage: {
        type: 'html5',           // "html5" is the required storage type
        name: 'id5id',           // "id5id" is the required storage name
        expires: 90,             // storage lasts for 90 days
        refreshInSeconds: 8*3600 // refresh ID every 8 hours to ensure it's fresh
      }
    }],
    auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
  }
});
{% endhighlight %}

### IDx

IDx, a universal ID solution provided by [Retargetly](https://retargetly.com), is the evolution of digital identifiers for the Latin American region. Through a proprietary identity graph, it allows publishers, advertisers, and ad tech platforms to recognize users across domains and devices even where third party cookies aren't available.

The IDx platform is designed with privacy at its core and allows for nearly every conceivable digital use case including but not limited to audience targeting, retargeting, frequency management, personalization, and total reach reporting.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=idxIdSystem

#### IDx Registration

If you are a publisher or an advertiser, then IDx is free to use but requires a simple registration process. To do this, please send an email to [idx-partners@retargetly.com](mailto:idx-partners@retargetly.com) to request your IDx Partner ID.

We may ask for some basic information from you before approving your request. For more information on IDx, please visit [retargetly.com/idx](http://retargetly.com/idx).

#### IDx Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"idx"` | `"idx"` |

#### IDx Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "idx"
        }]
    }
});
{% endhighlight %}

### IM-UID by Intimate Merger

IM-UID, provided by [Intimate Merger](https://corp.intimatemerger.com/), is a universal identifier that designed for publishers, platforms and advertisers to perform segmentation and targeting even in environments where 3rd party cookies are not available. IM-UID is currently only available in Japan.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=imuIdSystem

#### IM-UID Registration

Please visit [https://lp.intimatemerger.com/im-uid](https://lp.intimatemerger.com/im-uid) and request your Customer ID to get started.

The Intimate Merger privacy policy is at https://corp.intimatemerger.com/privacypolicy/

#### IM-UID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `"imuid"` |
| params | Required | Object | Details of module params. | |
| params.cid | Required | Number | This is the Customer ID value obtained via Intimate Merger. | `5126` |
| params.url | Optional | String | Use this to change the default endpoint URL. | `"https://example.com/some/api"` |

#### IM-UID Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "imuid",
            params: {
                cid: 5126 // Set your Intimate Merger Customer ID here for production
            }
        }]
    }
});
{% endhighlight %}

### Intent IQ ID

Intent IQ’s universal ID with its unparalleled coverage of over 80% of ad inventory, protects publishers’ ability to rely on advertising as their main revenue source while preserving user privacy in a third party cookieless world.

The universal ID is an Intent IQ generated alphanumeric characters ID representing a person. This ID is not matched with personal information and remains anonymous to Intent IQ.

Intent IQ universal ID enables partners - publishers, SSPs, DSPs, DMPs and advertisers to support, in a privacy-friendly way, and on a person level, core elements of the advertising business model -

- Targeting across sites and devices
- Frequency capping
- Attribution measurement across sites and devices

Intent IQ's universal ID works across IP addresses and user-agent changes.

Intent IQ's universal ID truly stands out in the coverage and accuracy it provides. Intent IQ's universal ID covers over 80% of ad inventory with 90% accuracy. By contrast, third-party cookies offer 56% coverage and log-in solutions offer coverage of less than 20%.


Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=intentIqIdSystem

#### Intent IQ ID Registration

You can set up Intent IQ ID by contacting our operations team at [Intent IQ Contact Us](https://www.intentiq.com/contact-us) and getting your partner id.

The Intent IQ ID privacy is covered under the [Intent IQ Privacy Policy](https://www.intentiq.com/technology-privacy-policy).

#### Intent IQ ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"intentIqId"` | `"intentIqId"` |
| params | Required for IntentIqId | Object | Details for IntentIqId initialization. | |
| params.partner | Required | String | This is the partner ID value obtained from registering with IntentIQ. | `"1177538"` |
| params.pcid | Optional | String | This is the partner cookie ID, it is a dynamic value attached to the request. | `"g3hC52b"` |
| params.pai | Optional | String | This is the partner customer ID / advertiser ID, it is a dynamic value attached to the request. | `"advertiser1"` |

{: .alert.alert-info :}
**NOTE:** The Intent IQ ID is encrypted with a key that changes every several hours. Demand partners utilize the latest key to decrypt the ID and use it. Therefore, to enable demand partners have an ID they can use, we highly recommend calling Intent IQ every 4 hours by setting storage.refreshInSeconds to 4 hours (4*3600 seconds)

#### Intent IQ ID Examples

1) Publisher has a partner ID from Intent IQ and cookies.

{: .alert.alert-warning :}
{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "intentIqId",
            params: {
                partner: 123456             // valid partner id
            },
            storage: {
                type: "cookie",
                name: "intentIqId",         // create a cookie with this name
                expires: 60,                // cookie can last for 60 days
                refreshInSeconds: 4*3600    // refresh ID every 4 hours to ensure it's fresh
}
        }],
        syncDelay: 3000              // 3 seconds after the first auction
    }
});
{% endhighlight %}

2) Publisher supports Intent IQ and HTML5 local storage.

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "intentIqId",
            params: {
                partner: 123456			    // valid partner id
            },
            storage: {
                type: "html5",
                name: "intentIqId",         // set localstorage with this name
                expires: 60,
                refreshInSeconds: 4*3600    // refresh ID every 4 hours to ensure it's fresh
            }
        }],
        syncDelay: 3000
    }
});
{% endhighlight %}


3) Publisher supports IntentIQ and HTML5 local storage with extra dynamic params such as 'pcid' and 'pai'.

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "intentIqId",
            params: {
                partner: 123456     // valid partner id
                pcid: PCID_VARIABLE   // string value, dynamically loaded into a variable before setting the configuration
                pai: PAI_VARIABLE   // string value, dynamically loaded into a variable before setting the configuration
            },
            storage: {
                type: "html5",
                name: "intentIqId",    // set localstorage with this name
                expires: 60
            }
        }],
        syncDelay: 3000
    }
});
{% endhighlight %}

### Just ID

[Justtag Group](https://www.justtag.com/en) is a European, privacy focused DMP and segment provider. Having a leading position in Poland and growing presence in the CEE region, we created Just ID - an alternative ID solution, designed to respect users’ privacy choices which doesn’t rely on 3rd party cookies. Our aim is to help Publishers and Advertisers to recognize users across various environments and enable ad-tech market players with a smooth transition into post 3rd party cookie era.

#### Just ID Modes

- **BASIC** - In this mode we rely on Justtag library that already exists on publisher page. Typicaly that library expose global variable called `__atm`

- **COMBINED** - Just ID generation process may differ between various cases depends on publishers. This mode combines our js library with prebid for ease of integration

If you have any questions about Just ID, please reach out by emailing [prebid@justtag.com](mailto:prebid@justtag.com).

#### Just ID Configuration

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID of the module - `'justId'` | `'justId'` |
| params | Optional | Object | Details for Just ID syncing. | |
| params.mode | Optional | String | Mode in which the module works. Available Modes: `'COMBINED'`, `'BASIC'`(default)   | `'COMBINED'` |
| params.atmVarName | Optional | String | Name of global object property that point to Justtag ATM Library. Defaults to `'__atm'` | `'__atm'` |
| params.url | Optional | String | API Url, **required** in `COMBINED` mode | `'https://id.nsaudience.pl/getId.js'` |
| params.partner | Optional | String | This is the Justtag Partner Id which may be required in some custom integrations with Justtag | `'some-publisher'` |

#### Just ID Example

ex. 1. Mode `COMBINED`

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'justId',
            params: {
                mode: 'COMBINED',
                url: 'https://id.nsaudience.pl/getId.js'
            }
        }]
    }
});
{% endhighlight %}

ex. 2. Mode `BASIC`

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'justId'
        }]
    }
});
{% endhighlight %}

#### Just ID  Disclosure

This module in `COMBINED` mode loads external JavaScript to generate optimal quality user ID. It is possible to retrieve user ID, without loading additional script by this module in `BASIC` mode.

### Kinesso ID

Kinesso ID solution is a new approach to persistent cross domain authentication.

#### How it works

The Kinesso identity solution creates a persistent cross domain authenticated user id that is then used to link users with their interest signals (commonly known as segments).  The Kinesso user ID (knsso) is never broadcast into the bid stream. Instead it is sent to a server side data store, merged with accompanying data from the Prebid Id Library and shipped to Kinesso. All data is encrypted at rest and in transit so your identifiers are never stored or transmitted in an insecure manner.

The Kinesso ID sub adapter sets two cookies, one as a third party cookie and the other as a first party cookie in the publisher's domain. These cookies are merged with the user's hashed email address (when present) server side and sent to Kinesso. The combined output looks like this:

{: .table .table-bordered .table-striped }
| kpuid | knsso | hid | account_id | created on |
| --- | --- | --- | --- | --- |
| `<my_1pc>` | `<my_3pc>` | `<my_hashed_email>` | `<my_ssp_accountid>` | `<my_birthday>` |

Kinesso will then attach these users to deals ids that they will target in the ORTB bid stream by brands and agencies represented by IPG.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=kinessoIdSystem

#### Kinesso ID Registration

You can set up Kinesso ID sub adapter by contacting Kinesso at prebid@kinesso.com

The Kinesso ID privacy policy is covered under the [Kinesso Privacy Notice](https://kinesso.com/privacy-policy/). Please note, at present the Kinesso ID module is not meant for use inside the EEA.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'kpuid'` |
| params | Required | Object | Details for KinessoId initialization | |
| params.accountid | Required | Int | Your SSP Account Id | 123 |

### LiveIntent nonID

LiveIntent offers audience resolution by leveraging our next-generation identity solutions. The LiveIntent identity graph is built around a people-based set of data that is authenticated daily through active engagements with email newsletters and media across the web. The LiveIntent nonID is a user identifier tied to an active, encrypted email in our graph and functions in cookie-challenged environments and browsers.

There are two ways to build your Prebid.js package to include the LiveIntent nonID:
* The standard version which allows publishers to include the module with full functionalities, like hashing email addresses and identity resolution
* The minimal version, which allows publishers to deploy a smaller bundle with minimal features, including identity resolution.

Add the **full** LiveIntent Identity module to your Prebid.js package with:
{: .alert.alert-info :}
gulp build --modules=userId,liveIntentIdSystem

Add the **minimal** LiveIntent Identity module to your Prebid.js package with:
{: .alert.alert-info :}
LiveConnectMode=minimal gulp build --modules=liveIntentIdSystem

The `request.userId.lipb` object would look like:
```
{
  "lipbid": "T7JiRRvsRAmh88",
  "segments": ["999"]
}
```

The adapters can be implemented to use the lipbid as the identifier and segments to which that identifier is associated with. To enable identity resolution for a specific publisher, LiveIntent builds a model on the backend with data collected via an additional call issued on each page load.

#### LiveIntent ID Registration

Please register with us if you’re not already a LiveIntent customer: [https://www.liveintent.com/prebid-registration/](https://www.liveintent.com/prebid-registration/)

LiveIntent’s privacy policies for the services rendered can be found at [https://www.liveintent.com/services-privacy-policy/](https://www.liveintent.com/services-privacy-policy/)

#### How does LiveIntent ID work

The LiveIntent ID sub-module resolves the identity of audiences by connecting impression opportunities to a stable identifier - the nonID. In order to provide resolution one or more first-party cookies are used to create a stable identifier.

How does LiveIntent ID sub-module decide, which first-party cookies to use:
1. By default LiveIntent ID sub-module generates its own first-party identifier on the publisher’s domain. Publishers have the option to disable the cookie generation when configuring the LiveIntent ID sub-module.
2. A publisher can also define in the configuration which additional first-party cookies should be used. These can be used in a combination with the LiveIntent first-party cookie.

The LiveIntent ID sub-module sends the defined identifiers to the identity graph, which processes them and creates a nonID. The parameters being sent are described [here](https://github.com/liveintent-berlin/live-connect/blob/HEAD/COLLECTOR_PARAMS.md)

For the identity resolution the LiveIntent ID sub-module makes a request to LiveIntent’s identity resolution API, which returns a nonID and the audience segment(s) a user belongs to. The nonID and the segment ID are then exposed by the Prebid User ID Module to Prebid adapters to be sent out in a bid request. An SSP can then make the impression opportunity available to any buyers targeting the segment.

The first-party cookie generation and identity resolution functionality is provided by the LiveConnect JS library, included within the LiveIntent ID sub-module. LiveIntent has created a shared library that is open source, available at [https://www.npmjs.com/package/live-connect-js](https://www.npmjs.com/package/live-connect-js).

The LiveIntent ID sub-module follows the standard Prebid.js initialization based on the GDPR consumer opt-out choices. With regard to CCPA, the LiveConnect JS receives a us_privacy string from the Prebid US Privacy Consent Management Module and respects opt-outs.

#### Resolving uid2

Attributes other than the nonID can be requested using the requestedAttributesOverrides configuration option.

One attribute that requires special mention here is 'uid2'. If this attribute is resolved by the id module
it will be exposed in the same format as from the Unified ID 2.0 userid module. If both the LiveIntent module
and the uid2 module manage to resolve an uid2, the one from the uid2 module will be used.
Enabling this option in addition to the uid2 module is an easy way to increase your uid2 resolution rates.
Example configuration to enable uid2 resolution:

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

#### LiveIntent ID configuration

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

#### LiveIntent ID examples

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

### Lotame Panorama ID

[Lotame Panorama](https://www.lotame.com/panorama/) is a suite of data-enrichment solutions for digital advertising that empowers marketers, agencies, publishers and media companies to transform consumer personas into addressable audiences. At the heart of Lotame Panorama is the Panorama ID, a people-based identifier powered by deterministic and probabilistic data, available across the cookie-challenged web and all browsers.

Lotame’s Panorama ID module sends information from the request to its identity graph in order to successfully generate a Panorama ID. For more information on how the Panorama ID works, please visit [https://www.lotame.com/panorama/id/](https://www.lotame.com/panorama/id/).

**Ease of Implementation**: Deployment of the Lotame Panorama ID module has been optimized for ease by not requiring any registration to utilize. Simply add the generic module to start producing the Panorama ID across your inventory.

Lotame's privacy policy related to the Panorama ID and the collection of data and how data is used is available at [https://www.lotame.com/about-lotame/privacy/lotames-products-services-privacy-policy/](https://www.lotame.com/about-lotame/privacy/lotames-products-services-privacy-policy/). Consult with your legal counsel to determine the appropriate user disclosures with respect to use of the Lotame Panorama ID module.

If you have any questions about Panorama ID, please reach out by emailing [PanoramaID@lotame.com](mailto:PanoramaID@lotame.com).

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=lotamePanoramaIdSystem

#### Lotame Panorama ID Configuration

The Lotame Panorama ID module does not require any configuration parameters. It should work as-is provided that bidders use it in their adapters.

{: .alert.alert-info :}
NOTE: For optimal performance, the Lotame Panorama Id module should be called at every opportunity. It is best not to use `params.storage` with this module as the module has its own optimal caching mechanism.

#### Lotame Panorama ID Example

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the module | "lotamePanoramaId" |

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "lotamePanoramaId",
        }]
    }
});
{% endhighlight %}

### MediaWallah OpenLinkID

MediaWallah's openLink is an anonymous person based ID that enables buyers and sellers of media to connect a person and their devices across the web and mobile apps. openLink facilities the buying of media between DSPs, SSPs and publishers.

Add support for MediaWallah OpenLinkID to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,mwOpenLinkIdSystem

#### MediaWallah OpenLinkID Registration

MediaWallah requires the creation of an accountId a partnerId in order to take advantage of openLink. Please contact your partner resource to get these Ids provisioned.

#### MediaWallah OpenLinkID Configuration

<div class="table-responsive" markdown="1">
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'mwOpenLinkId'` |
| params | Required | Object | Details for mwOLID syncing. ||
| params.accountId | Required | String | The MediaWallah assigned Account Id  | `1000` |
| params.partnerId | Required | String | The MediaWallah assign partner Id |`'1001'`|
| params.uid | Optional | String | Your unique Id for the user or browser. Used for matching. | `'u-123xyz'` |
{: .table .table-bordered .table-striped }
</div>

#### MediaWallah OpenLinkID Examples

```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'mwOpenLinkId',
            params: {
                accountId: '1000',
                partnerId: '1001',
                uid: 'u-123xyz'
            }
        }]
    }
})
```

### Merkle ID

[Merkury by Merkle](https://merkury.merkleinc.com/contact) enables marketers, media owners, and publishers to own, build, and control a cookie-less Private Identity Graph. Merkury uses an organization’s first-party CRM data and valuable interactions such as logins, outbound email campaigns and media reach to create and grow a universe of person-based IDs for cross-channel targeting, personalization, measurement and more.

#### Merkury by Merkle ID Examples

Publisher stores Merkury by Merkle in local storage for 30 days

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
        name: 'merkleId',
        params: {
          sv_pubid:'example_pubid',
          ssp_ids: ['example_sspid_1', 'example_sspid_2']
        },
        storage: {
          type: 'html5',
          name: 'merkleId',
          expires: 30
        }
      }]
    }
});
{% endhighlight %}

### Navegg ID

[Navegg](https://www.navegg.com) enables publishers, advertisers and agencies to use their own first party data together to activate media in a cookie-less way across several Ad Tech platforms. Navegg has one of the largest data networks in Latin America which also allows the enhancement of data with unique categories.

#### Navegg ID Examples

Publisher stores NaveggId in local storage and/or 1st party cookies

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
        name: 'naveggId'
      }]
    }
});
{% endhighlight %}

### netID

The [European netID Foundation (EnID)](https://developerzone.netid.de/index.html) aims to establish with the netID an independent European alternative in the digital market for Demand and Supply side. With the netID Single-Sign-On, the EnID established an open standard for consumer logins for services of Buyers and Brands, that also includes user-centric consent management capabilities that results in a standardized, EU-GDPR compliant, IAB TCF aware, cross-device enabled Advertising Identifier, which can be leveraged by publishers and advertisers (and vendors supporting them) to efficiently deliver targeted advertising through programmatic systems to already more than 38 million Europeans on mobile and desktop devices.

The EnID is a non-profit organization which is open to any contributing party on both, the demand and supply side to make identity work for consumers as well as the advertising ecosystem.

#### netID Examples

1) Publisher stores netID via his own logic

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "netId",
            value: {
               "netId":"fH5A3n2O8_CZZyPoJVD-eabc6ECb7jhxCicsds7qSg"
            }
        }]
    }
});
{% endhighlight %}

### Novatiq Hyper ID

The [Novatiq](https://www.novatiq.com) proprietary dynamic Hyper ID is a unique, non sequential and single use identifier for marketing activation. Our in network solution matches verification requests to telco network IDs safely and securely inside telecom infrastructure. The Novatiq Hyper ID can be used for identity validation and as a secured 1st party data delivery mechanism.

#### Novatiq Hyper ID Configuration

Enable by adding the Novatiq submodule to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=novatiqIdSystem,userId


Module activation and configuration:

{% highlight javascript %}
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'novatiq',
      params: {
        // change to the Partner Number you received from Novatiq
        sourceid '1a3'
        }
      }
    }],
    // 50ms maximum auction delay, applies to all userId modules
    auctionDelay: 50
  }
});
{% endhighlight %}

#### Parameters for the Novatiq Module

<div class="table-responsive" markdown="1">
| Param  | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | Module identification: `"novatiq"` | `"novatiq"` |
| params | Required | Object | Configuration specifications for the Novatiq module. | |
| params.sourceid | Required | String | This is the Novatiq Partner Number obtained via Novatiq registration. | `1a3` |
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


### Novatiq Hyper ID with Prebid SharedID support
You can make use of the Prebid.js SharedId module as follows.

#### Novatiq Hyper ID Configuration

Enable by adding the Novatiq and SharedId submodule to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=novatiqIdSystem,userId

Module activation and configuration:

{% highlight javascript %}
pbjs.setConfig({
  userSync: {
    userIds: [
      {
      name: 'novatiq',
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
    // 50ms maximum auction delay, applies to all userId modules
    auctionDelay: 50
  }
});
{% endhighlight %}


If you have any questions, please reach out to us at [prebid@novatiq.com](mailto:prebid@novatiq.com)

### Parrable ID

The Parrable ID is a Full Device Identifier that can be used to identify a device across different browsers and webviews on a single device including browsers that have third party cookie restrictions.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=parrableIdSystem

#### Parrable ID Registration

Please contact Parrable to obtain a Parrable Partner Client ID and/or use the Parrable Partner Client ID provided by the vendor for each Parrable-aware bid adapter you will be using.  Note that if you are working with multiple Parrable-aware bid adapters you may use multiple Parrable Partner Client IDs.

The Parrable privacy policy as at [https://www.parrable.com/privacy-policy/](https://www.parrable.com/privacy-policy/).

#### Parrable ID Configuration

In addition to the parameters documented above in the Basic Configuration section the following Parrable specific configuration is required:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| params | Required | Object | Details for the Parrable ID. | |
| params.partners | Required | Array[String] | A list of one or more Parrable Partner Client IDs for the Parrable-aware bid adapters you are using.  Please obtain Parrable Partner Client IDs from them and/or obtain your own. | `[ '30182847-e426-4ff9-b2b5-9ca1324ea09b' ]` |
| params.timezoneFilter | Optional | Object | Configures a timezone or timezone offset filter | |
| params.timezoneFilter.allowedZones | Optional | Array[String] | description | `[ 'America/Anchorage' ]` |
| params.timezoneFilter.allowedOffsets | Optional | Array[Number] | description | `[ -4 ]` |
| params.timezoneFilter.blockedZones | Optional | Array[String] | description | `[ 'America/New_York' ]` |
| params.timezoneFilter.blockedOffsets | Optional | Array[Number] | description | `[ -5 ]` |


{: .alert.alert-info :}
NOTE: The Parrable ID that is delivered to Prebid is encrypted by Parrable with a time-based key and updated frequently in the browser to enforce consumer privacy requirements and thus will be different on every page view, even for the same user.

The Parrable ID system manages a cookie with the name of `_parrable_id` containing the ID and optout states of the user.
This cookie is used also by standalone Parrable integrations outside of Prebid.
It is for this reason that the cookie name is not configurable for the Parrable ID system.

#### Timezone and Timezone Offset Filtering

The Parrable ID system enables a publisher to configure lists of **allowed** timezones (eg. `Europe/Dublin`) and/or timezone offsets (eg. `-4`) as well as a lists of **blocked** timezones and timezone offsets.

- With no configuration (`params.timezoneFilter` not set, or all of the lists are empty) all impressions are permitted.
- With only allow lists configured a browser must match either a timezone or timezone offset for it to not be filtered.
- With only block lists configured an impression will be filtered only if it is from a browser matching a blocked timezone or timezone offset.
- An impression from a browser that matches any allowed timezone or timezone offset, but does not match a blocked timezone or timezone offset will engage in the Parrable ID syncronization process.
- If a browser has a stored Parrable ID then it will not be filtered even if the browser is in a timezone or timezone offset that is blocked.

All configured timezones should follow the `TZ database name` column from the [IANA tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

#### Parrable ID Examples

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: `'parrableId'`,
            params: {
              partners: [
                '30182847-e426-4ff9-b2b5-9ca1324ea09b',
                'b07cf20d-8b55-4cd7-9e84-d804ed66b644'
              ], // change to the Parrable Partner Client ID(s) you received from the Parrable Partners you are using
              timezoneFilter: {
                  allowedZones: ['America/New_York', 'Europe/Madrid']
              }
            }
        }],
        syncDelay: 1000
    }
});
{% endhighlight %}

### Publisher Link
Publisher Link, provided by [Epsilon](https://www.epsilon.com/us),  is a cross-device identity solution that activates publisher first-party, authenticated
data to improve audience identification and increase bid opportunities, specifically designed for sites with authenticated
traffic.  Publisher first-party authenticated data and a user's unique encrypted ID is linked to an existing people-based
Epsilon CORE ID.  By utilizing Publisher Link, publishers are able to reap the benefits of Epsilon's CORE ID.

#### Publisher Link  Registration
Please contact [Epsilon](mailto:PublisherSupport@Epsilon.com) to sign up.

The Epsilon privacy is covered in the [Epsilon Privacy Policy](https://www.epsilon.com/us/privacy-policy).

The Publisher Link opt-out is included [here](https://www.epsilon.com/privacy/dms/opt-out/email)

#### Publisher Link Configuration

In addition to the parameters documented above in the Basic Configuration section the following Publisher Link specific configuration is available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'publinkId'` |
| params | Required | Object | Customized parameters. | |
| params.e | Required | String | Hashed email address of the user.  Supports MD5 and SHA256. | `'7D320454942620664D96EF78ED4E3A2A'` |
| params.site_id | Required | String | Site ID provided by Epsilon. | `'123456'` |
| params.api_key | Required | String | API key provided by Epsilon. | `'00000000-0000-0000-0000-00000000000'`

#### Publisher Link Examples
```javascript
    pbjs.setConfig({
       userSync: {
           userIds: [{
               name: "publinkId",
               storage: {
                   name: "pbjs_publink",
                   type: "cookie",
                   expires: 30
               },
               params: {
                   e: "7D320454942620664D96EF78ED4E3A2A", // example hashed email (md5)
                   site_id: "123456",
                   api_key: "00000000-0000-0000-0000-00000000000"
               }
           }]
       }
   });
```

### RampID

RampID, formerly known as IdentityLink, provided by [LiveRamp](https://liveramp.com) is a single person-based identifier which allows marketers, platforms and publishers to perform personalized segmentation, targeting and measurement use cases that require a consistent, cross-channel view of the user in anonymous spaces.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=identityLinkIdSystem

#### RampID Registration

LiveRamp's RampID is free of charge and only requires a simple registration with Liveramp. Please sign up through our [Console](https://launch.liveramp.com) platform and request a Placement ID, a unique identifier that is used to identify each publisher, to get started.

The RampID privacy policy is at [https://liveramp.com/privacy/service-privacy-policy/](https://liveramp.com/privacy/service-privacy-policy/).

#### RampID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of LiveRamp's user ID module. | `"identityLink"` |
| params | Required | Object | Container of all module params. |  |
| params.pid | Required | String | This is the Placement ID, a unique identifier that is used to identify each publisher, obtained from registering with LiveRamp. | `999` |
| params.notUse3P | Not required | Boolean | Property for choosing if a cookieable envelope should be set and stored until the user authenticates and a RampID envelope can be created (either `true` or `false`). | `false` |
| storage | Required | Object | This object defines where and for how long the results of the call to get a RampID envelope will be stored. |
| storage.type	| Required | String | This parameter defines where the resolved RampID envelope will be stored (either `"cookie"` or `"html5"` localStorage). | `"cookie"` |
| storage.name | Required | String | The name of the cookie or html5 localstorage where the resolved RampID envelope will be stored. LiveRamp requires `"idl_env"`. | `"idl_env"` |
| storage.expires | Required | Integer | How long (in days) the RampID envelope information will be stored. To be GDPR and CCPA compliant, we strongly advise to set a 15-day TTL ("Time to Live" / expiration time). If you are not planning to obtain RampID envelopes for EU/EEA or U.S. users, we advise you to change the expiration time to 30 days. | `15` |
| storage.refreshInSeconds | Required | Integer | The amount of time (in seconds) the RampID envelope should be cached in storage before calling LiveRamp again to retrieve a potentially updated value for the RampID envelope. | `1800`

{: .alert.alert-info :}
**NOTE:** The RampID envelope that is delivered to Prebid will be encrypted by LiveRamp with a rotating key to avoid unauthorized usage and to enforce privacy requirements. Therefore, we strongly recommend setting `storage.refreshInSeconds` to 30 minutes (1800 seconds) to ensure all demand partners receive an ID that has been encrypted with the latest key, has up-to-date privacy signals, and allows them to transact against it.

#### RampID Examples

1) Publisher passes a Placement ID and elects to store the RampID envelope in a cookie.

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "identityLink",
            params: {
                pid: '999',             // Set your Placement ID here
                notUse3P: true/false    // If you want to generate and use a RampID based on a LiveRamp 3p cookie (from a previous authentication) until ATS can generate a new RampID, set this property to false
            },
            storage: {
                type: "cookie",
                name: "idl_env",        // "idl_env" is the required storage name
                expires: 15,            // RampID envelope can last for 15 days
                refreshInSeconds: 1800  // RampID envelope will be updated every 30 minutes
            }
        }],
        syncDelay: 3000                 // 3 seconds after the first auction
    }
});
{% endhighlight %}

2) Publisher passes a Placement ID and elects to store the RampID envelope in HTML5 localStorage.

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "identityLink",
            params: {
                pid: '999',             // Set your Placement ID here
                notUse3P: true/false    // If you want to generate and use a RampID based on a LiveRamp 3p cookie (from a previous authentication) until ATS can generate a new RampID, set this property to false
            },
            storage: {
                type: "html5",
                name: "idl_env",        // "idl_env" is the required storage name
                expires: 15,            // RampID envelope can last for 15 days
                refreshInSeconds: 1800  // RampID envelope will be updated every 30 minutes
            }
        }],
        syncDelay: 3000                 // 3 seconds after the first auction
    }
});
{% endhighlight %}

### SharedID

This module stores an unique user id in the first party domain and makes it accessible to all adapters. Similar to IDFA and AAID, this is a simple UUID that can be utilized to improve user matching, especially for iOS and MacOS browsers, and is compatible with ITP (Intelligent Tracking Prevention). It’s lightweight and self contained. Adapters that support SharedId will be able to pick up the user ID and return it for additional server-side cross device tracking.

There is no special registration or configuration for SharedID. Each publisher's privacy policy should take
SharedID into account.  Prebid  recommends implementing a method where users can easily opt-out of targeted advertising. Please refer to the User Opt-Out section located at the bottom of this page. For more information check out Prebid's dedicated [identity page](/identity/sharedid.html)

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=sharedIdSystem

#### SharedID ID Configuration

In addition to the parameters documented above in the Basic Configuration section the following SharedID specific configuration is available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'sharedId'` |
| params | Optional | Object | Customized parameters | |
| params.create | Optional | Boolean | For publisher server support only.  If true, the publisher's server will create the (pubcid) cookie.  Default is true. | `true` |
| params.pixelUrl | Optional | String | For publisher server support only. Where to call out to for a server cookie -- see [Prebid Identity](/identity/sharedid.html) for more information. | `/wp-json/pubcid/v1/extend/`
| params.extend | Optional | Boolean | If true, the expiration time of the stored IDs will be refreshed during each page load.  Default is false. | `false` |
| storage | Required | Object | The publisher must specify some kind of local storage in which to store the results of the call to get the user ID. This can be either cookie or HTML5 storage. |
| storage.expires | Integer | Required | How long the user ID information will be stored. | `365` |
| storage.name | String | Required | The name of the cookie or html5 local storage where the user ID will be stored. | `_pubcid`
| storage.type | String | Required | This is where the results of the user ID will be stored. Must be either: Must be either: "cookie" or "html5". For server side implementations, which have the best identifier life and revenue impact, this must be a cookie. | `cookie`

#### SharedID Examples

1) Publisher supports SharedID and first party domain cookie storage

{% highlight javascript %}
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
{% endhighlight %}

2) Publisher supports both UnifiedID and SharedID and first party domain cookie storage

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
{% endhighlight %}

3) Publisher supports SharedID and first party domain cookie storage initiated by a first party server

{% highlight javascript %}
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
{% endhighlight %}

### Trustpid

Trustpid generates unique tokens, enabling improved efficiency in programmatic advertising while safeguarding transparency and control for end customers via `trustpid.com`. A website visitor’s Trustpid is generated based on network identifiers provided by network operators and requires explicit user consent.

Trustpid is also the brand name of the service, which is provided by Vodafone Sales and Services Limited (“VSSL”).

#### Trustpid configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the module | `"trustpid"`
| params | Required | Object | Object with configuration parameters for trustpid User Id submodule | - |
| params.maxDelayTime | Required | Integer | Max amount of time (in seconds) before looking into storage for data | 2500 |
| bidders | Required | Array of Strings | An array of bidder codes to which this user ID may be sent. Currently required and supporting AdformOpenRTB | `['adf']` |
| storage | Required | Object | Local storage configuration object | - |
| storage.type | Required | String | Type of the storage that would be used to store user ID. Must be `"html5"` to utilise HTML5 local storage. | `"html5"` |
| storage.name | Required | String | The name of the key in local storage where the user ID will be stored. | `"trustpid"` |
| storage.expires | Required | Integer | How long (in days) the user ID information will be stored. For safety reasons, this information is required.| `1` |

Configuration example:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [
      {
        name: "trustpid",
        params: {
          maxDelayTime: 2500,
        },
        bidders: ["adf"],
        storage: {
          type: "html5",
          name: "trustpid",
          expires: 1,
        },
      }],
    syncDelay: 3000,
    auctionDelay: 3000
  }
});
```

#### Truspid onboarding

If you wish to find out more about Trustpid, please contact onboarding@trustpid.com

### PubProvided ID

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


#### PubProvided Configuration

{: .table .table-bordered .table-striped }
| Params under usersync.userIds[]| Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the ID module  | `"PubProvided"` |
| params | Optional | Object | Details for syncing. | |
| params.eidsFunction | Optional | function | any function that exists in the page | getIdsFn() |
| uids.atype | optional | int | ADCOM - Type of user agent the match is from | `"1"` |
| uids.ext.stype | Optional | String | Description of how the id was generated and by whom ('ppuid','DMP','other') | `DMP` |

### Quantcast ID

The Prebid Quantcast ID module stores a Quantcast ID in a first party cookie. The ID is then made available in the bid request. The ID from the cookie added in the bidstream allows Quantcast to more accurately bid on publisher inventories without third party cookies, which can result in better monetization across publisher sites from Quantcast. And, it’s free to use! For easier integration, you can work with one of our SSP partners, like PubMatic, who can facilitate the legal process as well as the software integration for you.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,quantcastIdSystem

Quantcast’s privacy policies for the services rendered can be found at
 		https://www.quantcast.com/privacy/

Publishers deploying the module are responsible for ensuring legally required notices and choices for users.

The Quantcast ID module will only perform any action and return an ID in situations where:
1. the publisher has not set a ‘coppa'  flag on the prebid configuration on their site (see [pbjs.setConfig.coppa](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#setConfig-coppa))
2. there is not a IAB us-privacy string indicating the digital property has provided user notice and the user has made a choice to opt out of sale
3. if GDPR applies, an IAB TCF v2 string exists indicating that Quantcast does not have consent for purpose 1 (cookies, device identifiers, or other information can be stored or accessed on your device for the purposes presented to you), or an established legal basis (by default legitimate interest) for purpose 10 (your data can be used to improve existing systems and software, and to develop new products).

#### Quantcast ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"quantcastId"` | `"quantcastId"` |
| params | Optional | Object | Details for Quantcast initialization. | |
| params.ClientID | Optional | String | Optional parameter for Quantcast prebid managed service partners. The parameter is not required for websites with Quantcast Measure tag. Reach out to Quantcast for ClientID if you are not an existing Quantcast prebid managed service partner: quantcast-idsupport@quantcast.com  | |


#### Quantcast ID Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "quantcastId"
        }]
    }
});
{% endhighlight %}



### Tapad ID

Tapad's ID module provides access to a universal identifier that publishers, ad tech platforms and advertisers can use for data collection and collation without reliance on third-party cookies.
Tapad's ID module is free to use and promotes collaboration across the industry by facilitating interoperability between DSPs, SSPs and publishers.

To register as an authorized user of the Tapad ID module, or for more information, documentation and access to Tapad’s Terms and Conditions please contact  [prebid@tapad.com](mailto:prebid@tapad.com).

Tapad’s Privacy landing page containing links to region-specific Privacy Notices may be found here: [https://tapad.com/privacy.html](https://tapad.com/privacy.html).

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,tapadIdSystem

#### Tapad ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"tapadId"` | `"tapadId"` |
| params | Required | Object | Details for Tapad initialization. | |
| params.company_id | Required | Number | Tapad Company Id provided by Tapad | 1234567890 |

#### Tapad ID Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
      userIds: [
        {
          name: "tapadId",
          params: {
            companyId: 1234567890
          },
          storage: {
            type: "cookie",
            name: "tapad_id",
            expires: 1
          }
        }
      ]
    }
});
{% endhighlight %}

### Teads ID

The Teads ID is a first-party identifier designed for publishers using the Teads adapter. For more information please contact [innov-ssp@teads.com](innov-ssp@teads.com)

#### Teads ID Configuration

First, add the Teads ID module to your Prebid.js build:

```shell
gulp build --modules=userId,teadsIdSystem
```

Then configure the teadsId in your `userSync` configuration.  

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"teadsId"` | `"teadsId"` |
| params | Required | Object | Details for Teads initialization. | |
| params.pubId | Required | Number | Teads Publisher Id provided by Teads | 1234 |

Replace the `pubId` value by your Publisher Teads Id that you will find in TODO

#### Teads ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'teadsId',
            params: {
                pubId: 1234
            }
        }]
    }
});
```

This will add a `userId.teadsId` property to all bidRequests. This will be read by the Teads bid adapter, and any other adapters that support EIDs:

```javascript
{
  teadsId: '2e3a00de-3800-11ed-a261-0242ac120002'
}
```


### Unified ID

The Unified ID solution is provided by adsrvr.org and the Trade Desk.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=unifiedIdSystem

#### Unified ID Registration

You can set up Unified ID in one of these ways:

- Register with The Trade Desk from their [Unified ID page](https://www.thetradedesk.com/industry-initiatives/unified-id-solution).
- Utilize a [managed services](https://prebid.org/product-suite/managed-services/) company who can do this for you.

The Unified ID privacy is covered under the [TradeDesk Services Privacy Policy](https://www.thetradedesk.com/general/privacy).

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

### Unified ID 2.0

Unified ID 2 is an email based id solution that is owned and operated by the prebid community.  Unified ID 2, relies on user consent before an id can be added to the bid stream.  Consent can be gathered by SSO providers who have integrated against the UID 2 framework, or Publishers own login & consent mechaninism.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=uid2IdSystem

#### Unified ID Registration

You can set up Unified ID 2 in one of these ways:

- Include the module to your pb.js wrapper, no registration is required
- Utilize a [managed services](https://prebid.org/product-suite/managed-services/) company who can do this for you.

Each publisher’s privacy policy should take UnifiedId 2 into account

#### Unified ID 2 Configuration

The below parameters apply only to the UID 2.0 User ID Module integration.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the UID20 module - `"uid2"` | `"uid2"` |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the UID 2.O ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"uid2": { "id": "eb33b0cb-8d35-4722-b9c0-1a31d4064888"}}` |

#### Unified ID 2 Example

Publisher has a integrated with an SSO provider that sets a cookie called __uid2_advertising_token when user consent is granted.

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'uid2'
        }]
    }
});
{% endhighlight %}


### Yahoo ConnectID

Yahoo ConnectID is a person based ID and does not depend on 3rd party cookies. It enables ad tech platforms to recognize and match users consistently across the open web. Built on top of Yahoo’s robust and proprietary ID Graph it delivers a higher find rate of audiences on publishers’ sites user targeting that respects privacy.

#### Honoring Privacy Choices

Yahoo ConnectID provides multiple mechanisms for users to manage their privacy choices. Users can manage their choices via [ConnectID Control Portal](http://connectid.yahoo.com), on the [Yahoo Privacy Dashboard](https://legal.yahoo.com/us/en/yahoo/privacy/dashboard/index.html) and [NAI’s Audience Matched Opt Out page](https://optout.networkadvertising.org/optout/email).  No further actions are required by Publishers as Yahoo will ensure that privacy choices selected by users via one of these methods are honored. We will automatically stop generating ConnectIDs for users who have opted-out.

When desired, additional privacy control can be provided to your users. Within your privacy policy or website privacy settings, [Create an Easy Opt-in Opt-out Toggle](https://documentation.help.yahooinc.com/platform/SSP/Sellers/Integrate/Create-an-Easy-OptIn-Optout-Toggle.htm) for ConnectID.

Finally, ConnectID follows all global privacy laws (such as the CCPA) and industry frameworks (such as NAI, DAA and IAB). Yahoo will auto-detect most privacy signals present on the page (including those set by prebid libraries) and not generate a ConnectID for users that have opted-out.


#### Yahoo ConnectID Registration

A Yahoo supplied publisher specific pixel Id is required. Please reach out to your account manager for assistance with setup.

Add support for Yahoo ConnectID to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,connectIdSystem


#### Yahoo ConnectID Configuration

<div class="table-responsive" markdown="1">
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'connectId'` |
| params | Required | Object | Container of all module params. ||
| params.pixelId | Required | Number | The Yahoo supplied publisher specific pixel Id  | `8976` |
| params.he | Required | String | The SHA-256 hashed user email address |`'ed8ddbf5a171981db8ef938596ca297d5e3f84bcc280041c5880dba3baf9c1d4'`|
| storage | Required | Object | Defines where and for how long the results of the call to get a user ID will be stored. | |
| storage.type | Required | String | Defines where the resolved user ID will be stored (either `'cookie'` or `'html5'` localstorage).| `'html5'` |
| storage.name | Required | String | The name of the cookie or html5 localstorage where the resolved user ID will be stored. | `'connectId'` |
| storage.expires | Recommended | Integer | How long (in days) the user ID information will be stored. The recommended value is `15` | `15` |
{: .table .table-bordered .table-striped }
</div>


#### Yahoo ConnectID Examples

```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "connectId",
            params: {
              pixelId: 8976,
              he: "ed8ddbf5a171981db8ef938596ca297d5e3f84bcc280041c5880dba3baf9c1d4"
            },
            storage: {
              type: "html5",
              name: "connectId",
              expires: 15
            }
        }]
    }
})
```

### GRAVITO ID by Gravito Ltd.

Gravito ID, provided by [Gravito Ltd.](https://gravito.net), is ID for ad targeting by using 1st party cookie.
Please contact Gravito Ltd. for using this ID.

Add the Gravito ID to your Prebid.js Package with:

{: .alert.alert-info :}
gulp build --modules=gravitoIdSystem

#### Gravito ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"gravitompId"` |

#### Gravito ID Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'gravitompId'
        }]
    }
});
{% endhighlight %}

### OneKey IDs & Preferences

The OneKey real-time data module in Prebid has been built so that publishers
can quickly and easily setup the OneKey Addressability Framework.
This module is used along with the oneKeyRtdProvider to pass OneKey data to your partners.
Both modules are required. This module will pass oneKeyData to your partners
while the oneKeyRtdProvider will pass the transmission requests.

Background information:
- [OneKey-Network/addressability-framework](https://github.com/OneKey-Network/addressability-framework)
- [OneKey-Network/OneKey-implementation](https://github.com/OneKey-Network/OneKey-implementation)


It can be added to you Prebid.js package with:

{: .alert.alert-info :}
gulp build –modules=userId,oneKeyIdSystem

⚠️ This module works with a RTD module. Both must be configured. See the [OneKey RTD Module](/dev-docs/modules/oneKeyRtdProvider.html).

#### OneKey Registration

OneKey is a community based Framework with a decentralized approach.
Go to [onekey.community](https://onekey.community/) for more details.

#### OneKey Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"oneKeyData"` |


#### OneKey Exemple

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'oneKeyData'
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
| ID System Name | ID System Host | Prebid.js Attr: bidRequest.userId. | EID Source | Example Value |
| --- | --- | --- | --- | --- | --- | --- |
| 33Across ID | 33Across | 33acrossId | 33across.com | "1111" |
| Admixer ID | Admixer | admixerId | admixer.net | "1111" |
| adQuery QiD | adQuery | qid | adquery.io | "p9v2dpnuckkzhuc..." |
| Adtelligent ID | Adtelligent | bidRequest.userId.adtelligentId | `"1111"` |
| AMX RTB ID | AMX RTB | amxId | amxrtb.com | "3ca11058-..." |
| BritePool ID | BritePool | britepoolid | britepool.com | "1111" |
| AudienceOne ID | DAC | dacId | dac.co.jp | {"id": "1111"} |
| DeepIntent ID | Deep Intent | deepintentId | deepintent.com | "1111" |
| DMD ID | DMD | dmdId | hcn.health | "1111" |
| CpexID | CPEx | cpexId | cpex.cz | "1111" |
| CriteoID | Criteo | criteoId | criteo.com | "1111" |
| Fabrick ID | Neustar | fabrickId | neustar.biz | "1111" |
| FLoC ID | n/a | flocId | | |
| GrowthCode ID | GrowthCode | growthCodeId | growthcode.io | "1111" |
| Hadron ID | Audigent | hadronId | audigent.com | {"hadronId":"user-hadron-id", "auSeg":["segment1", "segment2"]} |
| ID+ | Zeotap | IDP | zeotap.com | "1111" |
| ID5 ID | ID5 | id5id | id5-sync.com | {uid: "1111", ext: { linkType: 2, abTestingControlGroup: false } } |
| IdentityLink | LiveRamp | idl_env | liveramp.com | "1111" |
| Intent IQ ID | Intent IQ | intentiqid | intentiq.com | "1111" |
| Kinesso ID | Kinesso | kpuid | kpuid.com | "1111" |
| LiveIntent ID | Live Intent | lipb.lipbid | liveintent.com | "1111" |
| Lotame Panorama ID | Lotame | lotamePanoramaId | crwdcntrl.net | "e4b9..." |
| MediaWallah OpenLink ID | MediaWallah | mwOpenLinkId | mediawallahscript.com | "1111" |
| merkleID | Merkle | merkleId | merkleinc.com | "1111" |
| naveggId | Navegg | naveggId | navegg.com | "1111" |
| netID | netID | netId | netid.de | "fH5A..." |
| Novatiq ID | Novatiq | novatiqId | novatiq.com | "1111" |
| Parrable ID | Parrable | parrableId | parrable.com | {"eid":"01.15946..."} |
| Publisher Link ID | n/a | publinkId | epsilon.com | |
| PubProvided ID | n/a | pubProvidedId | publisher domain | "1111" |
| Quantcast ID | n/a | quantcastId | quantcast.com | "1111" |
| Tapad ID | Tapad | tapadId | tapad.com | "1111" |
| Teads ID | Teads | teadsId | teads.com | "1111" |
| SharedID (PBJS 5.x) | n/a | pubcid | pubcid.org | "1111" |
| SharedID (PBJS 4.x)| Prebid | sharedid | sharedid.org | {"id":"01EAJWWN...", "third":"01EAJ..."} |
| Unified ID | Trade Desk | tdid | adserver.org | "1111" |
| ConnectID | Yahoo | connectId | yahoo.com | "72d04af6..." |

For example, the adapter code might do something like:

{% highlight javascript %}
   if (bidRequest.userId && bidRequest.userId.sharedid) {
    url+="&pubcid="+bidRequest.userId.sharedid;
   }
{% endhighlight %}

### Prebid Server Adapters

Bidders that want to support the User ID module in Prebid Server, need to update their server-side bid adapter to read the desired OpenRTB 'user.ext.eids.source' object and forward the relevant values to their endpoint.

See the [Prebid.js EIDs javascript source](https://github.com/prebid/Prebid.js/blob/master/modules/userId/eids.js) for the definitive list of user EID sources.

<a name="getUserIds"/>
### Exporting User IDs

If you need to export the user IDs stored by Prebid User ID module, the `getUserIds()` function will return an object formatted the same as bidRequest.userId.

```
pbjs.getUserIds() // returns object like bidRequest.userId. e.g. {"pubcid":"1111", "tdid":"2222"}
```

<a name="getUserIdsAsEids"/>

You can use `getUserIdsAsEids()` to get the user IDs stored by Prebid User ID module in ORTB Eids format. Refer [eids.md](https://github.com/prebid/Prebid.js/blob/master/modules/userId/eids.md) for output format.
```
pbjs.getUserIdsAsEids() // returns userIds in ORTB Eids format. e.g.
[
  {
      source: 'pubcid.org',
      uids: [{
          id: 'some-random-id-value',
          atype: 1
      }]
  },

  {
      source: 'adserver.org',
      uids: [{
          id: 'some-random-id-value',
          atype: 1,
          ext: {
              rtiPartner: 'TDID'
          }
      }]
  },

  {
      source: 'id5-sync.com',
      uids: [{
          id: 'ID5-12345',
          atype: 1,
          ext: {
              linkType: 2,
              abTestingControlGroup: false
          }
      }]
  }
]
```

<a name="getUserIdsAsync" />

`pbjs.getUserIds()` and `pbjs.getUserIdsAsEids()` may return only some IDs, or none at all, if they are called before all ID providers have had a chance to initialize - depending on [`auctionDelay` and/or `syncDelay`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-ConfigureUserSyncing-UserSyncProperties), that may need to wait until an auction has completed.
To access the complete set of IDs, you may use `getUserIdsAsync`, which returns a promise that is guaranteed to resolve only once all IDs are available:

```
pbjs.getUserIdsAsync().then(function (userIds) {
   // all IDs are available here:
   pbjs.getUserIds()       // same as the `userIds` argument
   pbjs.getUserIdsAsEids()
});
```

## ID Providers

If you're an ID provider that wants to get on this page:

- Fork Prebid.js and write a sub-module similar to one of the *IdSystem modules already in the [modules](https://github.com/prebid/Prebid.js/tree/master/modules) folder.
- Add your *IdSystem name into the modules/.submodules.json file
- Follow all the guidelines in the [contribution page](https://github.com/prebid/Prebid.js/blob/master/CONTRIBUTING.md).
- Submit a Pull Request against the [Prebid.js repository](https://github.com/prebid/Prebid.js).
- Fork the prebid.org [documentation repository](https://github.com/prebid/prebid.github.io), modify /dev-docs/modules/userId.md, /download.md, and submit a documentation Pull Request.

<a name="getUserIds"></a>

## ESP Configurations

Google now supports Encrypted Signals for Publishers(ESP), a program that allows publishers can explicitly share encrypted signals on bid requests with third-party bidders. User ID modules now support code which will register the signal sources and encrypted signal are created and is sent to GAM request in a3p parameter. 'encryptedSignal' configuration under userSync Module will help to configure signal sources.

Please find more details [Share encrypted signals with bidders (Beta)](https://support.google.com/admanager/answer/10488752?hl=en)

{: .table .table-bordered .table-striped }
| Param under userSync | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| encryptedSignalSources | Optional | Object | Publisher can specify the ESP config by adding encryptedSignal Object under userSync Object |  |
| encryptedSignalSources.sources | Required | Object |  An array of Object consist of sources list and encryption flag | Check below config as an example  |
| encryptedSignalSources.sources.source | Required | Array | An array of sources for which signals needs to be registered  | `['sharedid.org','criteo.com']` |
| encryptedSignalSources.sources.encrypt | Required | Boolean | Should be set to false by default. Please find below note | `true` or `false` |
| encryptedSignalSources.sources.customFunc | Required | function | This function will be defined for custom sources only and called which will return the custom data set from the page  | Check below config as an example  |
| encryptedSignalSources.registerDelay | Optional | Integer | The amount of time (in milliseconds) after which registering of signals will happen. Default value 0 is considered if 'registerDelay' is not provided. |  `3000`

{: .alert.alert-info :}
**NOTE:**
For eids encryption (encryptedSignalSources.encrypt) set to true is not recommended unless downstream is informed of the changes.

{: .alert.alert-info :}
**NOTE:**
Publishers enabling passing eids/signal through ESP should reach out to SSPs integrated through OB to make sure to take any additional steps needed to ensure impact on 3p cookie based transaction is handled and impact is minimal.

ESP Configuration Example:

```javascript
pbjs.setConfig({
    userSync: {
        ...,
        encryptedSignalSources: {
            "sources": [{
                source: ['sharedid.org', 'criteo.com', 'id5-sync.com', 'pubcid.org', 'audigent.com'],
                encrypt: false
            }, {
                source: ['pubmatic.com'],
                customFunc: () => {
                    return '{"keywords":["tech","auto"]}';
                },
                encrypt: true
            }, {
                source: ['segment.com'],
                customFunc: () => {
                    return '[{ "id": "1", "value": "seg1" },{ "id": "2", "value": "seg2" }]';
                },
                encrypt: true
            }],
            "registerDelay": 3000
        },
        ....
    }
})

```

This will have no effect until you call the `registerSignalSources` API. This method must be called
**after** the `pbjs.setConfig` and `gpt.js` has loaded. See [API reference for `registerSignalSources`](/dev-docs/publisher-api-reference/registerSignalSources.html)


## Further Reading

* [Prebid.js Usersync](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing)
* [GDPR ConsentManagement Module](/dev-docs/modules/consentManagement.html)
