---
layout: page_v2
title: Prebid Modules
description: Module Documentation
sidebarType: 1
---


# Prebid.js Module Overview
{:.no_toc}

The core of Prebid.js contains only the foundational code needed for header bidding. Any functionality that could be considered an add-on or that covers a special case is being moved out into modules.  Examples of this kind of code include:

- Bidder adapters
- Special auction logic
- Ad server API integrations
- Any other extensible functionality

This section of the site contains user-submitted module documentation.  We're hoping that it will grow over time.

To see all of the modules that are available, see the [`modules` folder in the repo](https://github.com/prebid/Prebid.js/tree/master/modules).

If you are looking for bidder adapter parameters, see [Bidders' Params]({{site.baseurl}}/dev-docs/bidders.html).

* TOC
{:toc}

## Modules

{: .table .table-bordered .table-striped }
| Module              | Description  |
|---------------------+--------------|
| [**Currency**]({{site.baseurl}}/dev-docs/modules/currency.html) | Converts bid currency into ad server currency based on data in a supplied exchange rate file. |
| [**DFP Express**]({{site.baseurl}}/dev-docs/modules/dfp_express.html) | A simplified installation mechanism for publishers that have DoubleClick Google Publisher Tag (GPT) ad calls in their pages. |
| [**DigiTrust**]({{site.baseurl}}/dev-docs/modules/digitrust.html) | A method of including the standard cross-domain ID in a DigiTrust package. |
| [**Server-to-Server Testing**]({{site.baseurl}}/dev-docs/modules/s2sTesting.html) | Adds A/B test support for easing into server-side header bidding. |
| [**DFP Video**]({{site.baseurl}}/dev-docs/modules/dfp_video.html) | Required for serving instream video through DFP. |
| [**Publisher Common ID**]({{site.baseurl}}/dev-docs/modules/pubCommonId.html) | Adds a persisted user ID in the publisher's domain. |
| [**GDPR ConsentManagement**]({{site.baseurl}}/dev-docs/modules/consentManagement.html) | Facilitates collecting/passing consent information in support of the EU GDPR. |
| [**IAB Category Translation**]({{site.baseurl}}/dev-docs/modules/iabCatalogTranslation.html) | Converts IAB sub category to Ad server category for long-form videos. |
| [**Freewheel**]({{site.baseurl}}/dev-docs/modules/freewheel.html) | Passes key value targeting to Freewheel SDK |
| [**Ad Pod**]({{site.baseurl}}/dev-docs/modules/adpod.html) | Enables developers to add support for a new adserver that handles ad pod (long-form) videos |

## Further Reading

+ [Source code of all modules](https://github.com/prebid/Prebid.js/tree/master/modules)
+ [Bidders' Params]({{site.baseurl}}/dev-docs/bidders.html)


