---
layout: page_v2
title: Setting up Prebid Video in Google Ad Manager
head_title: Setting up Prebid Video in Google Ad Manager
description: Setting up Prebid Video in Google Ad Manager
pid: 3
hide: false
top_nav_section: adops
nav_section: tutorials
sidebarType: 3
---



# Setting up Prebid Video in Google Ad Manager
{: .no_toc}

This page describes how to set up video creatives in Google Ad Manager for use with Prebid.js.

For general Google Ad Manager line item setup instructions, see the other pages in this section.

For engineering setup instructions, see
[Show Video Ads with a Google Ad Manager Video Tag]({{site.baseurl}}/dev-docs/show-video-with-a-dfp-video-tag.html).

* TOC
{:toc}

## Line Item Setup

- In the **New line item** dialog, under **Inventory sizes**, select the **Video VAST** radio button.

- In the **Master** text area, add your video player size(s).

![Google Ad Manager New Line Item]({{site.baseurl}}/assets/images/ad-ops/dfp-creative-setup/dfp-creative-setup-03.png){: .pb-md-img :}

Other line item settings and key/value targeting are the same as [those recommended for Prebid display]({{site.baseurl}}/adops/step-by-step.html#step-1-add-a-line-item), with one exception:

+ By default, Prebid.js caps all CPMs at $20.  As a video seller, you may expect to see CPMs higher than $20.  In order to receive those bids, you'll need to make sure your dev team implements custom price buckets as described in the [engineering setup instructions]({{site.baseurl}}/dev-docs/show-video-with-a-dfp-video-tag.html).  Once those changes are made on the engineering side, there should be no changes required from the ad ops side to support CPMs over $20.

{: .alert.alert-success :}
Be sure to duplicate your line item and video creative for each Prebid price bucket you intend to create. You may also need separate video line items for each cache service being used. For example, if both AppNexus and Rubicon Project are bidders, you'll need separate line items to support the different cache URLs required.

## Creative Setup

1\. For each line item you created above, select **new creative set**.

2\. In the dialog that appears, set the **creative set type** to **"Redirect"**

3\. Set the **VAST tag URL** to the cache location. Note that each bidder, e.g. Rubicon Project, may have a different cache location URL.

If you're using a single order for all bidders, then the VAST URL will be the same for each bidder:

{% highlight html %}
   https://prebid.adnxs.com/pbc/v1/cache?uuid=%%PATTERN:hb_uuid%%
or
   [other bidder cache location]
{% endhighlight %}

If you're using different orders for each bidder, the VAST URL for each will need to be different:

{% highlight html %}
   https://prebid.adnxs.com/pbc/v1/cache?uuid=%%PATTERN:hb_uuid_BIDDERCODE%%
or
   [other bidder cache location]
{% endhighlight %}


   {: .alert.alert-warning :}
   This VAST tag URL is **required** in order to show video ads.  It points to
   a server-side cache hosted by your Prebid Server provider.

   {: .alert.alert-info :}
   **Prebid Cache and the VAST creative URL warning**  
   Google Ad Manager will show you a warning that fetching VAST from the creative
   URL failed.  This is expected, since the creative URL above points
   to a server-side asset cache hosted by Prebid Server.

4\. Set the **duration** to **1**

The resulting creative should look something like the following:

![Google Ad Manager Video Creative Setup]({{site.baseurl}}/assets/images/ad-ops/dfp-creative-setup/dfp-creative-setup-04.png){: .pb-md-img :}

That's it as far as Prebid setup is concerned.  At this point you can add any other options you would normally use, e.g., labels or tracking URLs.

# Additional Setup for Long-Form (ad pods)

## Further Reading

+ [Show Video Ads with Google Ad Manager]({{site.baseurl}}/dev-docs/show-video-with-a-dfp-video-tag.html) (Engineering setup)
+ [Create a Master Video Tag Manually](https://support.google.com/admanager/answer/1068325?hl=en&ref_topic=2480647) (Google Ad Manager)
+ [Add Key-Values to a Master Video Ad Tag](https://support.google.com/dfp_premium/answer/1080597) (Google Ad Manager)
+ [Google Ad Manager Macros](https://support.google.com/admanager/answer/2376981) (Google Ad Manager)
