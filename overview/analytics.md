---
layout: page_v2
title: Analytics for Prebid.js
description: Prebid.js Analytics Overview
sidebarType: 1
---

# Prebid.js Analytics

There are several analytics adapter plugins available to track header bidding performance for your site.

{: .table .table-bordered .table-striped }
| Analytics Adapter | Cost | Contact |
| ------------- | ------------- | ----------- |
| Appier | Contact vendor | [Website](https://www.appier.com) |
| Adagio | Contact vendor| [Website](https://adagio.io)|
| AdxPremium | Free to try| [Website](http://luponmedia.com)|
| Assertive Yield (contact for adapter) | Free to try (Large accounts \$0.002 CPM or sampled < 10mm/m imp.) | [Website](https://yield.assertcom.de) |
| Datablocks Analytics | Contact vendor| [Website](https://datablocks.net) |
| Finteza Analytics | <a href="mailto: support@finteza.com">Contact vendor</a> | [Website](https://www.finteza.com/) |
| [Google Analytics]({{site.baseurl}}/overview/ga-analytics.html) | Free up to a certain volume. See [terms](https://www.google.com/analytics/terms/) | [Website](https://www.google.com/analytics) |
| Invisibly Analytics | Contact vendor | [Website](https://invisibly.com/) |
| Kargo Analytics | Contact vendor | [Website](https://kargo.com/) |
| Livewrapped Analytics | Contact vendor | [Website](https://livewrapped.com/) |
| LiveYield | Contact vendor | [Website](https://www.pubocean.com/liveyield) |
| OpenX | Contact vendor | [Website](https://www.openx.com/publishers/header-bidding/) |
| PrebidAnalytics by Roxot | Paid, see [pricing](http://prebidanalytics.com/#pricing). | [Website](http://prebidanalytics.com/overview-examples) |
| [Prebid Manager](http://prebidmanager.com/) | Free trial and free up to a certain volume. See [pricing](http://prebidmanager.com/#pricing) | [Website](http://prebidmanager.com/) |
| PubWise | Free & Paid, see [pricing](https://pubwise.io/pricing/) | [Website](https://pubwise.io/pubwise/) |
| PulsePoint | Contact vendor | [Website](https://www.pulsepoint.com/) |
| RealVu | Contact vendor | [Website](https://www.realvu.com/rvaa/) |
| Rivr Analytics | Contact vendor | [Website](https://www.rivr.ai/)|
| Rubicon Project | <a href="mailto: sales@rubiconproject.com">Contact vendor</a> | [Website](https://rubiconproject.com/header-bidding-for-publishers/) |
| Scaleable.ai Analytics | Free & Paid | [Website](https://scaleable.ai) |
| ShareThrough | Contact vendor | |
| Sortable | Contact vendor | [Website](https://www.sortable.com) |
| Sovrn | <a href="https://www.sovrn.com/contact/">Contact vendor</a> | [Website](https://www.sovrn.com/analytics/)|
| STAQ | <a href="https://www.staq.com/contact">Contact vendor</a> | [Website](https://www.staq.com/)|
| Vuble | Contact vendor | [Website](https://vuble.tv/us/prebid/) |
| Yieldone | Contact vendor | [Website](https://www.platform-one.co.jp/) |
| YuktaMedia Analytics | Contact vendor | [Website](https://yuktamedia.com/publishers/prebid/) |

None of these analytics options are endorsed or supported by Prebid.org.

## How to Integrate an Analytics Adapter

Each analytics provider has specific instructions for using their system, but these are the general steps:

- Create an account with the analytics vendor and obtain the necessary IDs
- Build Prebid.js package with the vendor's analytics adapter

{% highlight js %}
gulp bundle --modules=exAnalyticsAdapter,xyzBidAdapter
{% endhighlight %}

- If required, load analytics JavaScript from vendor directly on the page
- Call the `pbjs.enableAnalytics()` function

e.g.

{% highlight js %}
pbjs.que.push(function() {
  pbjs.enableAnalytics({
    provider: 'NAME',
    options: {
    [...]
    }
  });
});
{% endhighlight %}

## Further Reading

- [Integrate with the Prebid Analytics API]({{site.baseurl}}/dev-docs/integrate-with-the-prebid-analytics-api.html) (For developers)
