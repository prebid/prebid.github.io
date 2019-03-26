---
layout: page_v2
title: How Prebid on AMP Works
description: How Prebid on AMP Works
pid: 0
is_top_nav: yeah
top_nav_section: dev_docs
nav_section: prebid-amp
---

<div class="bs-docs-section" markdown="1">

# How Prebid on AMP Works
{: .no_toc}

The diagram below shows how the pieces of an AMP+Prebid solution fit together:

1. AMP runtime calls Prebid Server URL, including macros.
1. Prebid Server retrieves demand partner configuration.
1. Prebid Server sends bid requests to demand partners and caches bid responses.
1. Prebid Server responds to AMP runtime with key-value targeting.
1. AMP Network constructs ad request URL and Prebid creative is served.
1. Creative content is retrieved from cache and renders.

![Prebid AMP Overview Diagram]({{site.baseurl}}/assets/images/dev-docs/amp-rtc.png){: .pb-lg-img }

## Related Topics

+ [AMP Format Overview]({{site.baseurl}}/formats/amp.html)
+ [Show Prebid Ads on AMP Pages]({{site.baseurl}}/dev-docs/show-prebid-ads-on-amp-pages.html) (Developers)
+ [Setting up Prebid for AMP in DFP]({{site.baseurl}}/adops/setting-up-prebid-for-amp-in-dfp.html) (Ad Ops)

</div>

<!-- Reference Links -->

[PBS]: {{site.baseurl}}/dev-docs/get-started-with-prebid-server.html
[RTC-Overview]: https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/rtc-documentation.md
