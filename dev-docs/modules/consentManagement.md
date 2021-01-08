---
layout: page_v2
page_type: module
title: Consent Management - GDPR
description: Module to consume and distribute GDPR consent information to bidder adapters
module_code : consentManagement
display_name : Consent Management - GDPR
enable_download : true
sidebarType : 1
---

# GDPR Consent Management Module
{: .no_toc }

* TOC
{: toc }

{% capture legalNotice %}
  This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European and /or US regulations, including the GDPR, the ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.
  {% endcapture %}

{% include /alerts/alert_important.html content=legalNotice %}

{: .alert.alert-warning :}
Prebid.org is working on updates that will enable support for reading and parsing TCF 2.0 consent strings. See the [blog post](/blog/tcf2) for timelines.

## Overview

This consent management module is designed to support the EU General Data Protection Regulation ([GDPR](https://www.iab.com/topics/consumer-privacy/gdpr/))

This module works with supported [Consent Management Platforms](https://www.cmswire.com/information-management/what-is-a-consent-management-platform/) (CMPs) to fetch an encoded string representing the user's consent choices and make it available for adapters to consume and process.

{: .alert.alert-warning :}
Prebid functionality created to address regulatory requirements does not replace each party's responsibility to determine its own legal obligations and comply with all applicable laws.
**We recommend consulting with your legal counsel before determining how to utilize these features in support of your overall privacy approach.**

This base EU GDPR consent management module performs these actions:

1. Fetch the user's GDPR & Google additional consent data from the CMP.
2. Incorporate this data into the auction objects for adapters to collect.

The optional [GDPR enforcement module](/dev-docs/modules/gdprEnforcement.html) adds on these actions:

3. Allows the page to define which activities should be enforced at the Prebid.js level.
4. Actively enforces those activities based on user consent data (in the TCF string, not the AC string).

In the case of a new user, CMPs will generally respond only after there is consent information available (i.e., the user has made their consent choices).
Making these selections can take some time for the average user, so the module provides timeout settings.

If the timeout period expires or an error from the CMP is thrown, one of these actions occurs:

- The auction is canceled outright.
- The auction proceeds without the user's consent information.  

## Page Integration

Please start by understanding the IAB's [TCF Implementation Guide](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/TCF-Implementation-Guidelines.md).

To utilize this module, a Consent Management Platform (CMP) compatible with the [IAB TCF v1.1 spec](https://iabeurope.eu/all-news/the-iab-europe-transparency-consent-framework-tcf-steering-group-votes-to-extend-technical-support-for-tcf-v1-1/) or [IAB TCF v2.0 spec](https://iabeurope.eu/tcf-2-0/) needs to be implemented on the site to interact with the user and obtain their consent choices. It's important to understand the details of how the CMP works before integrating it with Prebid.js

In general, implementation details for CMPs are not covered by Prebid.org, but we do recommend to that you place the CMP code before the Prebid.js code in the head of the page in order to ensure the CMP's framework is loaded before the Prebid code executes. In addition, the community is collecting a set of [CMP best practices](/dev-docs/cmp-best-practices.html). 

Once the CMP is implemented, simply include this module into your build and add a `consentManagement` object in the `setConfig()` call.  Adapters that support this feature will then be able to retrieve the consent information and incorporate it in their requests.

Here are the parameters supported in the `consentManagement.gdpr` object:

{: .alert.alert-warning :}
Note that versions of Prebid.js before 2.43.0 had a different GDPR configuration. The module is backwards-compatible,
but we recommend migrating to the new config structure as soon as possible.

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| gdpr | `Object` | | |
| gdpr.cmpApi | `string` | The CMP interface that is in use. Supported values are **'iab'** or **'static'**. Static allows integrations where IAB-formatted consent strings are provided in a non-standard way. Default is `'iab'`. | `'iab'` |
| gdpr.timeout | `integer` | Length of time (in milliseconds) to allow the CMP to obtain the GDPR consent string. Default is `10000`. | `10000` |
| gdpr.defaultGdprScope | `boolean` | Defines what the `gdprApplies` flag should be when the CMP doesn't respond in time or the static data doesn't supply. Defaults to `false`. | `true` |
| gdpr.allowAuctionWithoutConsent | `boolean` | (TCF v1.1 only) Determines what will happen if obtaining consent information from the CMP fails; either allow the auction to proceed (`true`) or cancel the auction (`false`). Default is `true` | `true` |
| gdpr.consentData | `Object` | An object representing the GDPR consent data being passed directly; only used when cmpApi is 'static'. Default is `undefined`. | |
| gdpr.consentData.getTCData.tcString | `string` | (TCF v2.0 only) Base64url-encoded TCF v2.0 string with segments. | |
| gdpr.consentData.getTCData.addtlConsent | `string` | (TCF v2.0 only) Additional consent string if available from the cmp TCData object | |
| gdpr.consentData.getTCData.gdprApplies | `boolean` | (TCF v2.0 only) Defines whether or not this pageview is in GDPR scope. | |
| gdpr.consentData.getTCData.purpose.consents | `Object` | (TCF v2.0 only) An object representing the user's consent status for specific purpose IDs. | |
| gdpr.consentData.getTCData.purpose.legitimateInterests | `Object` | (TCF v2.0 only) An object representing the user's legitimate interest status for specific purpose IDs. | |
| gdpr.consentData.getTCData.vendor.consents | `Object` | (TCF v2.0 only) An object representing the user's consent status for specific vendor IDs. | |
| gdpr.consentData.getTCData.vendor.legitimateInterests | `Object` | (TCF v2.0 only) An object representing the user's legitimate interest status for specific vendors IDs. | |
| gdpr.consentData.getConsentData.gdprApplies | `boolean` | (TCF v1.1 only) Defines whether or not this pageview is in GDPR scope. | |
| gdpr.consentData.getConsentData.hasGlobalScope | `boolean` | (TCF v1.1 only) True if consent data is global, false if it's publisher specific. | |
| gdpr.consentData.getConsentData.consentData | `string` | (TCF v1.1 only) Encoded TCF v1.1 string. | |
| gdpr.consentData.getVendorConsents.metadata | `string` | (TCF v1.1 only) Encoded TCF v1.1 string. | |

{: .alert.alert-info :}
NOTE: The `allowAuctionWithoutConsent` parameter supported for TCF v1.1 refers to the entire consent string, not to any individual consent option. Prebid.js does not parse the GDPR consent string, so it doesn't know if the user has consented to any particular action.

{: .alert.alert-info :}
NOTE: The `purpose` and `vendor` objects are required if you are using the `gdprEnforcement` module.  If the data is not included, your bid adpaters, analytics adapters, and/or userId systems will likely be excluded from the auction as Prebid will assume the user has not given consent for these entities.

A related parameter is `deviceAccess`, which is at the global level of Prebid.js configuration because it can be used GDPR, CCPA, or custom privacy implementations:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| deviceAccess | `boolean` | If false, Prebid.js will prevent adapters and modules from reading and setting cookies and HTML local storage. Defaults to `true`. | `false` |


### TCF v2.0 Examples

Example 1: IAB CMP using custom timeout and setting GDPR in-scope by default

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            gdpr: {
              cmpApi: 'iab',
              timeout: 8000,
              defaultGdprScope: true
            }
          }
        });
     });
{% endhighlight %}

