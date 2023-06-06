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
   1. If the relevant local storage is present or the value of the id is specified in the configuration, the module doesn't call the URL and instead parses the scheme-dependent format, injecting the resulting ID into `bidRequest.userId`.
   1. If GDPR applies, the consent signal from the CMP is hashed and stored in a cookie called `_pbjs_userid_consent_data`. This is required so that ID sub-modules may be called to refresh their ID if the user's consent preferences have changed from the previous page, and ensures cached IDs are no longer used if consent is withdrawn.
1. An object containing one or more IDs (`bidRequest.userId`) is made available to Prebid.js adapters and Prebid Server S2S adapters.
1. In addition to `bidRequest.userId`, `bidRequest.userIdAsEids` is made available to Prebid.js adapters and Prebid Server S2S adapters. `bidRequest.userIdAsEids` has userIds in ORTB EIDS format.
1. The page can call [pbjs.getUserIds()](/dev-docs/publisher-api-reference/getUserIds.html), [pbjs.getUserIdsAsEids()](/dev-docs/publisher-api-reference/getUserIdsAsEids.html), or [pbjs.getUserIdsAsync()](/dev-docs/publisher-api-reference/getUserIdsAsync.html).

{: .alert.alert-info :}
Note that User IDs aren't as popular in the mobile app world because device ID is available in those ad serving scenarios.

{: .alert.alert-info :}
Not all bidder adapters support all forms of user ID. See the tables below for a list of which bidders support which ID schemes.

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

* read from an in-page javascript variable and set `_pbjs_id_optout` to any value.
* call an in-page function and use the results to create a `_pbjs_id_optout` cookie with any value.


## Basic Configuration

By including this module and one or more of the sub-modules, a number of new options become available in `setConfig()`,
under the `userSync` object as attributes of the `userIds` array of sub-objects.

The `value` parameter can be used to indicate an identifier the publisher has obtained via a direct integration with that identity provider that the publisher wishes to make available to Prebid.js bidders.

Publishers using Google AdManager may want to sync one of the identifiers as their Google PPID for frequency capping or reporting.
The PPID in GAM (which is unrelated to the PPID UserId Submodule) has strict rules; refer to [Google AdManager documentation](https://support.google.com/admanager/answer/2880055?hl=en) for them. Please note, Prebid uses a [GPT command](https://developers.google.com/publisher-tag/reference#googletag.PubAdsService) to sync identifiers for publisher convenience. It doesn't currently work for instream video requests, as Prebid typically interacts with the player, which in turn may interact with IMA. IMA does has a [similar method](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.ImaSdkSettings#setPpid) as GPT, but IMA does not gather this ID from GPT.

{: .table .table-bordered .table-striped }
| Param under userSync | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| ppid | Optional | String | Must be a source from the [pbjs.getUserIdsAsEids()](#getUserIdsAsEids) array | `"pubcid.org"` |

The table below has the options that are common across ID systems. See the sections below for specific configuration needed by each system and examples.

{% assign userid_pages = site.pages | where: "layout", "userid" | sort_natural: "title" %}

{% assign name_string = "" %}
{% assign count = 0 %}

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | May be any of the following values: {% for page in userid_pages -%}{% if count == 1 %}{{ name_string | append: ", " -}}{% endif %}{% assign count = 1 %}`"{{ name_string | append: name_string -}}{{ name_string | append: page.useridmodule -}}"`{% endfor %} | `"unifiedId"`
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

{% assign userid_pages = site.pages | where: "layout", "userid" | sort_natural: "title" %}

{% for page in userid_pages %}
<li><a href="/{{ page.path | replace: '.md', '.html'}}">{{page.title}}</a></li>
{% endfor %}


## Bidder Adapter Implementation

If your ID structure is complicated, it is helpful to add tests for `pbjs.getUserIds()`, `pbjs.getUserIdsAsEids()` and `pbjs.getUserIdsAsync()`.

To add a custom data type for the response of `pbjs.getUserIdsAsEids()`, see other examples within the `createEidsArray` method in [/modules/userId/eid.js](https://github.com/prebid/Prebid.js/blob/master/modules/userId/eids.js).

### Prebid.js Adapters

Bidders that want to support the User ID module in Prebid.js need to update their bidder adapter to read the indicated bidRequest attributes and pass them to their endpoint.

{: .table .table-bordered .table-striped }
| ID System Name | ID System Host | Prebid.js Attr: bidRequest.userId. | EID Source | Example Value |
| --- | --- | --- | --- | --- | --- | --- |
| 33Across ID | 33Across | 33acrossId | 33across.com | "1111" |
| Admixer ID | Admixer | admixerId | admixer.net | "1111" |
| adQuery QiD | adQuery | qid | adquery.io | "p9v2dpnuckkzhuc..." |
| Adriver ID | Adriver | adriverId | adriver.ru | "1111" |
| Adtelligent ID | Adtelligent | bidRequest.userId.adtelligentId | `"1111"` |
| AMX ID | AMX | amxId | amxdt.net | "3ca11058-..." |
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
| ConnectID | Yahoo | connectId | yahoo.com | {"connectId": "72d04af6..."} |

For example, the adapter code might do something like:

```javascript
   if (bidRequest.userId && bidRequest.userId.sharedid) {
    url+="&pubcid="+bidRequest.userId.sharedid;
   }
```

### Prebid Server Adapters

Bidders that want to support the User ID module in Prebid Server need to update their server-side bid adapter to read the desired OpenRTB 'user.ext.eids.source' object and forward the relevant values to their endpoint.

See the [Prebid.js EIDs javascript source](https://github.com/prebid/Prebid.js/blob/master/modules/userId/eids.js) for the definitive list of user EID sources.

<a name="getUserIds"/>
### Exporting User IDs

If you need to export the user IDs stored by Prebid User ID module, the `getUserIds()` function will return an object formatted the same as bidRequest.userId.

```javascript
pbjs.getUserIds() // returns object like bidRequest.userId. e.g. {"pubcid":"1111", "tdid":"2222"}
```

<a name="getUserIdsAsEids"/>

You can use `getUserIdsAsEids()` to get the user IDs stored by Prebid User ID module in ORTB Eids format. Refer [eids.md](https://github.com/prebid/Prebid.js/blob/master/modules/userId/eids.md) for output format.

```javascript
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

```javascript
pbjs.getUserIdsAsync().then(function (userIds) {
   // all IDs are available here:
   pbjs.getUserIds()       // same as the `userIds` argument
   pbjs.getUserIdsAsEids()
});
```

## ID Providers

If you're an ID provider that wants to get on this page:

* Fork Prebid.js and write a sub-module similar to one of the *IdSystem modules already in the [modules](https://github.com/prebid/Prebid.js/tree/master/modules) folder.
* Add your *IdSystem name into the modules/.submodules.json file
* Follow all the guidelines in the [contribution page](https://github.com/prebid/Prebid.js/blob/master/CONTRIBUTING.md).
* Submit a Pull Request against the [Prebid.js repository](https://github.com/prebid/Prebid.js).
* Fork the prebid.org [documentation repository](https://github.com/prebid/prebid.github.io), modify /dev-docs/modules/userId.md, /download.md, and submit a documentation Pull Request.

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
