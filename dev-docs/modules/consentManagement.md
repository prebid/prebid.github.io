---
layout: page_v2
page_type: module
title: Module - Consent Management
description: Add on module to consume and distribute consent information to bidder adapters
module_code : consentManagement
display_name : Consent Management
enable_download : true
sidebarType : 1
---

# Consent Management Module
{: .no_toc }

* TOC
{: toc }

## Overview

This module is designed to support the following privacy regulations:

- EU General Data Protection Regulation ([GDPR](https://www.iab.com/topics/consumer-privacy/gdpr/)),
- California Consumer Privacy Act ([CCPA](https://www.iab.com/guidelines/ccpa-framework/)). The IAB has generalized this to cover future regulations, referring to their feature as 'US Privacy'.

It works with supported Consent Management Platforms (CMPs) to fetch an encoded string representing the user's consent choices and make it available for adapters to consume and process.

{: .alert.alert-warning :}
Prebid functionality created to address regulatory requirements does not replace each party's responsibility to determine its own legal obligations and comply with all applicable laws.
In otherwords, **we recommend consulting with legal counsel before determining how to utilize these features in support of your overall privacy approach.**

A summary of the interaction process:

1. Fetch the user's GDPR and/or US-Privacy(CCPA) consent data from the CMP.
2. Incorporate this data into the auction objects for adapters to collect
3. Proceed with the auction

In the the case of a new user, CMPs will generally respond only once there is consent information available; ie the user picked their consent choices.
Given that this can take some time for the average user, the module provides timeout settings.

If the timeout occurs or if an error from the CMP is thrown, one of these things occurs:

1. The auction is canceled outright. (configurable for GDPR only)
2. The auction proceeds without the user's consent information.  

## Page Integration

To utilize this module, a CMP compatible with the [IAB 1.1 TCF spec](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework) needs to be implemented onto the site to interact with the user and obtain their consent choices.  

Though implementation details for the CMP are not covered by Prebid.org, we do recommend to that the CMP's code be located before the Prebid.js code in the head of the page, in order to ensure their framework is loaded before the Prebid code executes.

Once the CMP is implemented, simply include this module into your build and add a `consentManagement` object in the `setConfig()` call.  Adapters that support this feature will then be able to retrieve the consent information and incorporate it in their requests. Here are the parameters supported in the `consentManagement` object:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| cmpApi | `string` | Which CMP interface is in use. Supported values are **'iab'** or **'static'**. Static allows integrations where IAB-formatted consent strings are provided in a non-standard way. Default is `'iab'`. | `'iab'` |
| consentAPIs | `array of strings` | Defines which IAB privacy APIs to look for. Possible values are ['gdpr', 'usp']. The default is ['gdpr']. | `['gdpr']` |
| timeout | `integer` | Length of time (in milliseconds) to allow the CMP to obtain the GDPR consent string. Default is `10000` | `10000` |
| uspTimeout | `integer` | Length of time (in milliseconds) to allow the CMP to obtain the US-Privacy consent string. Default is `50` | `50` |
| allowAuctionWithoutConsent | `boolean` | GDPR only: determines what will happen when obtaining consent information from the CMP fails; either allow the auction to proceed (**true**) or cancel the auction (**false**). Default is `true` | `true` or `false` |
| consentData | `Object` | An object representing the GDPR consent data being passed directly, only in used when cmpApi is 'static'. Default is `undefined`. Not currently supported for US Privacy. | |

{: .alert.alert-info :}
Note that the `allowAuctionWithoutConsent` option really should be named `allowAuctionWithoutConsentString`.
Prebid.js does not parse either GDPR or US-Privacy strings, so doesn't know if the user has consented
to any particular action.

### GDPR Examples

Example 1: GDPR IAB CMP using custom timeout and cancel-auction options.

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            cmpApi: 'iab',
            timeout: 8000,
            allowAuctionWithoutConsent: false
          }
        });
        pbjs.addAdUnits(adUnits);
     });
{% endhighlight %}

Example 2: Static CMP using custom data passing.

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            cmpApi: 'static',
            allowAuctionWithoutConsent: false,
            consentData: {
              getConsentData: {
                'gdprApplies': true,
                'hasGlobalScope': false,
                'consentData': 'BOOgjO9OOgjO9APABAENAi-AAAAWd7_______9____7_9uz_Gv_r_ff_3nW0739P1A_r_Oz_rm_-zzV44_lpQQRCEA'
              },
              getVendorConsents: {
                'metadata': 'BOOgjO9OOgjO9APABAENAi-AAAAWd7_______9____7_9uz_Gv_r_ff_3nW0739P1A_r_Oz_rm_-zzV44_lpQQRCEA',
              ...
              }
            }
          }
        });
        pbjs.addAdUnits(adUnits);
     });
{% endhighlight %}

### US-Privacy Examples

Example 1: Support both US-Privacy and GDPR

{% highlight js %}
pbjs.setConfig({
       consentManagement: {
            cmpApi: 'iab',
            consentAPIs: ['gdpr', 'usp'],
            allowAuctionWithoutConsent: false, // suppress auctions if there's no GDPR consent string
            timeout: 3000,  // GDPR timeout 3000ms
            uspTimeout: 100 // US-Privacy timeout 100ms
       }
});
{% endhighlight %}

