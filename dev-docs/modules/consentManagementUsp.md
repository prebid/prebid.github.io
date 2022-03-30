---
layout: page_v2
page_type: module
title: Consent Management - US Privacy
description: If you have users in California, this module works with your Consent Management Platform to pass CCPA/US-Privacy data to bidders.
module_code : consentManagementUsp
display_name : Consent Management - US Privacy
enable_download : true
recommended: true
sidebarType : 1
---

# US Privacy Consent Management Module
{: .no_toc }

* TOC
{: toc }

{% capture legalNotice %}

  This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European and /or US regulations, including the GDPR, the ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.
  {% endcapture %}

{% include /alerts/alert_important.html content=legalNotice %}

## Overview

This consent management module is designed to support the California Consumer Privacy Act ([CCPA](https://www.iab.com/guidelines/ccpa-framework/)). The IAB has generalized these guidelines to cover future regulations, referring to the feature as "US Privacy."

This module works with an IAB-compatible US Privacy API (USP-API) to fetch an encoded string representing the user's notice and opt-out choices and make it available for adapters to consume and process.

{: .alert.alert-info :}
See also the [Prebid Consent Management - GDPR Module](/dev-docs/modules/consentManagement.html) for supporting the EU General Data Protection Regulation (GDPR)

Here's a summary of the interaction process:

1. Fetch the user's US Privacy (CCPA) notice and opt out status from the USP-API.
2. Incorporate this data into the auction objects for adapters to collect.
3. Proceed with the auction.

The IAB USP-API will respond immediately if it is available. The module timeout settings are not related to user selection, but only to API availability.

If the timeout period expires or an error from the USP-API is thrown, the auction proceeds without a US Privacy string attached.

 The string has four characters:

{: .table .table-bordered .table-striped }
| String Component | Values |
| --- | --- |
| 1) Specification Version|	1|
| 2) Explicit Notice/Opportunity to Opt Out|	(N = No,Y = Yes,– = Not Applicable)|
| 3) Has user opted-out of the sale of his or her personal information?| 	(N = No,Y = Yes,– = Not Applicable)|
| 4) Publisher is a signatory to the IAB Limited Service Provider Agreement| 	(N = No,Y = Yes,– = Not Applicable)|

## Page Integration

To utilize this module, software that provides the [USP-API](https://github.com/InteractiveAdvertisingBureau/USPrivacy/blob/master/CCPA/USP%20API.md) must to be implemented on the site to interact with the user and obtain their notice and opt-out status.


Though implementation details for the USP-API are not covered by Prebid.org, we do recommend to that you place the code before the Prebid.js code in the head of the page in order to ensure the framework is loaded before the Prebid code executes.

Once the USP-API is implemented, simply include this module into your build and add a `consentManagement` object in the `setConfig()` call.  Adapters that support this feature will then be able to retrieve the notice and opt-out status information and incorporate it in their requests.

Here are the parameters supported in the `consentManagement` object:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| usp | `Object` | | |
| usp.cmpApi | `string` | The USP-API interface that is in use. Supported values are **'iab'** or **'static'**. Static allows integrations where IAB-formatted strings are provided in a non-standard way. Default is `'iab'`. | `'iab'` |
| usp.timeout | `integer` | Length of time (in milliseconds) to allow the USP-API to obtain the CCPA string. Default is `50`. | `50` |
| usp.consentData | `Object` | An object representing the CCPA notice and opt-out status data being passed directly; only used when cmpApi is 'static'. Default is `undefined`. | |

{: .alert.alert-info :}
Note that the term 'CMP' (Consent Management Platform) was chosen in Prebid to keep the interface similar
to the GDPR implementation, though US-Privacy doesn't specifically use that term.




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

To find the US Privacy/CCPA notice and opt-out status information to pass along to your system, adapters should look for the `bidderRequest.uspConsent` field in their `buildRequests()` method.
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

Depending on your needs, you could include the US-Privacy information in a query of your pixel and/or, given the notice and opt-out status choices, determine if you should drop the pixels at all.

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