Example 2: Static CMP using custom data passing.

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            gdpr: {
              cmpApi: 'static',
              consentData: {
                getTCData: {
                  tcString: 'COwK6gaOwK6gaFmAAAENAPCAAAAAAAAAAAAAAAAAAAAA.IFoEUQQgAIQwgIwQABAEAAAAOIAACAIAAAAQAIAgEAACEAAAAAgAQBAAAAAAAGBAAgAAAAAAAFAAECAAAgAAQARAEQAAAAAJAAIAAgAAAYQEAAAQmAgBC3ZAYzUw',
                  gdprApplies: true,
                  purpose: {
                    consents: {
                      0: true,
                      ...
                    },
                    legitimateInterests: {
                      0: true,
                      ...
                    }
                  },
                  vendor: {
                    consents: {
                      00: true,
                      ...
                    },
                    legitimateInterests: {
                      0: true,
                      ...
                    }
                  }
                }
              }
            }
          }
        });
     });
{% endhighlight %}

### TCF v1.1 Examples

Example 1: IAB CMP using custom timeout and cancel-auction options.

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            gdpr: {
              cmpApi: 'iab',
              timeout: 8000,
              allowAuctionWithoutConsent: false
            }
          }
        });
     });
{% endhighlight %}

Example 2: Static CMP using custom data passing.

