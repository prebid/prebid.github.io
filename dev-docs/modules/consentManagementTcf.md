---
layout: page_v2
page_type: module
title: Consent Management - TCF
description: If you have users in Europe, this module works with your Consent Management Platform to pass consent info to bidders and help align with EU regulations. See also the TCF Control module.
display_name : Consent Management - TCF
module_code : consentManagementTcf
enable_download : true
recommended: true
sidebarType : 1
---

# TCF Consent Management Module
{: .no_toc }

- TOC
{: toc }

{% include legal-warning.html %}

## Overview

This consent management module is designed to support the EU General Data Protection Regulation ([GDPR](https://www.iab.com/topics/consumer-privacy/gdpr/))

This module works with supported [Consent Management Platforms](https://www.cmswire.com/information-management/what-is-a-consent-management-platform/) (CMPs) to fetch an encoded string representing the user's consent choices and make it available for adapters to consume and process.

{: .alert.alert-warning :}
Prebid functionality created to address regulatory requirements does not replace each party's responsibility to determine its own legal obligations and comply with all applicable laws.
**We recommend consulting with your legal counsel before determining how to utilize these features in support of your overall privacy approach.**

This base EU TCF consent management module performs these actions:

1. Fetch the user's GDPR & Google additional consent data from the CMP.
2. Incorporate this data into the auction objects for adapters to collect.

The optional [TCF control module](/dev-docs/modules/tcfControl.html) adds on these actions:

1. Allows the page to define which activities should be enforced at the Prebid.js level.
2. Actively enforces those activities based on user consent data (in the TCF string, not the AC string).

In the case of a new user, CMPs will generally respond only after there is consent information available (i.e., the user has made their consent choices).
Making these selections can take some time for the average user, so the module provides timeout settings.

If the timeout period expires or an error from the CMP is thrown, one of these actions occurs:

- The auction is canceled outright.
- The auction proceeds without the user's consent information.  

## Page Integration

Please start by understanding the IAB's [TCF Implementation Guide](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/TCF-Implementation-Guidelines.md).

To utilize this module, a Consent Management Platform (CMP) compatible with the IAB TCF v2.0 or [v2.2](https://iabeurope.eu/tcf-2-2-launches-all-you-need-to-know/) spec needs to be implemented on the site to interact with the user and obtain their consent choices. It's important to understand the details of how the CMP works before integrating it with Prebid.js

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
| gdpr.actionTimeout | `integer` | Length of time (in milliseconds) to allow the user to take action to consent if they have not already done so. The actionTimer first waits for the CMP to load, then the actionTimeout begins for the specified duration. Default is `undefined`. | `10000` |
| gdpr.defaultGdprScope | `boolean` | Defines what the `gdprApplies` flag should be when the CMP doesn't respond in time or the static data doesn't supply. Defaults to `false`. | `true` |
| gdpr.consentData | `Object` | An object representing the GDPR consent data being passed directly; only used when cmpApi is 'static'. Default is `undefined`. | |
| gdpr.consentData.tcString | `string` | Base64url-encoded TCF v2.x string with segments. | |
| gdpr.consentData.addtlConsent | `string` | Additional consent string if available from the cmp TCData object | |
| gdpr.consentData.gdprApplies | `boolean` | Defines whether or not this pageview is in GDPR scope. | |
| gdpr.consentData.purpose.consents | `Object` | An object representing the user's consent status for specific purpose IDs. | |
| gdpr.consentData.purpose.legitimateInterests | `Object` | An object representing the user's legitimate interest status for specific purpose IDs. | |
| gdpr.consentData.vendor.consents | `Object` | An object representing the user's consent status for specific vendor IDs. | |
| gdpr.consentData.vendor.legitimateInterests | `Object` | An object representing the user's legitimate interest status for specific vendors IDs. | |

{: .alert.alert-info :}
NOTE: The `purpose` and `vendor` objects are required if you are using the `tcfControl` module.  If the data is not included, your bid adapters, analytics adapters, and/or userId systems will likely be excluded from the auction as Prebid will assume the user has not given consent for these entities.

A related parameter is `deviceAccess`, which is at the global level of Prebid.js configuration because it can be used GDPR, CCPA, or custom privacy implementations:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| deviceAccess | `boolean` | If false, Prebid.js will prevent adapters and modules from reading and setting cookies and HTML local storage. Defaults to `true`. | `false` |

### TCF v2.x Examples

Example 1: IAB CMP using custom timeout and setting GDPR in-scope by default.

```javascript
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
```

Example 2: IAB CMP using custom timeout in combination with actionTimeout and setting GDPR in-scope by default. The following will wait `500ms` for the CMP to load, if it does an additional `10000ms` will be waited for a user to provide consent (if none had yet been provided).

```javascript
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            gdpr: {
              cmpApi: 'iab',
              timeout: 500,
              actionTimeout: 10000,
              defaultGdprScope: true
            }
          }
        });
     });
```

Example 3: Static CMP using custom data passing.

```javascript
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
```

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the consent management module, an additional option must be added to the **gulp build** command:

```bash
gulp build --modules=consentManagement,bidAdapter1,bidAdapter2
```

You can also use the [Prebid.js Download](/download.html) page.

## Adapter Integration

{: .alert.alert-info :}

If you are submitting changes to an adapter to support the IAB's TCF v2.x, please also submit a PR to the [docs repo](https://github.com/prebid/prebid.github.io) to add the `tcfeu_supported: true` variable to your respective page in the [bidders directory](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders).  **This will ensure that your adapter's name will automatically appear on the list of adapters supporting TCF-EU.**

### Bidder Adapter GDPR Integration

To find the GDPR consent information to pass along to your system, adapters should look for the `bidderRequest.gdprConsent` field in their `buildRequests()` method.
Here is a sample of how the data is structured in the `bidderRequest` object:

```javascript
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
```

**gdprConsent Data Fields**

**_consentString_**

This field contains the user's choices on consent, represented as an encoded string value.  In certain scenarios, this field might come to you with an `undefined` value; normally this happens when there was an error (or timeout) during the CMP interaction and the publisher turned off GDPR enforcement.  If you don't want to pass `undefined` to your system, you can check for this value and replace it with a valid consent string.  See the _consent_required_ code in the example below (under "gdprApplies") for a possible approach to checking and replacing values.

**_addtlConsent_**

If the CMP responds with additional consent data as proposed at [support.google.com/admanager/answer/9681920?hl=en] then the corresponding string is stored here.

**_vendorData_**

This field contains the raw vendor data in relation to the user's choices on consent.  This object will hold a map of all available vendors for any potential adapters that want to read the data directly.  One use-case for reading from this field would be when an adapter wants to be omitted from a request where they were not given consent.  Adapters are able to read through the object to find their appropriate information.

**_gdprApplies_**

This boolean field represents whether the user in question is in an area where GDPR applies.  This field comes from the CMP itself; it's included in the response when a request is made to the CMP API.  On the rare occasion where this value isn't defined by the CMP, each adapter has the opportunity to set their own value for this field.

One of two general approaches can be taken by the adapter to populate this field:

- Set a hardcoded default value.
- Use their own system to determine whether consent is required for the end-user and set the value accordingly.

The following is an example of how the integration could look for the former option:

```javascript
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
```

The implementation of the latter option is up to the adapter, but the general premise is the same.  You would check to see if the `bidderRequest.gdprConsent.gdprApplies` field is undefined and if so, set the derived value from your independent system.

If neither option are taken, then there is the remote chance this field's value will be undefined.  As long as that's acceptable for the given system, this could be a potential third option.

### UserSync Integration

The `gdprConsent` object is also available when registering `userSync` pixels.
The object can be accessed by including it as an argument in the `getUserSyncs` function:

```javascript
getUserSyncs: function(syncOptions, responses, gdprConsent, usPrivacy) {
...
}
```

Depending on your needs, you could include the consent information in a query of your pixel and/or, given the consent choices, determine if you should drop the pixels at all.

## Publisher Scenarios

### Page Control of Consented Activities

Page JavaScript can prevent Prebid.js from performing various activities that come under the scope of GDPR controls. Since header bidding isn't the only service that falls under GDPR scope, the page may already have parsed the TCF string and stored it.

Here are some things that publishers can do to control various activities:

1. If the current page view is known to be in GDPR scope, make sure the adapters are aware of it even on the first page where CMP hasn't been activated by setting the defaultGdprScope: `consentManagement.gdpr.defaultGdprScope: true`
2. If the user hasn't consented to Purpose 1:
   - Set [deviceAccess: false](/dev-docs/publisher-api-reference/setConfig.html#setConfig-deviceAccess)
   - Don't enable [userSync](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing)
   - Don't enable [userId](/dev-docs/modules/userId.html) modules

3. If you're working with bidders that don't support GDPR, consider dynamically populating adunits as needed. See the list below for bidders supporting GDPR.

### Publishers Not Using an IAB-Compliant CMP

Prebid.js and much of the ad industry rely on the IAB CMP standard for GDPR support, but there might be some publishers who have implemented a different approach to meeting the privacy rules. Those publishers can utilize Prebid.js and the whole header bidding ecosystem by building a translation layer between their consent method and the IAB method.

At a high level, this could be done as follows:

1. Build a `window.__tcfapi()` function, which will be seen by Prebid.
2. If SafeFrames are in use, build a message receiver function.
3. Format consent data in a string according to the [IAB standard](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework).

Below is sample code for implementing the stub functions. Sample code for formatting the consent string can be obtained [here](https://github.com/appnexus/cmp).

```javascript
var iabConsentData;  // build the IAB consent string
var gdprApplies;     // true if gdpr applies to the user, else false
var responseCode;    // false if there was an error, else true
(function(window, document) {
    function addFrame() {
        if (window.frames['____tcfapiLocator'])
            return;
        if ( document.body ) {
            var body = document.body,
                iframe = document.createElement('iframe');
            iframe.name = '____tcfapiLocator';
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
                try {
                    json = JSON.parse(json);
                } catch (error) { }
            }
            var call = json.__tcfapiCall;
            if (call) {
                window.__tcfapi(call.command, call.parameter, function(retValue, success) {
                    var returnMsg = {
                        __tcfapiReturn: {
                            returnValue: retValue, success: success, callId: call.callId
                        }
                    };
                    event.source.postMessage(msgIsString ? JSON.stringify(returnMsg) : returnMsg, '*');
                });
            }
        } catch (e) {}  // do nothing
    }
    var cmpFunc = function(command, version, callback) {
        if (command === 'addEventListener') {
           callback({eventStatus: 'tcloaded', tcString: iabConsentData, gdprApplies}, responseCode)
        } else {
           callback(undefined, false);
        }
    };
    if ( typeof (__tcfapi) !== 'function' ) {
        window.__tcfapi = cmpFunc;
        window.__tcfapi.msgHandler = cmpMsgHandler;
        if ( window.addEventListener ) {
            window.addEventListener('message', cmpMsgHandler, false);
        } else {
            window.attachEvent('onmessage', cmpMsgHandler);
        }
    }
})(window, document);
```

#### Explanation of Parameters

**_iabConsentData_**  
For instructions on how to generate the IAB consent string see the [IAB CMP 2 Spec](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework) and [IAB Consent String SDK](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/tree/master/Consent%20String%20SDK).

**_gdprApplies_**  
Use the following values in the _gdprApplies_ field:

- True: the current user is in the European Economic Area (EEA) _or_ the publisher wants to have all traffic considered in-scope for GDPR.
- False: It's known that the user is outside the EEA.
- Leave the attribute unspecified if user's location is unknown.

**_responseCode_**  
This should be false if there was some error in the consent data; otherwise set to true. False is the same as calling the callback with no parameters.

## Further Reading

- [TCF Control Module](/dev-docs/modules/tcfControl.html)
- [IAB TCF Implementation Guide](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/TCF-Implementation-Guidelines.md)
- [IAB Transparancy and Consent Framework Policies](https://iabeurope.eu/iab-europe-transparency-consent-framework-policies/)
- [Prebid Consent Management - US Privacy Module](/dev-docs/modules/consentManagementUsp.html)
- [CMP Best Practices](https://docs.prebid.org/dev-docs/cmp-best-practices.html)
