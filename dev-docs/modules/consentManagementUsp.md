---
layout: page_v2
page_type: module
title: Consent Management - US Privacy
description: Module to consume and distribute US Privacy consent information to bidder adapters
module_code : consentManagementUsp
display_name : Consent Management - US Privacy
enable_download : true
sidebarType : 1
---

# US Privacy Consent Management Module
{: .no_toc }

* TOC
{: toc }

## Overview

This consent management module is designed to support the California Consumer Privacy Act ([CCPA](https://www.iab.com/guidelines/ccpa-framework/)). The IAB has generalized these guidelines to cover future regulations, referring to the feature as "US Privacy."

This module works with supported [Consent Management Platforms](https://www.cmswire.com/information-management/what-is-a-consent-management-platform/) (CMPs) to fetch an encoded string representing the user's consent choices and make it available for adapters to consume and process.

{: .alert.alert-info :}
See also the [Prebid Consent Management - GDPR Module](/dev-docs/modules/consentManagement.html) for supporting the EU General Data Protection Regulation (GDPR)

{: .alert.alert-warning :}
Prebid functionality created to address regulatory requirements does not replace each party's responsibility to determine its own legal obligations and comply with all applicable laws.
**We recommend consulting with your legal counsel before determining how to utilize these features in support of your overall privacy approach.**

Here's a summary of the interaction process:

1. Fetch the user's US Privacy (CCPA) consent data from the CMP.
2. Incorporate this data into the auction objects for adapters to collect.
3. Proceed with the auction.

In the the case of a new user, CMPs will generally respond only after there is consent information available (i.e., the user has made their consent choices).
Making these selections can take some time for the average user, so the module provides timeout settings.

If the timeout period expires or an error from the CMP is thrown, the auction proceeds without the user's consent information.

## Page Integration

To utilize this module, a CMP compatible with the [IAB 1.1 TCF spec](https://iabeurope.eu/tcf-v1/) needs to be implemented onthe site to interact with the user and obtain their consent choices.

Though implementation details for the CMP are not covered by Prebid.org, we do recommend to that you place the CMP code before the Prebid.js code in the head of the page in order to ensure the CMP's framework is loaded before the Prebid code executes.

Once the CMP is implemented, simply include this module into your build and add a `consentManagement` object in the `setConfig()` call.  Adapters that support this feature will then be able to retrieve the consent information and incorporate it in their requests.

Here are the parameters supported in the `consentManagement` object:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| usp | `Object` | | |
| usp.cmpApi | `string` | The CMP interface that is in use. Supported values are **'iab'** or **'static'**. Static allows integrations where IAB-formatted consent strings are provided in a non-standard way. Default is `'iab'`. | `'iab'` |
| usp.timeout | `integer` | Length of time (in milliseconds) to allow the CMP to obtain the CCPA consent string. Default is `10000`. | `10000` |
| usp.consentData | `Object` | An object representing the CCPA consent data being passed directly; only used when cmpApi is 'static'. Default is `undefined`. | |

### Examples

Example 1: Support both US Privacy and GDPR

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
       pbjs.setConfig({
         consentManagement: {
           gdpr: {
            cmpApi: 'iab',
            allowAuctionWithoutConsent: false, // suppress auctions if there's no GDPR consent string
            timeout: 3000  // GDPR timeout 3000ms
           },
           usp: {
            timeout: 100 // US Privacy timeout 100ms
           }
         }
       });
     });
{% endhighlight %}

Example 2: Support US Privacy

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
       pbjs.setConfig({
         consentManagement: {
           usp: {
            cmpApi: 'iab',
            timeout: 100 // US Privacy timeout 100ms
           }
         }
       });
     });
{% endhighlight %}

Example 3: Static CMP using custom data passing.

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            usp: {
              cmpApi: 'static',
              consentData: {
                getUSPData: {
                  uspString: '1YYY'
                }
              }
            }
          }
        });
     });
{% endhighlight %}

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the consent management module, an additional option must be added to the the **gulp build** command:

{% highlight bash %}
gulp build --modules=consentManagementUsp,bidAdapter1,bidAdapter2
{% endhighlight %}

## Adapter Integration

If you are submitting changes to an adapter to support this approach, please also submit a PR to the [docs repo](https://github.com/prebid/prebid.github.io) to add the `usp_supported: true` variable to your respective page in the [bidders directory](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders).  **This will ensure that your adapter's name will automatically appear on the list of adapters supporting US Privacy.**

### Bidder Adapter US Privacy Integration

To find the US Privacy/CCPA consent information to pass along to your system, adapters should look for the `bidderRequest.uspConsent` field in their `buildRequests()` method.
Below is a sample of how the data is structured in the `bidderRequest` object:

{% highlight js %}
{
  "bidderCode": "bidderA",
  "auctionId": "e3a336ad-2222-4a1c-bbbb-ecc7c5554a34",
  ...
  "uspConsent": "1YYY",
  ...
}
{% endhighlight %}

### UserSync Integration

The `usPrivacy` object is also available when registering `userSync` pixels.
The object can be accessed by including it as an argument in the `getUserSyncs` function:

{% highlight js %}
getUserSyncs: function(syncOptions, responses, gdprConsent, usPrivacy) {
...
}
{% endhighlight %}

Depending on your needs, you could include the consent information in a query of your pixel and/or, given the consent choices, determine if you should drop the pixels at all.

## Adapters Supporting US Privacy / CCPA

<script src="/assets/js/dynamicTable.js" type="text/javascript"></script>

<script type="text/javascript">
var adaptersSupportingUsp=[];
var idx_usp=0;
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for item in bidder_pages %}
    {% if item.usp_supported == true %}
	adaptersSupportingUsp[idx_usp]={};
	adaptersSupportingUsp[idx_usp].href="/dev-docs/bidders.html#{{item.biddercode}}";
	adaptersSupportingUsp[idx_usp].text="{{item.title}}";
	idx_usp++;
    {% endif %}
{% endfor %}
</script>

<div id="adaptersTableUsp">
        <script>
           writeDynamicTable({div: "adaptersTableUsp", data: "adaptersSupportingUsp", sort: "rowFirst", striped: false} );
        </script>
</div>
