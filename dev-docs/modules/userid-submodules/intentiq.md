---
layout: userid
title: Intent IQ ID
description: Intent IQ ID User ID sub-module
useridmodule: intentIqIdSystem
---


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

## Intent IQ ID Registration

You can set up Intent IQ ID by contacting our operations team at [Intent IQ Contact Us](https://www.intentiq.com/contact-us) and getting your partner id.

The Intent IQ ID privacy is covered under the [Intent IQ Privacy Policy](https://www.intentiq.com/technology-privacy-policy).

## Intent IQ ID Configuration

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

## Intent IQ ID Examples

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
