---
layout: userid
title: Unified ID 2.0
description: Unified ID 2.0 User ID sub-module
useridmodule: unified2
---


Unified ID 2 is an email based id solution that is owned and operated by the prebid community.  Unified ID 2, relies on user consent before an id can be added to the bid stream.  Consent can be gathered by SSO providers who have integrated against the UID 2 framework, or Publishers own login & consent mechaninism.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=uid2IdSystem

## Unified ID Registration

You can set up Unified ID 2 in one of these ways:

- Include the module to your pb.js wrapper, no registration is required
- Utilize a [managed services](https://prebid.org/product-suite/managed-services/) company who can do this for you.

Each publisher’s privacy policy should take UnifiedId 2 into account

## Unified ID 2 Configuration

The below parameters apply only to the UID 2.0 User ID Module integration.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the UID20 module - `"uid2"` | `"uid2"` |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the UID 2.O ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"uid2": { "id": "eb33b0cb-8d35-4722-b9c0-1a31d4064888"}}` |

## Unified ID 2 Example

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


