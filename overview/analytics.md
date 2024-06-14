---
layout: page_v2
title: Analytics for Prebid.js
description: Prebid.js Analytics Adapters
sidebarType: 1
---

# Prebid.js Analytics Adapters

There are many analytics adapter plugins available to track header bidding performance for your site.

## How to Integrate an Analytics Adapter

Each analytics provider has specific instructions for using their system, but these are the general steps:

- Create an account with the analytics vendor and obtain the necessary IDs
- Build Prebid.js package with the vendor's analytics adapter

```javascript
gulp bundle --modules=exAnalyticsAdapter,xyzBidAdapter
```

- If required, load analytics JavaScript from vendor directly on the page
- Call the [`pbjs.enableAnalytics()` function](/dev-docs/publisher-api-reference/enableAnalytics.html)

e.g.

```javascript
pbjs.que.push(function() {
  pbjs.enableAnalytics({
    provider: 'NAME',
    options: {
    [...]
    }
  });
});
```

## Analytics Adapters

{% assign analytics_pages = site.pages | where: "layout", "analytics" %}

<ul>
{% for page in analytics_pages %}
<li>
<a href="#{{ page.modulecode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>

## Analytics Adapter Documentation

{% for page in analytics_pages %}
<div class="bs-docs-section" markdown="1">
<a name="{{ page.modulecode }}" ></a>
<h3>{{ page.title }}</h3>
<h4>Features</h4>

{: .table .table-bordered .table-striped }
| **Module Code** | {{ page.modulecode }} | **Prebid.org Member** | {% if page.prebid_member == true %}yes{% else %}no{% endif %} |
| **GDPR Support** | {% if page.tcfeu_supported == true %}yes{% elsif page.tcfeu_supported == false %}no{% else %}Check with vendor{% endif %} | **USP/CCPA Support** | {% if page.usp_supported == true %}yes{% elsif page.usp_supported == false %}no{% else %}Check with vendor{% endif %} |
| **IAB GVL ID** | {% if page.gvl_id %}{{page.gvl_id}}{% else %}Check with vendor{% endif %} | **COPPA Support** | {% if page.coppa_supported == true %}yes{% elsif page.coppa_supported == false %}no{% else %}Check with vendor{% endif %} |

{{ page.content }}
</div>
{% endfor %}

## Related Topics

- [Integrate with the Prebid Analytics API]({{site.baseurl}}/dev-docs/integrate-with-the-prebid-analytics-api.html) (For developers)
