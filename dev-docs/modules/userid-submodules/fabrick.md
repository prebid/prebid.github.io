---
layout: userid
title: Fabrick ID by Neustar
description: Fabrick ID by Neustar User ID sub-module
useridmodule: fabrickIdSystem
---


[Neustar Fabrick™](https://www.home.neustar/fabrick) is a unified identity ecosystem that powers connections between brands, publishers, and consumers to accelerate marketing performance across online and offline channels.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=fabrickIdSystem

## Fabrick Registration

Please reach out to [FabrickIntegrations@team.neustar](mailto:FabrickIntegrations@team.neustar) to request your `apiKey`.

## Fabrick Configuration

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

## Fabrick Examples

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
