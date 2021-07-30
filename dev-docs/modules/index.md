---
layout: page_v2
title: Prebid.js Modules
description: Prebid.js Module Documentation
sidebarType: 1
---

# Prebid.js Module Overview
{:.no_toc}

The core of Prebid.js contains only the foundational code needed for header bidding. Any functionality that could be considered an add-on or that covers a special case is part of a module.

Modules are in the [`modules` folder in the repo](https://github.com/prebid/Prebid.js/tree/master/modules). There are several categories:

- [Bid adapters](/dev-docs/bidders.html)
- The [Prebid Server Bid Adapter](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server) - this is a special case module that integrates with Prebid.js core.
- [Analytics adapters](/overview/analytics.html)
- [User ID Modules](/dev-docs/modules/userId.html)
- General Modules - see below.
- Real Time Data Modules - see below.

* TOC
{:toc}

## General Modules

{: .table .table-bordered .table-striped }
| Module              | Description  |
|---------------------+--------------|
| [**Currency**](/dev-docs/modules/currency.html) | Converts bid currency into ad server currency based on data in a supplied exchange rate file. |
| **ConsentManagement** | Collecting and passing consent information in support of privacy regulations:{::nomarkdown}<ul><li><a href="/dev-docs/modules/consentManagement.html">EU GDPR</a> with optional <a href="/dev-docs/modules/gdprEnforcement.html">GDPR Enforcement</a> module</li><li><a href="/dev-docs/modules/consentManagementUsp.html">US Privacy</a> (CCPA)</li></ul>{:/} See [CMP Best Practices.](/dev-docs/cmp-best-practices.html) |
| [**Google Ad Manager Express**](/dev-docs/modules/dfp_express.html) | A simplified installation mechanism for publishers that have Google Publisher Tag (GPT) ad calls in their pages. |
| [**Supply Chain Object**](/dev-docs/modules/schain.html) | Validates and makes the Supply Object available to bidders |
| [**ID Import Library**](/dev-docs/modules/idLibrary.html) | Retrieve user ids deployed on your site, and return them to a configurable endpoint for ID Graphing |  
| [**Advanced Size Mapping**](/dev-docs/modules/sizeMappingV2.html) | Display Responsive AdUnits in demanding page environments. |
| [**Price Floors Module**](/dev-docs/modules/floors.html) | Configure and enforce minimum bids. |
| [**GPT Pre-Auction Module**](/dev-docs/modules/gpt-pre-auction.html) | Adds a PB Ad Slot and matching GAM ad unit name to each ad unit's first-party data before bid requests are sent to the adapters. |
| [**First Party Data Enrichment**](/dev-docs/modules/enrichmentFpdModule.html) | Pulls well-known FPD from the environment to form a base of data available to all adapters. |
| [**MASS**](/dev-docs/modules/mass.html) | Enables the MASS protocol for Prebid and custom renderers by DealID |  
| [**MultiBid Module**](/dev-docs/modules/multibid.html) | Allows bidders to send multiple bids to the ad server. |
| [**Bid Viewability**](/dev-docs/modules/bidViewable.html) | Triggers an event which can be consumed by analytics and bid adapters. |

## Real-Time Data Modules

All of the modules that fall under the Real-Time Data (RTD) category conform to
a consistent set of publisher controls. The pub can choose to run multiple
RTD modules, define an overall amount of time they're willing to wait for
results, and even flag some of the modules as being more "important"
than others.

See [the realTimeData setConfig](/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData) reference for more details.

{% assign module_pages = site.pages | where: "page_type", "module" | where: "module_type", "rtd" %}

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Module</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
{% for page in module_pages %}
  {% if page.enable_download == false %}{% continue %}{% endif %}
    <tr>
      <td><a href="/dev-docs/modules/{{page.module_code}}.html"><strong>{{page.title}}</strong></a></td>
      <td>{{page.description}}</td>
    </tr>
{% endfor %}
</tbody>
</table>

## Video Modules

{: .table .table-bordered .table-striped }
| Module              | Description  |
|---------------------+--------------|
| [**Ad Pod**](/dev-docs/modules/adpod.html) | Enables developers to add support for a new adserver that handles ad pod (long-form) videos |
| [**Freewheel**](/dev-docs/modules/freewheel.html) | Passes key value targeting to Freewheel SDK |
| [**Google Ad Manager Video**](/dev-docs/modules/dfp_video.html) | Required for serving instream video through Google Ad Manager. |
| [**IAB Category Translation**](/dev-docs/modules/categoryTranslation.html) | Converts IAB sub category to Ad server category for long-form videos. |
| [**Instream Video Ads Tracking**](/dev-docs/modules/instreamTracking.html) | Allow Analytics Adapters and Bid Adapters to track `BID_WON` events for Instream video bids. |
| [**Konduit Accelerate**](/dev-docs/modules/konduit.html) | Provides Real Time Start Rate Performance per Bidder. |

## Testing and Debug Modules

{: .table .table-bordered .table-striped }
| Module              | Description  |
|---------------------+--------------|
| [**Server-to-Server Testing**](/dev-docs/modules/s2sTesting.html) | Adds A/B test support to ease into server-side header bidding. |
| [**First Party Data Validation**](/dev-docs/modules/validationFpdModule.html) | Verify First Party Data ortb2 fields and data types. |

## Further Reading

+ [Source code of all modules](https://github.com/prebid/Prebid.js/tree/master/modules)
+ [Bidders' Params](/dev-docs/bidders.html)
+ [How to add a Real Time Data Submodule](/dev-docs/add-rtd-submodule.html)
