---
layout: page_v2
title: Publisher API Reference
description: Publisher API Reference for Prebid.js Header Bidding
top_nav_section: dev_docs
nav_section: reference
pid: 10
sidebarType: 1
---



# Publisher API Reference

This page has documentation for the public API methods of Prebid.js.

### Find a method

<input type="text">

<a name="module_pbjs"></a>

## pbjs

{% assign api_pages = site.pages | where: "layout", "api_prebidjs" %}

<ul>
{% for page in api_pages %}
<li><a href="/{{ page.path | replace: '.md', '.html'}}">{{page.title}}</a></li>
{% endfor %}
</ul>
