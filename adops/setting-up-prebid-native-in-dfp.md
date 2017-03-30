---
layout: page
title: Setting up Prebid Native in DFP
head_title: Setting up Prebid Native in DFP
description: Setting up Prebid Native in DFP
pid: 3
hide: false
top_nav_section: adops
nav_section: tutorials
---

# Setting up Prebid Native in DFP (Alpha)
{: .no_toc}

This page describes how to set up native creatives in DFP for use with Prebid.js.

For more information about DFP native ad setup, see the [DFP native ads documentation](https://support.google.com/dfp_premium/answer/6366845?hl=en).

* TOC
{:toc}

## 1. Add a native ad unit

You can specify a size for the ad unit, or specify the "fluid" size.

![]({{site.github.url}}/assets/images/ad-ops/dfp-native/native-ad-unit.png)

## 2. Choose a Native Style

["Native content ad"](https://support.google.com/dfp_premium/answer/6366881) is a system-defined ad format. You can also create a [custom native ad format](https://support.google.com/dfp_sb/answer/6366911?hl=en).

![]({{site.github.url}}/assets/images/ad-ops/dfp-native/select-native-ad-format.png)

Add the HTML and CSS that define your native ad template. Note that `%%PATTERN%%` macros can be included in either field, and the HTML can contain JavaScript.  For more information, see the [DFP native styles docs](https://support.google.com/dfp_premium/answer/6366914).

![]({{site.github.url}}/assets/images/ad-ops/dfp-native/native-content-ad.png)

## 3. Set up your Line Item

In the line item's **Inventory Sizes** field, add the appropriate "native" size.

![]({{site.github.url}}/assets/images/ad-ops/dfp-native/new-line-item.png)

Then, target the native ad unit, and/or any key-values.

![]({{site.github.url}}/assets/images/ad-ops/dfp-native/add-targeting.png)

## 4. Add a Creative

Add a creative to your line item. If you set up your line item with the "native" inventory size above, you should only be able to select "Native" here.

![]({{site.github.url}}/assets/images/ad-ops/dfp-native/new-creative.png)

Then, select the appropriate native format for your needs.

![]({{site.github.url}}/assets/images/ad-ops/dfp-native/select-the-appropriate-native-format.png)

## Related Topics

+ [Show Native Ads with Prebid.js]({{site.github.url}}/dev-docs/show-native-ads.html) (Engineering setup instructions)
+ [Prebid Native Example with DFP]({{site.github.url}}/dev-docs/examples/prebid-native-example.html) (Full example code)
+ [Step by Step Guide to DFP Setup]({{site.github.url}}/adops/step-by-step.html) (Send top bid to ad server)
+ [Send all bids to the ad server]({{site.github.url}}/adops/send-all-bids-adops.html)
