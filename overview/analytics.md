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
| adWMG Analytics | Contact vendor| [Website](https://adwmg.com)|
| AdxPremium | Free to try| [Website](https://luponmedia.com)|
| Assertive Yield (contact for adapter) | Free to try (Large accounts \$0.002 CPM or sampled < 10mm/m imp.) | [Website](https://yield.assertcom.de) |
| ATS Analytics | Contact vendor | [Website](https://liveramp.com) |
| Datablocks Analytics | Contact vendor| [Website](https://datablocks.net) |
| Finteza Analytics | <a href="mailto: support@finteza.com">Contact vendor</a> | [Website](https://www.finteza.com/) |
| [Google Analytics]({{site.baseurl}}/overview/ga-analytics.html) | Free up to a certain volume. See [terms](https://www.google.com/analytics/terms/) | [Website](https://www.google.com/analytics) |
| Invisibly Analytics | Contact vendor | [Website](https://invisibly.com/) |
| Kargo Analytics | Contact vendor | [Website](https://kargo.com/) |
| Konduit Accelerate | Contact vendor | [Website](https://konduitvideo.com/) |
| Livewrapped Analytics | Contact vendor | [Website](https://livewrapped.com/) |
| LiveYield | Contact vendor | [Website](https://www.pubocean.com/liveyield) |
| oolo | Contact vendor | [Website](https://www.oolo.io) |
| OpenX | Contact vendor | [Website](https://www.openx.com/publishers/header-bidding/) |
| Media.net | <a href="mailto: prebid-support@media.net">Contact vendor</a>| [Website](https://media.net) |
| PrebidAnalytics by Roxot | [Paid]( http://prebidanalytics.roxot.com/) | [Website](http://prebidanalytics.roxot.com/) |
| [Prebid Manager](https://prebidmanager.com/) | Free trial and free up to a certain volume. See [pricing](http://prebidmanager.com/#pricing) | [Website](http://prebidmanager.com/) |
| [Pubperf](https://www.pubperf.com/) | Free trial. See [pricing](https://www.pubperf.com/pricing) | [Website](http://www.pubperf.com/) |
| [Pubstack](https://pubstack.io?source=prebid.org-analytics) ~ Real Time Analytics For Prebid and GAM | <a href="mailto: sales@pubstack.io">Start a free trial / Talk to the Sales Team</a> | [Website](https://pubstack.io?source=prebid.org-analytics) |
| PubWise | Free & Paid, see [pricing](https://pubwise.io/pricing/) | [Website](https://www.pubwise.io/) |
| PubXAi | Contact vendor | [Website](http://pubx.ai/) |
| PulsePoint | Contact vendor | [Website](https://www.pulsepoint.com/) |
| RealVu | Contact vendor | [Website](https://www.realvu.com/rvaa/) |
| [Relevant Yield](https://www.relevant-digital.com/relevantyield) | <a href="mailto:sales@relevant-digital.com">Contact vendor</a> | [Website](https://www.relevant-digital.com/relevantyield) |
| Rivr Analytics | Contact vendor | [Website](https://www.rivr.ai/)|
| Rubicon Project | <a href="mailto: sales@rubiconproject.com">Contact vendor</a> | [Website](https://rubiconproject.com/header-bidding-for-publishers/) |
| Scaleable.ai Analytics | Free & Paid | [Website](https://scaleable.ai) |
| ShareThrough | Contact vendor | |
| Sortable | Contact vendor | [Website](https://www.sortable.com) |
| Sovrn | <a href="https://www.sovrn.com/contact/">Contact vendor</a> | [Website](https://www.sovrn.com/analytics/)|
| STAQ | <a href="https://www.staq.com/contact">Contact vendor</a> | [Website](https://www.staq.com/)|
| Tercept Analytics | <a href="https://www.tercept.com/unified-analytics/">Contact vendor</a> | [Website](https://www.tercept.com/)|
| ucfunnel | Contact vendor | [Website](https://www.ucfunnel.com/)|
| Yieldone | Contact vendor | [Website](https://www.platform-one.co.jp/) |
| YuktaOne Analytics by YuktaMedia | <a href="mailto:info@yuktamedia.com">Freemium \| Contact vendor</a> | [Website](https://yuktamedia.com/prebid/) |

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