{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            gdpr: {
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
          }
        });
     });
{% endhighlight %}

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the consent management module, an additional option must be added to the **gulp build** command:

{% highlight bash %}
gulp build --modules=consentManagement,bidAdapter1,bidAdapter2
{% endhighlight %}

You can also use the [Prebid.js Download](/download.html) page.

## Adapter Integration

{: .alert.alert-info :}
Prebid.js adapters don't need to change to support TCF v2.0 if they already support TCF 1.1 -- the consent string is passed through the same bidrequest location. The bidder's endpoint, however, will need to change to support TCF v2.0. Once the endpoint supports TCF2, you can update the documentation.md file as described below above the table showing the list of TCF2-compliant bidders.

If you are submitting changes to an adapter to support this approach, please also submit a PR to the [docs repo](https://github.com/prebid/prebid.github.io) to add the `gdpr_supported: true` variable to your respective page in the [bidders directory](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders).  **This will ensure that your adapter's name will automatically appear on the list of adapters supporting GDPR.**

### Bidder Adapter GDPR Integration

To find the GDPR consent information to pass along to your system, adapters should look for the `bidderRequest.gdprConsent` field in their `buildRequests()` method.
Here is a sample of how the data is structured in the `bidderRequest` object:

{% highlight js %}
{
  "bidderCode": "bidderA",
  "auctionId": "e3a336ad-2222-4a1c-bbbb-ecc7c5294a34",
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

**gdprConsent Data Fields**

**_consentString_**

This field contains the user's choices on consent, represented as an encoded string value.  In certain scenarios, this field might come to you with an `undefined` value; normally this happens when there was an error during the CMP interaction and the publisher had the config option `allowAuctionWithoutConsent` set to `true`.  If you don't want to pass `undefined` to your system, you can check for this value and replace it with a valid consent string.  See the *consent_required* code in the example below (under "gdprApplies") for a possible approach to checking and replacing values.

**_addtlConsent_**

If the CMP responds with additional consent data as proposed at https://support.google.com/admanager/answer/9681920?hl=en then the corresponding string is stored here.

**_vendorData_**

This field contains the raw vendor data in relation to the user's choices on consent.  This object will hold a map of all available vendors for any potential adapters that want to read the data directly.  One use-case for reading from this field would be when an adapter wants to be omitted from a request where they were not given consent.  Adapters are able to read through the object to find their appropriate information.

**_gdprApplies_**

This boolean field represents whether the user in question is in an area where GDPR applies.  This field comes from the CMP itself; it's included in the response when a request is made to the CMP API.  On the rare occasion where this value isn't defined by the CMP, each adapter has the opportunity to set their own value for this field.

One of two general approaches can be taken by the adapter to populate this field:

- Set a hardcoded default value.
- Use their own system to determine whether consent is required for the end-user and set the value accordingly.

The following is an example of how the integration could look for the former option:

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

The implementation of the latter option is up to the adapter, but the general premise is the same.  You would check to see if the `bidderRequest.gdprConsent.gdprApplies` field is undefined and if so, set the derived value from your independent system.

If neither option are taken, then there is the remote chance this field's value will be undefined.  As long as that's acceptable for the given system, this could be a potential third option.

### UserSync Integration

The `gdprConsent` object is also available when registering `userSync` pixels.
The object can be accessed by including it as an argument in the `getUserSyncs` function:

{% highlight js %}
getUserSyncs: function(syncOptions, responses, gdprConsent, usPrivacy) {
...
}
{% endhighlight %}

Depending on your needs, you could include the consent information in a query of your pixel and/or, given the consent choices, determine if you should drop the pixels at all.

## Publisher Scenarios

### Page Control of Consented Activities

Page JavaScript can prevent Prebid.js from performing various activities that come under the scope of GDPR controls. Since header bidding isn't the only service that falls under GDPR scope, the page may already have parsed the TCF string and stored it.

Here are some things that publishers can do to control various activities:

1. If the current page view is known to be in GDPR scope, make sure the adapters are aware of it even on the first page where CMP hasn't been activated by setting the defaultGdprScope: `consentManagement.gdpr.defaultGdprScope: true`
2. If the user hasn't consented to Purpose 1:
  - Set [deviceAccess: false](/dev-docs/publisher-api-reference.html#setConfig-deviceAccess)
  - Don't enable [userSync](/dev-docs/publisher-api-reference.html#setConfig-Configure-User-Syncing)
  - Don't enable [userId](/dev-docs/modules/userId.html) modules

3. If you're working with bidders that don't support GDPR, consider dynamically populating adunits as needed. See the list below for bidders supporting GDPR.


### Publishers Not Using an IAB-Compliant CMP

Prebid.js and much of the ad industry rely on the IAB CMP standard for GDPR support, but there might be some publishers who have implemented a different approach to meeting the privacy rules. Those publishers can utilize Prebid.js and the whole header bidding ecosystem by building a translation layer between their consent method and the IAB method.

At a high level, this could be done as follows:  
1. Build a `window.__cmp()` function, which will be seen by Prebid.
2. If SafeFrames are in use, build a message receiver function.
3. Format consent data in a string according to the [IAB standard](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework).

Below is sample code for implementing the stub functions. Sample code for formatting the consent string can be obtained [here](https://github.com/appnexus/cmp).

{% highlight js %}
var iabConsentData;  // build the IAB consent string
var gdprApplies;     // true if gdpr applies to the user, else false
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

#### Explanation of Parameters

**_iabConsentData_**  
For instructions on how to generate the IAB consent string see the [IAB CMP 1.1 Spec](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework) and [IAB Consent String SDK](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/tree/master/Consent%20String%20SDK).

**_gdprApplies_**  
Use the following values in the _gdprApplies_ field:
- True: the current user is in the European Economic Area (EEA) *or* the publisher wants to have all traffic considered in-scope for GDPR.
- False: It's known that the user is outside the EEA.
- Leave the attribute unspecified if user's location is unknown.

**_hasGlobalScope_**  
This should be set to true if consent data was retrieved from global "euconsent" cookie, or it was publisher-specific. For general purpose, set this to false.

**_responseCode_**  
This should be false if there was some error in the consent data; otherwise set to true. False is the same as calling the callback with no parameters.

**_cmpLoaded_**  
This should be be set to true once the parameters listed above are processed.

## Adapters Supporting TCF v1.1

Bidders on this list have self-declared their TCF 1.1 support in their https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders md file by adding "gdpr_supported: true".

<script src="/assets/js/dynamicTable.js" type="text/javascript"></script>

<script type="text/javascript">
var adaptersSupportingGdpr1=[];
var idx_gdpr=0;
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for item in bidder_pages %}
    {% if item.gdpr_supported == true %}
	adaptersSupportingGdpr1[idx_gdpr]={};
	adaptersSupportingGdpr1[idx_gdpr].href="/dev-docs/bidders.html#{{item.biddercode}}";
	adaptersSupportingGdpr1[idx_gdpr].text="{{item.title}}";
	idx_gdpr++;
    {% endif %}
{% endfor %}
</script>

<div id="adaptersTableGdpr1">
        <script>
           writeDynamicTable({div: "adaptersTableGdpr1", data: "adaptersSupportingGdpr1", sort: "rowFirst", striped: false} );
        </script>
</div>

## Adapters Supporting TCF v2.0

Bidders on this list have self-declared their TCF 2.0 support in their https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders md file by adding "tcf2_supported: true".

<script type="text/javascript">
var adaptersSupportingGdpr2=[];
var idx_gdpr=0;
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for item in bidder_pages %}
    {% if item.tcf2_supported == true %}
	adaptersSupportingGdpr2[idx_gdpr]={};
	adaptersSupportingGdpr2[idx_gdpr].href="/dev-docs/bidders.html#{{item.biddercode}}";
	adaptersSupportingGdpr2[idx_gdpr].text="{{item.title}}";
	idx_gdpr++;
    {% endif %}
{% endfor %}
</script>

<div id="adaptersTableGdpr2">
        <script>
           writeDynamicTable({div: "adaptersTableGdpr2", data: "adaptersSupportingGdpr2", sort: "rowFirst", striped: false} );
        </script>
</div>

## Further Reading

- [GDPR Enforcement Module](/dev-docs/modules/gdprEnforcement.html)
- [IAB TCF Implementation Guide](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/TCF-Implementation-Guidelines.md)
- [IAB Transparancy and Consent Framework Policies](https://iabeurope.eu/iab-europe-transparency-consent-framework-policies/)
- [Prebid Consent Management - US Privacy Module](/dev-docs/modules/consentManagementUsp.html)
- [CMP Best Practices](https://docs.prebid.org/dev-docs/cmp-best-practices.html)
