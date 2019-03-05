---
layout: page_v2
title: Setup Line Items for DFP
description: Setup Line Items for DFP
pid: 0
top_nav_section: prebid-mobile
nav_section: prebid-mobile-adops
sidebarType: 2
---



# Step by Step Line Item Setup for DFP
{: .no_toc}

This page describes step by step how to set up Prebid Mobile line items for DFP to serve ads on app with the Prebid SDK. It is using the Universal Prebid Creative.

* TOC
{:toc }

## Step 1. Add a Line Item

In DFP, create a new order with a $0.50 line item.

Enter the inventory size of your mobile ad slots. Make sure to specify all the inventory sizes on your app.

Because header bidding partners return prices, set the Line Item **Type** to **Price priority** to enable them to compete on price.

![Price Priority]({{ site.github.url }}/assets/images/demo-setup/price-priority.png){: .pb-sm-img :}

<br>

Set the **Rate** to $0.50 so that this line item will compete with your other demand sources at $0.50 ECPM.

![Rate]({{ site.github.url }}/assets/images/demo-setup/rate.png){: .pb-sm-img :}

<br>

Set **Display Creatives** to *One or More* since we'll have one or more creatives attached to this line item.

Set **Rotate Creatives** to *Evenly*.

![Display and Rotation]({{ site.github.url }}/assets/images/demo-setup/display-and-rotation.png){: .pb-md-img :}

Choose the inventory that you want to run header bidding on.

By default, `Prebid Mobile` will send the highest bid price to DFP using the keyword `hb_pb` but will also pass the keys `hb_pb_BIDDERCODE`. You can decide to create one set of line items for all bidders or one set of line items for each bidder.

You'll need to coordinate with your development team on what key-values you want to target.

For instance, this line item will capture the bids in the range from $0.50 to $1 by targeting the keyword `hb_pb` set to `0.50` in the **Key-values** section.

![Key-values]({{ site.github.url }}/assets/images/prebid-mobile/adops-line-item-setup-dfp/dfp5.png){: .pb-md-img :}

**You must enter the value to two decimal places, e.g., `1.50`.  If you don't use two decimal places, header bidding will not work.**

![Key-values]({{ site.github.url }}/assets/images/demo-setup/key-values.png){: .pb-md-img :}

<br>

## Step 2. Add a Creative

Next, add a creative to this $0.50 line item; we will duplicate the creative later.

Choose the same advertiser we've assigned the line item to.

Note that this has to be a **Third party** creative. The **"Serve in Safeframe"** box has to be **UNCHECKED** or **CHECKED** (the Prebid Universal Creatve is safeframe compatible).

Copy this creative code snippet and paste it into the **Code snippet** box.

{: .alert.alert-success :}
You can always get the latest version of the creative code below from [the Mobile example creative file in our GitHub repo](https://github.com/prebid/prebid-universal-creative/blob/master/template/amp/dfp-creative.html).

{% highlight javascript %}

<script src = "https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%PATTERN:url%%";
  ucTagData.targetingMap = %%PATTERN:TARGETINGMAP%%;

  try {
    ucTag.renderAd(document, ucTagData);
  } catch (e) {
    console.log(e);
  }
</script>

{% endhighlight %}


Make sure the creative size is set to 1x1. This allows us to set up size override, which allows this creative to serve on all inventory sizes.

<br>

## Step 3. Attach the Creative to the Line Item

Next, let's attach the creative to the $0.50 line item you just created.  Click into the Line Item, then the **Creatives** tab.

There will be yellow box showing each ad spot that you haven't uploaded creatives for yet.  Since you've already made the creatives, click the **use existing creatives** next to each size.

![Use existing creatives list]({{ site.github.url }}/assets/images/demo-setup/use-existing-creatives-01.png)

In the pop-up dialog that appears, click **Show All** to remove the default size filters and see the 1x1 creatives. Include the prebid creative and click **Save**.

![Use existing creatives dialog]({{ site.github.url }}/assets/images/demo-setup/use-existing-creatives-02.png)

Back in the line item, go into the **Creatives** tab again, and click into the creative you just added.

Then, in the creative's **Settings** tab, override all sizes in the **Size overrides** field.

Save the creative and go back to the line item.

<br>

## Step 4. Duplicate Line Items

Now let's duplicate our line item for bids above $0.50.

In the Prebid order page, copy the line item with shared creatives.

This way you only have 4 creatives to maintain, and any updates to those creatives are applied to all pre-bid line items.

For example, we can duplicate 3 more line items:

- $1.00
- $1.50
- $2.00

Let's go into each of them to update some settings.  For each duplicated line item:

1.  Change the name to reflect the price, e.g., "Prebid\_1.00", "Prebid\_1.50"

2.  Change the **Rate** to match the new price of the line item.

3.  In **Key-values**, make sure to target `hb_pb` at the new price, e.g., $1.00.  Again, be sure to use 2 decimal places.

4.  (Optional) Set the start time to *Immediate* so you don't have to wait.

Repeat for your other line items until you have the pricing granularity level you want.



