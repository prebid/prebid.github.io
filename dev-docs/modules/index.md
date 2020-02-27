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

## General Modules

{: .table .table-bordered .table-striped }
| Module              | Description  |
|---------------------+--------------|
| [**Currency**](/dev-docs/modules/currency.html) | Converts bid currency into ad server currency based on data in a supplied exchange rate file. |
| **ConsentManagement** | Facilitates collecting and passing consent information in support of privacy regulations: [EU GDPR](/dev-docs/modules/consentManagement.html) and [US Privacy](/dev-docs/modules/consentManagementUsp.html) (CCPA). |
| [**Google Ad Manager Express**](/dev-docs/modules/dfp_express.html) | A simplified installation mechanism for publishers that have Google Publisher Tag (GPT) ad calls in their pages. |
| [**Supply Chain Object**](/dev-docs/modules/schain.html) | Validates and makes the Supply Object available to bidders |
| [**User ID**](/dev-docs/modules/userId.html) | Sub-modules are available to support a range of identification approaches: Criteo RTUS, DigiTrust, ID5 Universal ID, IdentityLink, PubCommon ID, and Unified ID. |
| [**Browsi Viewability**]({{site.baseurl}}/dev-docs/modules/browsiRtdProvider.html) | Browsi provider for real time data module.  |

## Video Modules

{: .table .table-bordered .table-striped }
| Module              | Description  |
|---------------------+--------------|
| [**Ad Pod**](/dev-docs/modules/adpod.html) | Enables developers to add support for a new adserver that handles ad pod (long-form) videos |
| [**Freewheel**](/dev-docs/modules/freewheel.html) | Passes key value targeting to Freewheel SDK |
| [**Google Ad Manager Video**](/dev-docs/modules/dfp_video.html) | Required for serving instream video through Google Ad Manager. |
| [**IAB Category Translation**](/dev-docs/modules/categoryTranslation.html) | Converts IAB sub category to Ad server category for long-form videos. |
| [**Konduit Accelerate**](/dev-docs/modules/konduit.html) | Module for serving instream video through Konduit Accelerate service. |

## Testing and Debug Modules

{: .table .table-bordered .table-striped }
| Module              | Description  |
|---------------------+--------------|
| [**Server-to-Server Testing**](/dev-docs/modules/s2sTesting.html) | Adds A/B test support to ease into server-side header bidding. |

## Deprecated Modules

{: .table .table-bordered .table-striped }
| Module              | Description  |
|---------------------+--------------|
| [**Publisher Common ID**](/dev-docs/modules/pubCommonId.html) | (Deprecated - please use User ID module) Adds a persisted user ID in the publisher's domain. |

## Further Reading

+ [Source code of all modules](https://github.com/prebid/Prebid.js/tree/master/modules)
+ [Bidders' Params]({{site.baseurl}}/dev-docs/bidders.html)


