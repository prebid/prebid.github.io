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

{% assign api_pages = site.pages | where: "layout", "api_prebidjs" %}

## Find a method

<input type="text" id="autocomplete-filter" class="autocomplete-filter">
<script src="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.js" integrity="sha512-HcBl0GSJvt4Qecm4srHapirUx0HJDi2zYXm6KUKNNUGdTIN9cBwakVZHWmRVj4MKgy1AChqhWGYcMDbRKgO0zg==" crossorigin="anonymous"></script>
<script>
var AutocompleteList = [{% for page in api_pages %}{ label: '{{ page.title }}', value: '/{{ page.path | replace: ".md", ".html" }}' },{% endfor %}];
</script>
<script src="{{site.baseurl}}/assets/js/autocomplete.js"></script>

<a name="module_pbjs"></a>

## pbjs

{% for page in api_pages %}
<li><a href="/{{ page.path | replace: '.md', '.html'}}">{{page.title}}</a></li>
{% endfor %}
