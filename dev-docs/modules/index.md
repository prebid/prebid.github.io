---
layout: page_v2
title: Prebid.js Modules
description: Module Documentation
sidebarType: 1
---

# Prebid.js Module Overview
{:.no_toc}

The core of Prebid.js contains only the foundational code needed for header bidding. Any functionality that could be considered an add-on is part of a module. These are the major categories:

- [Bidder adapters](/dev-docs/bidders.html)
- [Analytics adapters](/overview/analytics.html)
- Any other extensible functionality - documented on this page

* TOC
{:toc}

{% assign module_pages = site.pages | where: "page_type", "module" %}

## Recommended Modules

Prebid.org highly recommends that publishers utilize the following modules:
<br/>
<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Module</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
{% for page in module_pages %}{% if page.recommended == true %}
    <tr>
      <td><a href="{{page.url}}"><strong>{{page.display_name}}</strong></a></td>
      <td>{{page.description}}</td>
    </tr>
{% endif %}{% endfor %}
</tbody>
</table>

## General Modules

Modules in the Real-Time Data (RTD) category conform to
a consistent set of publisher controls. The publisher can choose to run multiple
RTD modules, define an overall amount of time they're willing to wait for
results, and even flag some of the modules as being higher priority
than others. See [the realTimeData setConfig](/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData) reference for more details.

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Module</th>
      <th>Description</th>
      <th>RTD?</th>
    </tr>
  </thead>
  <tbody>
{% for page in module_pages %}{% if page.recommended == true or page.vendor_specific == true %}{% continue %}{% endif %}
    <tr>
      <td><a href="{{page.url}}"><strong>{{page.display_name}}</strong></a></td>
      <td>{{page.description}}</td>
      {% if page.module_type == "rtd" %}<td>yes</td>{% else %}<td>no</td>{% endif %}
    </tr>
{% endfor %}
</tbody>
</table>

## Vendor-Specific Modules
These modules may require accounts with a service provider.
<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Module</th>
      <th>Description</th>
      <th>RTD?</th>
    </tr>
  </thead>
  <tbody>
{% for page in module_pages %}{% if page.recommended == true %}{% continue %}{% endif %}{% if page.vendor_specific == true %}
    <tr>
      <td><a href="{{page.url}}"><strong>{{page.display_name}}</strong></a></td>
      <td>{{page.description}}</td>
      {% if page.module_type == "rtd" %}<td>yes</td>{% else %}<td>no</td>{% endif %}
    </tr>
{% endif %}{% endfor %}
</tbody>
</table>

## Further Reading

+ [Source code of all modules](https://github.com/prebid/Prebid.js/tree/master/modules)
+ [How to add a Bid Adapter](/dev-docs/bidder-adaptor.html)
+ [How to add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
+ [How to add a Real Time Data Submodule](/dev-docs/add-rtd-submodule.html)