Example 1: Support US-Privacy

{% highlight js %}
pbjs.setConfig({
       consentManagement: {
            cmpApi: 'iab',
            consentAPIs: ['usp'],
            uspTimeout: 100 // US-Privacy timeout 100ms
       }
});
{% endhighlight %}

## Build the package

Follow the basic build instructions on the GitHub repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the module, an additional option must be added to the the gulp build command:

{% highlight bash %}
gulp build --modules=consentManagement,bidAdapter1,bidAdapter2
{% endhighlight %}

## Adapter Integration

_Note - for any adapters submitting changes to support this approach, please also submit a PR to the [docs repo](https://github.com/prebid/prebid.github.io) to add `gdpr_supported: true` and/or `usp_supported: true` variables to your respective page in the [bidders directory](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders).  This will have your adapter's name automatically appear on the list of adapters supporting GDPR and US Privacy._

### Bidder Adapter Integration

#### GDPR Integration

To find the GDPR consent information to pass along to your system, adapters should look for the `bidderRequest.gdprConsent` field in their buildRequests() method.
Below is a sample of how the data is structured in the `bidderRequest` object:

{% highlight js %}
{
  "bidderCode": "appnexus",
  "auctionId": "e3a336ad-2761-4a1c-b421-ecc7c5294a34",
  ...
  "timeout": 3000,
  "gdprConsent": {
    "consentString": "BOJ/P2HOJ/P2HABABMAAAAAZ+A==",
    "vendorData": {...},
    "gdprApplies": true
  },
  ...
}
{% endhighlight %}

**Notes about the data fields**

**_consentString_**

This field contains the user's choices on consent, represented as an encoded string value.  In certain scenarios, this field may come to you with an `undefined` value; normally this happens when there was an error during the CMP interaction and the publisher had the config option `allowAuctionWithoutConsent` set to `true`.  If you wish to set your own value for this scenario rather than pass along `undefined` to your system, you can check for the `undefined` value in the field and replace it accordingly.  The code sample provided in the *consentRequried* section below provides a possible approach to perform this type of check/replacement.

**_vendorData_**

This field contains the raw vendor data in relation to the user's choices on consent.  This object will contain a map of all available vendors for any potential adapters that may wish to read the data directly.  One use-case for reading this data could be if an adapter wished to be omitted in a request if they knew if consent wasn't given for them.  Adapters will need to read through the object to find their appropriate information.

**_gdprApplies_**

This boolean represents if the user in question belonged to an area where GDPR applies.  This field comes from the CMP itself; it's comes included in the response when a request is made to the CMP API.  In the odd chance for some reason this value isn't defined by the CMP, each adapter has the opportunity to set their own value for this field.
There are two general approaches that can be taken by the adapter to populate this field:

- Set a hardcoded default value.
- Using their own system, derive if consent is required for the end-user and set the value accordingly.

Using the former option, below is an example of how the integration could look:

{% highlight js %}
...
buildRequests: function (bidRequests, bidderRequest) {
  ...
  if (bidderRequest && bidderRequest.gdprConsent) {
    adapterRequest.gdpr_consent = {
      consent_string: bidderRequest.gdprConsent.consentString,
      // will check if the gdprApplies field was populated with a boolean value (ie from page config).  If it's undefined, then default to true
      consent_required: (typeof bidderRequest.gdprConsent.gdprApplies === 'boolean') ? bidderRequest.gdprConsent.gdprApplies : true
    }
  }
  ...
}
...
{% endhighlight %}

The implementation of the latter option is up to the adapter, but the general premise should be the same.  You would check to see if the `bidderRequest.gdprConsent.gdprApplies` field is undefined and if so, set the derived value from your independent system.

If neither option are taken, then there is the remote chance this field's value will be undefined.  As long as that acceptable, this could be a potential third option.

#### US-Privacy Integration

To find the US-Privacy/CCPA consent information to pass along to your system, adapters should look for the
`bidderRequest.us_privacy` field in their buildRequests() method.
Below is a sample of how the data is structured in the `bidderRequest` object:

{% highlight js %}
{
  "bidderCode": "appnexus",
  "auctionId": "e3a336ad-2761-4a1c-b421-ecc7c5294a34",
  ...
  "us_privacy": "1YYY",
  ...
}
{% endhighlight %}

### UserSync Integration

The `gdprConsent` and `usPrivacy` objects are also available when registering `userSync` pixels.
The object can be accessed by including it as an argument in the `getUserSyncs` function in the following manner:

{% highlight js %}
getUserSyncs: function(syncOptions, responses, gdprConsent, usPrivacy) {
...
}
{% endhighlight %}

Depending on your needs, you could potentially either include the consent information in a query of your pixel and/or given the consent choices determine if you should drop the pixels at all.

## Publishers not using an IAB-Compliant CMP

Prebid.js and much of the ad industry rely on the IAB CMP standard for GDPR support, but there are some publishers who may have
implemented different approach to meeting the privacy rules. Those publishers may utilize Prebid.js and the whole header bidding ecosystem if they build a translation layer between their consent method and the IAB method.

At a high level this looks like:
- build a window.__cmp() function which will be seen by Prebid
- build a message receiver function if safeframes are in use
- format consent data in a string according to the [IAB standard](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework)

Below is sample code for implementing the stub functions. Sample code for formatting the consent string may be obtained [here](https://github.com/appnexus/cmp).

{% highlight js %}
var iabConsentData;  // build the IAB consent string
var gdprApplies;     // true if gdpr Applies to the user, else false
var hasGlobalScope;  // true if consent data was retrieved globally
var responseCode;    // false if there was an error, else true
var cmpLoaded;       // true if iabConsentData was loaded and processed
(function(window, document) {
    function addFrame() {
        if (window.frames['__cmpLocator'])
            return;
        if ( document.body ) {
            var body = document.body,
                iframe = document.createElement('iframe');
            iframe.name = '__cmpLocator';
            iframe.style.display = 'none';
            body.appendChild(iframe);
        } else {
            setTimeout(addFrame, 5);
        }
    }
    addFrame();
    function cmpMsgHandler(event) {
        try {
            var json = event.data;
            var msgIsString = typeof json === "string";
            if ( msgIsString ) {
                json = JSON.parse(json);
            }
            var call = json.__cmpCall;
            if (call) {
                window.__cmp(call.command, call.parameter, function(retValue, success) {
                    var returnMsg = {
                        __cmpReturn: {
                            returnValue: retValue, success: success, callId: call.callId
                        }
                    };
                    event.source.postMessage(msgIsString ? JSON.stringify(returnMsg) : returnMsg, '*');
                });
            }
        } catch (e) {}  // do nothing
    }
    var cmpFunc = function(command, version, callback) {
        if (command === 'ping') {
            callback({gdprAppliesGlobally: gdprApplies, cmpLoaded: cmpLoaded}, responseCode);
        } else if (command === 'getConsentData') {
            callback({consentData: iabConsentData, gdprApplies: gdprApplies, hasGlobalScope: hasGlobalScope}, responseCode);
        } else if (command === 'getVendorConsents') {
            callback({metadata: iabConsentData, gdprApplies: gdprApplies, hasGlobalScope: hasGlobalScope}, responseCode);
        } else {
            callback(undefined, false);
        }
    };
    if ( typeof (__cmp) !== 'function' ) {
        window.__cmp = cmpFunc;
        window.__cmp.msgHandler = cmpMsgHandler;
        if ( window.addEventListener ) {
            window.addEventListener('message', cmpMsgHandler, false);
        } else {
            window.attachEvent('onmessage', cmpMsgHandler);
        }
    }
})(window, document);
{% endhighlight %}

### Explanation of Parameters
**iabConsentData**
For how to generate the IAB consent string see the [IAB CMP 1.1 Spec](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework) and [IAB Consent String SDK](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/tree/master/Consent%20String%20SDK).

**gdprApplies**
How to generate the gdprApplies field:
- True if the current user is in the European Economic Area (EEA) OR if the publisher wants to have all traffic considered in-scope for GDPR
- False if it's known that the user is outside the EEA
- Leave the attribute unspecified if user's location is unknown

**hasGlobalScope**
This should be set as true if consent data was retrieved from global "euconsent" cookie, or was it publisher-specific. For general purpose, set this to false.

**responseCode**
This should be false if there was some error in the consent data, true otherwise. False is the same as calling the callback with no parameters.

**cmpLoaded**
This should be be set to true once parameters above are processed.

## Adapters Supporting Privacy Regulations

<script src="/assets/js/dynamicTable.js" type="text/javascript"></script>

<script type="text/javascript">
var adaptersSupportingGdpr=[];
var adaptersSupportingUsp=[];
var idx_gdpr=0;
var idx_usp=0;
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for item in bidder_pages %}
<!-- {{item.title}} {{item.gdpr_supported}} -->
    {% if item.gdpr_supported == true %}
	adaptersSupportingGdpr[idx_gdpr]={};
	adaptersSupportingGdpr[idx_gdpr].href="/dev-docs/bidders.html#{{item.biddercode}}";
	adaptersSupportingGdpr[idx_gdpr].text="{{item.title}}";
	idx_gdpr++;
    {% endif %}
    {% if item.usp_supported == true %}
	adaptersSupportingUsp[idx_usp]={};
	adaptersSupportingUsp[idx_usp].href="/dev-docs/bidders.html#{{item.biddercode}}";
	adaptersSupportingUsp[idx_usp].text="{{item.title}}";
	idx_usp++;
    {% endif %}
{% endfor %}
</script>
### Adapters supporting GDPR
<div id="adaptersTableGdpr">
        <script>
           writeDynamicTable({div: "adaptersTableGdpr", data: "adaptersSupportingGdpr", sort: "rowFirst", striped: false} );
        </script>
</div>

### Adapters supporting US-Privacy
<div id="adaptersTableUsp">
        <script>
           writeDynamicTable({div: "adaptersTableUsp", data: "adaptersSupportingUsp", sort: "rowFirst", striped: false} );
        </script>
</div>
