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

{: .alert.alert-info :}
The User ID module will be available with Prebid.js 2.10.0, launching with support for two ID systems: Unified ID and PubCommonID.

## Overview

The User ID module supports multiple ways of establishing pseudonymous IDs for users, which is an important way of increasing the value of header bidding. Instead of having several exchanges sync IDs with dozens of demand sources, a publisher can choose to integrate with one of these ID schemes:

* **Unified ID** – a simple cross-vendor approach – it calls out to a URL that responds with that user’s ID in one or more ID spaces (e.g. adsrvr.org). The result is stored in the user’s browser for future requests and is passed to bidder adapters to pass it through to SSPs and DSPs that support the ID scheme.
* **PubCommon ID** – an ID is generated on the user’s browser and stored for later use on this publisher’s domain.

## How It Works

1. The publisher builds Prebid.js with the optional User ID module
1. The page defines User ID configuration in `pbjs.setConfig()`
1. When `setConfig()` is called, and if the user has consented to storing IDs locally, the module is invoked to call the URL if needed
   1. If the relevant local storage is present, the module doesn't call the URL and instead parses the scheme-dependent format, injecting the resulting ID into bidRequest.userIds.
1. An object containing one or more IDs (bidRequest.userIds) is made available to Prebid.js adapters and Prebid Server S2S adapters.

Note that User IDs aren't needed in the mobile app world because device ID is available in those ad serving scenarios.

Also note that not all bidder adapters support all forms of user ID. See the tables below for a list of which bidders support which ID schemes.

{: .alert.alert-success :}
While the Unified ID approach is open to other cookie vendors, the
only one currently supporting Prebid.js is The Trade Desk. Prebid.org
welcomes other ID vendors - create a PR or email support@prebid.org.

## User ID, GDPR, and Opt-Out

When paired with the `CookieConsent` module, privacy rules are enforced:

* The module checks the GDPR consent string
* If no consent string is available OR if the user has not consented to Purpose 1 (local storage):
  * Calls to an external user ID vendor are not made.
  * Nothing is stored to cookies or HTML5 local storage.

In addition, individual users may opt-out of receiving cookies and HTML5 local storage by setting these values:

* `_pbjs_id_optout` cookie or HTML5 local storage
* `_pubcid_optout` cookie or HTML5 local storage (for backwards compatibility with the PubCommonID module.

## Registering for Unified ID

You can set up Unified ID in one of these ways:

- Register with The Trade Desk from their [Unified ID page](https://www.thetradedesk.com/industry-initiatives/unified-id-solution).
- Utilize a [managed services](/prebid/managed.html) company who can do this for you.

## Examples

1) Publisher has a partner ID with The Trade Desk, and is using the default endpoint for Unified ID.

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
                name: "pbjs-unifiedid",       // create a cookie with this name
                expires: 60                   // cookie can last for 60 days
            }
        }],
        syncDelay: 5000              // 5 seconds after the first bidRequest()
    }
});
{% endhighlight %}

2) Publisher supports UnifiedID with a vendor other than Trade Desk, HTML5 local storage, and wants to delay the auction up to 250ms to obtain the user ID:

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
        syncDelay: 250
    }
});
{% endhighlight %}

3) Publisher has integrated with UnifiedID on their own and wants to pass the UnifiedID directly through to Prebid.js

{% highlight javascript %}
pbjs.setConfig({
    usersync: {
        userIds: [{
            name: "unifiedId",
            value: {"tdid": "D6885E90-2A7A-4E0F-87CB-7734ED1B99A3", 
                     "appnexus_id": "1234"}
        }]
    }
});
{% endhighlight %}

4) Publisher supports PubCommonID and first party domain cookie storage

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

5) Publisher supports both UnifiedID and PubCommonID and first party domain cookie storage

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

## Configuration

By including this module, the following options become available in `setConfig()`,
all of them under the `usersync` object as attributes of the `userIds` array
of sub-objects. See the examples above for specific use cases.

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | May be: `"unifiedId"` or `"pubCommonId"` | `"unifiedId"` |
| params | Required for UnifiedId | Object | Details for UnifiedId. | |
| params.partner | Required if using Trade Desk | String | This is the partner ID value obtained from registering with The Trade Desk or working with a Prebid.js managed services provider. | `"myTtdPid"` |
| params.url | Required if not using Trade Desk | String | If specified for UnifiedId, overrides the default Trade Desk URL. | "https://unifiedid.org/somepath?args" |
| storage | Required (unless `value` is specified) | Object | The publisher must specify some kind of local storage in which to store the results of the call to get the user ID. This can be either cookie or HTML5 storage. | |
| storage.type | Required | String | Must be either `"cookie"` or `"html5"`. This is where the results of the user ID will be stored. | `"cookie"` |
| storage.name | Required | String | The name of the cookie or html5 local storage where the user ID will be stored. | `"_unifiedId"` |
| storage.expires | Optional | Integer | How long (in days) the user ID information will be stored. Default is 30 for UnifiedId and 1825 for PubCommonID | `365` |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the Unified ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"tdid": "D6885E90-2A7A-4E0F-87CB-7734ED1B99A3"}` |

## Adapters Supporting the User ID Module

{% assign bidder_pages = site.pages | where: "layout", "bidder" %}

<table class="pbTable">
<tr class="pbTr"><th class="pbTh">Bidder</th><th class="pbTh">IDs Supported</th></tr>
{% for item in bidder_pages %}
{% if item.userIds != nil %}
<tr class="pbTr"><td class="pbTd">{{item.biddercode}}</td><td class="pbTd">{{item.userIds}}</td></tr>
{% endif %}
{% endfor %}
</table>

## Implementation Details

For bidders that want to support one or more of these ID systems, and for publishers who want to understand their options, here are the specific details.

{: .table .table-bordered .table-striped }
| ID System Name | ID System Host | Prebid.js Attr | Prebid Server Attr | Notes |
| --- | --- | --- | --- | --- | --- |
| PubCommon ID | n/a | bidRequest.userIds.pubcid | user.ext.tpid[].source="pubcid" | PubCommon is unique to each publisher domain. |
| Unified ID | Trade Desk | bidRequest.userIds.ttid | user.ext.tpid[].source="tdid" | |

If you're an ID provider that want to get on this list, feel free to submit a PR or an [Issue](https://github.com/prebid/Prebid.js/issues).

If you're bidder that wants to support the User ID module in Prebid.js, you'll need to update your bidder adapter to read the indicated bidRequest attributes.

If you're bidder that wants to support the User ID module in Prebid Server, you'll n
eed to update your server-side bid adapter to read the indicated OpenRTB attributes. For example:

{% highlight bash %}
{
  "user": {
    "ext": {
      "tpid": [{
        "source": "tdid",
        "uid": "19cfaea8-a429-48fc-9537-8a19a8eb4f0c"
      },
      {
        "source": "pubcid",
        "uid": "29cfaea8-a429-48fc-9537-8a19a8eb4f0d"
      }]
    }
  }
}
{% endhighlight %}

## Further Reading

* [Prebid.js Usersync](/dev-docs/publisher-api-reference.html#setConfig-Configure-User-Syncing)
* [GDPR ConsentManagement Module](/dev-docs/modules/consentManagement.html)
