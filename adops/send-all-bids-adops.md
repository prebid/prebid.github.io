---
layout: page_v2
title: Send All Bids to the Ad Server
head_title: Send All Bids to the Ad Server
description: Send all bids to the ad server for reporting and data analysis.
pid: 2
top_nav_section: adops
nav_section: tutorials
sidebarType: 3
---



# Send all bids to the ad server - Ad Ops setup
{: .no_toc }

This page shows how to set up your ad server so that you can send all bids and report on them.

As a publisher, you may wish to have your ad server see **all** header bidding bids (instead of seeing only the winning bids in each auction).  Reasons you might want this behavior include:

+ You want your ad server to see all header bidding bids, so that your ad server can report on bid prices, instead of only winning prices

+ You have a contractual agreement with your header bidding partner

{: .alert.alert-success :}
See the [Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference.html#setConfig-Send-All-Bids) for more details.

* TOC
{: toc }

## Overview

+ Your developers may optionally add `enableSendAllBids: true` to `pbjs.setConfig()`.  This is not strictly necessary, as `enableSendAllBids` defaults to `true`.  For details, see the [Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference.html#setConfig-Send-All-Bids).

+ From the ad ops side, you may choose to set up one order per bidder, so that each order can have a set of line items using targeting keywords that include the bidder's name.  For example, if you are working with [Rubicon]({{site.baseurl}}/dev-docs/bidders.html#rubicon), you would use `hb_pb_rubicon` in your line item's key-value targeting, and `hb_adid_rubicon` in the creative.

{% include send-all-bids-keyword-targeting.md %}

{: .bg-info :}
In this example we will use DFP setup to illustrate, but the steps are basically the same for any ad server.

## Step 1. Add an order

In DFP, create a new order for one of the header bidding partners. Each header bidding partner should have its own DFP order. Repeat this step and the following when you are adding a new header bidding partner.


## Step 2. Add a line item

In DFP, create a new order with a $0.50 line item.

Enter all of the inventory sizes that your website has.

![Inventory Sizes]({{ site.github.url }}/assets/images/demo-setup/inventory-sizes.png){: .pb-md-img :}

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

This line item will target the bids in the range from $0.50 to $1.00 from the bidder you specify by targeting the keyword `hb_pb_BIDDERCODE` set to `0.50` in the **Key-values** section. For example, if this order and line item is for the bidder AppNexus, the keyword would be `hb_pb_appnexus`. The `BIDDERCODE` for other bidders can be found [here]({{site.baseurl}}/dev-docs/bidders.html).

**You must enter the value to two decimal places, e.g., `1.50`.  If you don't use two decimal places, header bidding will not work.**

![Key-values]({{ site.github.url }}/assets/images/demo-setup/send-all-bids/key-values.png){: .pb-md-img :}

<br>

## Step 3. Add a Creative

Next, add a creative to this $0.50 line item; we will duplicate the creative later.

Choose the same advertiser we've assigned the line item to.

Note that this has to be a **Third party** creative. The **"Serve into a Safeframe"** box can be **UNCHECKED** or **CHECKED** (Prebid universal creative is SafeFrame compatible).

Copy this creative code snippet and paste it into the **Code snippet** box.

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

![New creative]({{ site.github.url }}/assets/images/demo-setup/new-creative.png){: .pb-lg-img :}

Make sure the creative size is set to 1x1.  This allows us to set up size override, which allows this creative to serve on all inventory sizes.

**Prebid universal creative code for other ad servers**

If you're using an ad server other than DFP, your code snippet will look similar to one of the following:

For Mopub:

    <script src = "https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
    <script>
      var ucTagData = {};
      ucTagData.adServerDomain = "";
      ucTagData.pubUrl = "%%KEYWORD:url%%";
      ucTagData.targetingKeywords = "%%KEYWORDS%%";
       try {
        ucTag.renderAd(document, ucTagData);
      } catch (e) {
        console.log(e);
      }
    </script>

For other ad servers:

    <script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
    <script>
      var ucTagData = {};
      ucTagData.adServerDomain = "";
      ucTagData.pubUrl = "%%MACRO:url%%";
      ucTagData.adId = "%%MACRO:hb_adid%%";
      ucTagData.cacheHost = "%%MACRO:hb_cache_host%%";
      ucTagData.cachePath = "%%MACRO:hb_cache_path%%";
      ucTagData.uuid = "%%MACRO:hb_cache_id%%";
      ucTagData.mediaType = "%%MACRO:hb_format%%";
      ucTagData.env = "%%MACRO:hb_env%%";
      ucTagData.size = "%%MACRO:hb_size%%";

      try {
        ucTag.renderAd(document, ucTagData);
      } catch (e) {
        console.log(e);
      }
    </script>

Replace `MACRO` with the appropriate macro for the ad server. (Refer to your ad server's documentation or consult with a representative for specific details regarding the proper macros and how to use them.)

## Step 4. Attach the Creative to the Line Item

Next, let's attach the creative to the $0.50 line item you just created.  Click into the Line Item, then the **Creatives** tab.

There will be yellow box showing each ad spot that you haven't uploaded creatives for yet.  Since you've already made the creatives, click the **use existing creatives** next to each size.

![Use existing creatives list]({{ site.github.url }}/assets/images/demo-setup/use-existing-creatives-01.png)

In the pop-up dialog that appears, click **Show All** to remove the default size filters and see the 1x1 creatives. Include the prebid creative and click **Save**.

![Use existing creatives dialog]({{ site.github.url }}/assets/images/demo-setup/use-existing-creatives-02.png)

Back in the line item, go into the **Creatives** tab again, and click into the creative you just added.

Then, in the creative's **Settings** tab, override all sizes in the **Size overrides** field.

Save the creative and go back to the line item.

<br>

## Step 5. Duplicate Creatives

DFP has a constraint that one creative can be served to at most one ad unit in a page under GPT's single request mode.

Let's say your page has 4 ad units.  We need to have at least 4 creatives attached to the line item in case more than 2 bids are within the $0.50 range.

Therefore, we need to duplicate our Prebid creative 4 times.

Once that's done, we have a fully functioning line item with 4 creatives attached.

<br>

## Step 6. Duplicate Line Items

Now let's duplicate our line item for bids above $0.50.

In the Prebid order page, copy the line item with shared creatives.

This way you only have 4 creatives to maintain, and any updates to those creatives are applied to all pre-bid line items.

For example, we can duplicate 3 more line items:

- $1.00
- $1.50
- $2.00

Let's go into each of them to update some settings.  For each duplicated line item:

1.  Change the name to reflect the price, e.g., "Prebid\_BIDDERCODE\_1.00", "Prebid\_BIDDERCODE\_1.50"

2.  Change the **Rate** to match the new price of the line item.

3.  In **Key-values**, make sure to target `hb_pb_BIDDERCODE` at the new price, e.g., $1.00.  Again, be sure to use 2 decimal places.

4.  (Optional) Set the start time to *Immediate* so you don't have to wait.

Repeat for your other line items until you have the pricing granularity level you want.

## Step 7. Create Orders for your other bidder partners

Once you've created line items for `BIDDERCODE` targeting all the price buckets you want, start creating orders for each of your remaining bidder partners using the steps above.


