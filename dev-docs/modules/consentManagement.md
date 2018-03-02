---
layout: page
title: Module - GDPR ConsentManagement
description: User ID persisted in first party domain
top_nav_section: dev_docs
nav_section: modules
module_code : consentManagement
display_name : GDPR ConsentManagement
---

<div class="bs-docs-section" markdown="1">

# GDPR ConsentManagement Module
{:.no_toc}

Designed to support the EU General Data Protection Regulation ([GDPR](https://www.eugdpr.org/)), this module works with supported Consent Management Platforms (CMPs) to fetch an encoded string representing the user's consent choices and make it available for adapters to consume and process.

This module will perform its tasks with the CMP prior to the auction starting.  A rough synopsis of this interaction process would be:

1. Fetch the user's encoded consent string from the CMP.
2. If this request doesn't return a string, we assume this is a new-user and is undergoing the consent process.  We will wait for a signal from the CMP that the consent has finished and perform the lookup again.
3. With a valid consent string, we will incorporate this data into the auction objects (for adapters to collect) and then allow the auction to proceed.

There are timeout settings in place in the module to permit this interaction with the CMP a specified length of time to operate before it's unacceptable or assumed an issue has occurred.  

When this timeout occurs, one of two options are taken, either:

1. The auction is canceled outright 
2. The auction proceeds without the user's consent information.  

Though these options are mutually exclusive, they are configurable by the site with the site's implementation of the prebid code (see further below for details) so that they can be used in the proper scenarios for that site/audience (as decided by the site's developers).


## Page integration

To utilize this module, a separate CMP needs to be implemented onto the site to interact with the user and obtain their consent choices.  

The actual implementation details of this CMP is not covered by this page; any questions on that implemenation should be referred to the CMP in question.  However, we would recommend to have the CMP's code located before the prebid code in the head of the page, in order to ensure their framework is implemented before the prebid code starts to execute.

The module currently supports the following CMPs:

* IAB (iab)

Once the CMP is implemented, simply include the module in your build and add a consentManagement object in the setConfig() call.  Adapters that support this feature will be able to retrieve the consent information and incorporate it in their requests.

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| cmp | `string` | The ID for the CMP in use on the page.  Default is 'iab' | 'iab' |
| waitForConsentTimeout | `integer` | Length of time (in milliseconds) to allow the CMP to perform its tasks before aborting the process. Default is 5000 | 5000 |
| lookUpFailureResolution | `string` | A setting to determine what will happen when obtaining consent information from the CMP fails; to either **cancel** the auction entirely or **proceed** with the auction minus the user's encoded consent string. Default is 'proceed' | 'proceed' or 'cancel' |

Example: Using IAB CMP with a custom timeout value and cancel option.

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            cmp: 'iab',
            waitForConsentTimeout: 4000,
            lookUpFailureResolution: 'cancel'
          }
        });
        pbjs.addAdUnits(adUnits);
     });
{% endhighlight %}

### Build the package
 
#### Step 1: Bundle the module code

Follow the basic build instructions on the Github repo's main README. To include the module, an additional option must be added to the the gulp build command:
 
{% highlight bash %}
gulp build --modules=consentManagement,bidAdapter1,bidAdapter2
{% endhighlight %}
 
#### Step 2: Publish the package(s) to the CDN

After testing, get your javascript file(s) out to your Content Delivery Network (CDN) as normal.

Note that there are more dynamic ways of combining these components for publishers or integrators ready to build a more advanced infrastructure.

## Adapter integration

Adapters should look for `bidderRequest.gdprConsent` in buildRequests() method. 

{% highlight js %}
{
  "bidderCode": "appnexus",
  "auctionId": "e3a336ad-2761-4a1c-b421-ecc7c5294a34",
  "bidderRequestId": "14c4ede8c693f",
  "bids": [
    {
      "bidder": "appnexus",
      "params": {
        "placementId": "10433394"
      },
      "adUnitCode": "ad-unit-code",
      "transactionId": "0e8c6732-0999-4ca8-b44f-8fe514f53cc3",
      "sizes": [[300, 250], [300, 600]],
      "bidId": "2e6fe30b22b4fc",
      "bidderRequestId": "14c4ede8c693f",
      "auctionId": "e3a336ad-2761-4a1c-b421-ecc7c5294a34"
    }
  ],
  "auctionStart": 1520001292880,
  "timeout": 3000,
  "gdprConsent": {
    "consentString": "BOJ/P2HOJ/P2HABABMAAAAAZ+A==",
    "consentRequired": true
  },
  "start": 1520001292884,
  "doneCbCallCount": 0
}
{% endhighlight %}


## Technical Details

- 

</div>
