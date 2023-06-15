---
layout: page_v2
page_type: module
title: Consent Management - GPP
description: If you have users in regions of the world that adhere to the Global Privacy Platform, this module works with your Consent Management Platform to pass consent info to bidders and help align with regional regulations.
module_code : consentManagementGpp
display_name : Consent Management - GPP
enable_download : true
recommended: true
min_js_version: 7.30.0
sidebarType : 1
---

# GPP Consent Management Module

{: .no_toc }

- TOC
{: toc }

{% capture legalNotice %}
  This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company's collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European, Canadian and /or US regulations, including the GDPR, the ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.
  {% endcapture %}

{% include /alerts/alert_important.html content=legalNotice %}

## Overview

This consent management module is designed to support the Global Privacy Platform ([GPP](https://iabtechlab.com/gpp/))

This module works with supported [Consent Management Platforms](https://www.cmswire.com/information-management/what-is-a-consent-management-platform/) (CMPs) to fetch an encoded string representing the user's consent choices (for their repsective region) and make it available for adapters to consume and process.

{: .alert.alert-warning :}
Prebid functionality created to address regulatory requirements does not replace each party's responsibility to determine its own legal obligations and comply with all applicable laws.
**We recommend consulting with your legal counsel before determining how to utilize these features in support of your overall privacy approach. This module is not yet intended to replace other consent modules; it supplements them.**

Below is a summary of the actions performed by the GPP consent management module:

1. Fetch the user's GPP consent data from the IAB compliant CMP.
2. Incorporate this data into the auction objects for adapters to collect.
3. Proceed with the auction.

In the case of a new user, CMPs will generally respond only after there is consent information available (i.e., the user has made their consent choices).
Making these selections can take some time for the average user, so the module provides timeout settings.

If the timeout period expires or an error from the CMP is thrown, one of these actions occurs:

- The auction is canceled outright.
- The auction proceeds without the user's consent information.

## Page Integration

To utilize this module, a Consent Management Platform (CMP) compatible with the [IAB GPP CMP spec](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md) needs to be implemented on the site to interact with the user and obtain their consent choices.  It's important to understand the details of how the CMP works before integrating it with Prebid.js.

In general, implementation details for CMPs are not covered by Prebid.org, but we do recommend that you place the CMP code before the Prebid.js code in the head of the page in order to ensure the CMP's framework is loaded before the Prebid code executes.  In addition, the community is collecting a set of [CMP best practices](/dev-docs/cmp-best-practices.html).

Once the CMP is implemented, simply include this module into your build and add a `consentManagement` object in the `setConfig()` call.  Adapters that support this feature will then be able to retrieve the consent information and incorporate it in their requests.

Here are the parameters supported in the `consentManagement` object specific for the GPP consent module:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| gpp | `Object` | | |
| gpp.cmpApi | `string` | The CMP interface that is in use. Supported values are **'iab'** or **'static'**. Static allows integrations where IAB-formatted consent strings are provided in a non-standard way. Default is `'iab'`. | `'iab'` |
| gpp.timeout | `integer` | Length of time (in milliseconds) to allow the CMP to obtain the GPP consent information. Default is `10000`. | `10000` |
| gpp.consentData | `Object` | An object representing the IAB GPP consent data being passed directly; only used when cmpApi is 'static'. Default is `undefined`. | |
| gpp.consentData.sectionId | `integer` | Indicates the header section of the GPP consent string, recommended to be `3`. | |
| gpp.consentData.gppVersion | `integer` | The version number parsed from the header of the GPP consent string. | |
| gpp.consentData.sectionList | `Array of integers` | The sections contained within the encoded GPP string as parsed from the header. | |
| gpp.consentData.applicableSections | `Array of integers` | Section ID considered to be in force for this transaction.  In most cases, this field should have a single section ID. In rare occasions where such a single section ID can not be determined, the field may contain up to 2 values. The value can be 0 or a Section ID specified by the Publisher / Advertiser, during stub / load. When no section is applicable, the value will be -1. | |
| gpp.consentData.gppString | `String` | The complete encoded GPP string. | |
| gpp.consentData.pingData | `Object` | An object representing the current status of the CMP at the time consent data was fetched.  See PingReturn in [IAB's CMP API doc](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md#ping) for further information. |  |

{: .alert.alert-info :}
In addition to the static approach described above, there is another means to pass already known GPP consent data of a user via the Prebid.js [First Party Data](https://docs.prebid.org/features/firstPartyData.html) feature.  The values for `gppString` and `applicableSections` can be passed via the `ortb2.regs.gpp` and `ortb2.regs.gpp_sid` fields respectively; other fields in the GPP data object listed above are not available via the `ortb2` structure.  If the GPP consent module is present and successfully obtains the consent information from the CMP, it will override the GPP values set originally in the `ortb2` object (as we assume the CMP's values will be more up-to-date).  Please visit the [First Party Data](https://docs.prebid.org/features/firstPartyData.html) page for more overall information and examples.

### Examples

Example 1: IAB CMP using a custom timeout

```javascript
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            gpp: {
              cmpApi: 'iab',
              timeout: 8000
            }
          }
        });
     });
```

Example 2: Static CMP using custom data passing.

```javascript
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({
          consentManagement: {
            gpp: {
              cmpApi: 'static',
              consentData: {
                sectionId: 3,
                gppVersion: 1,
                sectionList: [5, 7]
                applicableSections: [7]
                gppString: 'DBACNYA~CPXxRfAPXxRfAAfKABENB-CgAAAAAAAAAAYgAAAAAAAA~1YNN',
                pingData: {...}
              }
            }
          }
        });
     });
```

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the consent management module, an additional option must be added to the **gulp build** command:

```bash
gulp build --modules=consentManagementGpp,bidAdapter1,bidAdapter2
```

You can also use the [Prebid.js Download](/download.html) page.

## Adapter Integration

{: .alert.alert-info :}

If you are submitting changes to an adapter to support GPP, please also submit a PR to the [docs repo](https://github.com/prebid/prebid.github.io) to add the `gpp_supported: true` variable to your respective page in the [bidders directory](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders).  **This will ensure that your adapter's name will automatically appear on the list of adapters supporting GPP.**

### Bidder Adapter GPP Integration

To find the GPP consent information to pass along to your system, adapters should look for the `bidderRequest.gppConsent` field in their `buildRequests()` method; this field includes a copy of the full GPPData object from the CMP, in case additional information (beyond the gppString and applicableSections values) is needed.  Alternatively if only the consent string and/or the applicableSections values are needed, these two values can also be found in the `bidderRequest.ortb2.regs` field under the OpenRTB 2.6 field names (`gpp` and `gpp_sid`).
Here is a sample of how the data is structured in the `bidderRequest` object:

```javascript
{
  "bidderCode": "bidderA",
  "auctionId": "e3a336ad-2222-4a1c-bbbb-ecc7c5294a34",
  ...
  "timeout": 3000,
  "gppConsent": {
    "gppString": "BOJ/P2HOJ/P2HABABMAAAAAZ+A==",
    "fullGppData": {...},
    "applicableSections": [7]
  },
  "ortb2": {
    "regs": {
      "gpp": "BOJ/P2HOJ/P2HABABMAAAAAZ+A==",
      "gpp_sid": [7]
    }
  },
  ...
}
```

### UserSync Integration

The `gppConsent` object is also available when registering `userSync` pixels.
The object can be accessed by including it as an argument in the `getUserSyncs` function:

```javascript
getUserSyncs: function(syncOptions, responses, gdprConsent, usPrivacy, gppConsent) {
...
}
```

Depending on your needs, you could include the consent information in a query of your pixel and/or, given the consent choices, determine if you should drop the pixels at all.

## Adapters Supporting GPP

Bidders on this list have self-declared their GPP support in their [https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders] md file by adding "gpp_supported: true".

<script src="/assets/js/dynamicTable.js" type="text/javascript"></script>

<script type="text/javascript">
var adaptersSupportingGpp=[];
var idx_gdpr=0;
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for item in bidder_pages %}
    {% if item.gpp_supported == true %}
    adaptersSupportingGpp[idx_gdpr]={};
    adaptersSupportingGpp[idx_gdpr].href="/dev-docs/bidders.html#{{item.biddercode}}";
    adaptersSupportingGpp[idx_gdpr].text="{{item.title}}";
    idx_gdpr++;
    {% endif %}
{% endfor %}
</script>

<div id="adaptersTableGpp">
        <script>
           writeDynamicTable({div: "adaptersTableGpp", data: "adaptersSupportingGpp", sort: "rowFirst", striped: false} );
        </script>
</div>

## Further Reading

- [IAB Global Privacy Platform Full Specification Repository](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform)
- [IAB Global Privacy Platform CMP API Specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md)
- [Prebid Consent Management - GDPR Module](/dev-docs/modules/consentManagement.html)
- [Prebid Consent Management - US Privacy Module](/dev-docs/modules/consentManagementUsp.html)
- [CMP Best Practices](https://docs.prebid.org/dev-docs/cmp-best-practices.html)
