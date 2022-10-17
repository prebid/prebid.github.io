---
layout: page_v2
title: Setting up Prebid for AMP in Google Ad Manager
head_title: Setting up Prebid for AMP in Google Ad Manager
description: Setting up Prebid for AMP in Google Ad Manager
sidebarType: 3
---



# Setting up Prebid for AMP in Google Ad Manager
{: .no_toc}

This page describes how to set up a line item and creative to serve on AMP pages with Prebid.js.

* TOC
{:toc}

{: .alert.alert-info :}
Manually configuring GAM for Prebid can be a fair amount of work.
Consider using our official command line tool, [Prebid Line Item Manager](/tools/line-item-manager.html), to create the setup. Using this tool may save you time and help you avoid mistakes.
 
{: .alert.alert-success :}
For engineering setup instructions, see [Show Prebid Ads on AMP Pages]({{site.github.url}}/dev-docs/show-prebid-ads-on-amp-pages.html).

## Line Item Setup

In addition to your other line item settings, you'll need the following:

+ Enter the **Inventory Sizes** of the creatives you want the line item to use, e.g., *300x250*, *300x50*, etc.

+ Set the **Type** to *Price Priority*

+ Set **Display creatives** to *One or More*.

+ Set **Rotate creatives** to *Evenly*.

+ In the targeting section, select **Key-values** targeting.  You'll need to coordinate with your development team on what key-values you want to target.

Save your line item and add a creative.

## Creative Setup

1. On the new creative screen, select the **Third party** creative type.
2. Choose the "Standard" Code Type radio button. The "AMP" option is for AMPHTML hosted by a 3rd party.
3. Ensure that the **Serve into a SafeFrame** box is checked.
4. Enter the below code snippet in the **Code snippet** text area.

{% capture sendAllBidsAlert %}
If you're using the `Send All Bids` scenario (where every bidder has a separate
order), the creative and targeting will be different from the example shown here. See [Send All Bids](/adops/send-all-bids-adops.html) for details.
{% endcapture %}

{% include alerts/alert_important.html content=sendAllBidsAlert %}

{% highlight html %}

<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%PATTERN:url%%";
  ucTagData.targetingMap = %%PATTERN:TARGETINGMAP%%;
  ucTagData.hbPb = "%%PATTERN:hb_pb%%";

  try {
    ucTag.renderAd(document, ucTagData);
  } catch (e) {
    console.log(e);
  }
</script>
{% endhighlight %}

{: .alert.alert-success :}
You can always get the latest version of the creative code from [the AMP example creative file in our GitHub repo](https://github.com/prebid/prebid-universal-creative/blob/master/template/amp/dfp-creative.html).

{% include adops/adops-creative-declaration.html %}

## Further Reading

+ [Show Prebid Ads on AMP Pages]({{site.github.url}}/dev-docs/show-prebid-ads-on-amp-pages.html)
+ [How Prebid on AMP Works]({{site.github.url}}/dev-docs/how-prebid-on-amp-works.html)



<!-- Reference Links -->

[PBS]: {{site.baseurl}}/dev-docs/get-started-with-prebid-server.html
[RTC-Overview]: https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/rtc-documentation.md
