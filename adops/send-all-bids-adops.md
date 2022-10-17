---
layout: page_v2
title: Send All Bids to the Ad Server
head_title: Send All Bids to the Ad Server
description: Send all bids to the ad server for reporting and data analysis.
pid: 2
sidebarType: 3
---


# Send all bids to the ad server - Ad Ops setup
{: .no_toc }

This page shows how to set up your ad server so that you can send all bids and report on them.

* TOC
{: toc }

## Overview

As a publisher, you may want to have your ad server see **all** header bidding bids (instead of seeing only the winning bids in each auction).  Reasons you might want this behavior include:

+ You want your ad server to see all header bidding bids so that your ad server can report on bid prices instead of only winning prices.

+ You have a contractual agreement with your header bidding partner.

{: .alert.alert-success :}
See the [Publisher API Reference](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-All-Bids) for more details.


If you decide to send all bids to the ad sever, your developers have the option of explicitly adding `enableSendAllBids: true` to `pbjs.setConfig()`.  However, since the default value is `true` this addition is not strictly necessary.  For details, see the [Publisher API Reference](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-All-Bids).

From the ad ops side, you can choose to set up one order per bidder, which allows for each order to have a set of line items using targeting keywords that include the bidder's name.  For example, if you are working with [Rubicon](/dev-docs/bidders.html#rubicon), you would use `hb_pb_rubicon` in your line item's key-value targeting, and `hb_adid_rubicon` in the creative.

{% include send-all-bids-keyword-targeting.md %}

{: .alert.alert-info :}
Manually configuring GAM for Prebid can be a fair amount of work.
Consider using our official command line tool, [Prebid Line Item Manager](/tools/line-item-manager.html), to create the setup. Using this tool may save you time and help you avoid mistakes.

## Step 1. Add an order

In Google Ad Manager, create a new order for one of the header bidding partners. Each header bidding partner should have its own Google Ad Manager order. Repeat this step and the following when you are adding a new header bidding partner.


## Step 2. Add a line item

In Google Ad Manager, create a new order with a $0.50 line item.

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

## Step 3. Add a Creative

Next, add a creative to this $0.50 line item; we will duplicate the creative later.

- Choose the same advertiser we've assigned the line item to.
- Set it to be a **Third party** creative.
- Make sure the creative size is set to 1x1.  This allows the creative to serve on all inventory sizes. When associating with the line item, just change the creative filter setting to show all creatives instead of 'Inventory filtered based on size'.
- The **"Serve into a Safeframe"** box can be **UNCHECKED** or **CHECKED** (Prebid universal creative is SafeFrame compatible).
- Copy this creative code snippet for each bidder and paste it into the **Code snippet** box, replacing BIDDERCODE with the current bidder name.

```
    <script src = "https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
    <script>
      var ucTagData = {};
      ucTagData.adServerDomain = "";
      ucTagData.pubUrl = "%%PATTERN:url%%";
      ucTagData.adId = "%%PATTERN:hb_adid_BIDDERCODE%%";
      ucTagData.cacheHost = "%%PATTERN:hb_cache_host_BIDDERCODE%%";
      ucTagData.cachePath = "%%PATTERN:hb_cache_path_BIDDERCODE%%";
      ucTagData.uuid = "%%PATTERN:hb_cache_id_BIDDERCODE%%";
      ucTagData.mediaType = "%%PATTERN:hb_format_BIDDERCODE%%";
      ucTagData.env = "%%PATTERN:hb_env%%";
      ucTagData.size = "%%PATTERN:hb_size_BIDDERCODE%%";
      ucTagData.hbPb = "%%PATTERN:hb_pb_BIDDERCODE%%";
      // mobileResize needed for mobile GAM only
      ucTagData.mobileResize = "hb_size:%%PATTERN:hb_size_BIDDERCODE%%";
      try {
        ucTag.renderAd(document, ucTagData);
      } catch (e) {
        console.log(e);
      }
    </script>
```

{: .alert.alert-info :}
- Replace the *BIDDERCODE* placeholders in the above template with the appropriate bidder your line item is targeting.  For example, if you're targeting the bidder *appnexus*, the macro variable for `adId` would look like `ucTagData.adId = "%%PATTERN:hb_adid_appnexus%%";`. IMPORTANT: Make sure that none of the values are longer than 20 characters. e.g. you'll need to truncate hb_cache_host_triplelift to hb_cache_host_triple. GAM doesn't support attributes longer than 20 chars, so all Prebid software truncates attributes to that length.
- The attribute name of `mobileResize` isn't important, just the value. The Prebid SDK scans this code explicitly for "hb_size".


![New creative]({{ site.github.url }}/assets/images/demo-setup/new-creative.png){: .pb-lg-img :}

**Prebid universal creative code for other ad servers**

If you're using an ad server other than Google Ad Manager, your code snippet will look similar to one of the following:

For Mopub:

    <script src = "https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
    <script>
      var ucTagData = {};
      ucTagData.adServerDomain = "";
      ucTagData.pubUrl = "%%KEYWORD:url%%";
      ucTagData.adId = "%%KEYWORD:hb_adid_BIDDERCODE%%";
      ucTagData.cacheHost = "%%KEYWORD:hb_cache_host_BIDDERCODE%%";
      ucTagData.cachePath = "%%KEYWORD:hb_cache_path_BIDDERCODE%%";
      ucTagData.uuid = "%%KEYWORD:hb_cache_id_BIDDERCODE%%";
      ucTagData.mediaType = "%%KEYWORD:hb_format_BIDDERCODE%%";
      ucTagData.env = "%%KEYWORD:hb_env%%";
      ucTagData.size = "%%KEYWORD:hb_size_BIDDERCODE%%";
      ucTagData.hbPb = "%%KEYWORD:hb_pb_BIDDERCODE%%";
       try {
        ucTag.renderAd(document, ucTagData);
      } catch (e) {
        console.log(e);
      }
    </script>

{% capture noteAlert %}
See note above in regards to replacing *BIDDERCODE* placeholders.
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

{% include adops/adops-creative-declaration.html %}

For other ad servers:

    <script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
    <script>
      var ucTagData = {};
      ucTagData.adServerDomain = "";
      ucTagData.pubUrl = "%%MACRO:url%%";
      ucTagData.adId = "%%MACRO:hb_adid_BIDDERCODE%%";
      ucTagData.cacheHost = "%%MACRO:hb_cache_host_BIDDERCODE%%";
      ucTagData.cachePath = "%%MACRO:hb_cache_path_BIDDERCODE%%";
      ucTagData.uuid = "%%MACRO:hb_cache_id_BIDDERCODE%%";
      ucTagData.mediaType = "%%MACRO:hb_format_BIDDERCODE%%";
      ucTagData.env = "%%MACRO:hb_env%%";
      ucTagData.size = "%%MACRO:hb_size_BIDDERCODE%%";
      ucTagData.hbPb = "%%MACRO:hb_pb_BIDDERCODE%%";
      try {
        ucTag.renderAd(document, ucTagData);
      } catch (e) {
        console.log(e);
      }
    </script>

Replace `MACRO` with the appropriate macro for the ad server. (Refer to your ad server's documentation or consult with a representative for specific details regarding the proper macros and how to use them.)

{% capture noteAlert %}
See note above in regards to replacing *BIDDERCODE* placeholders.
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

## Step 4. Attach the Creative to the Line Item

Next, let's attach the creative to the $0.50 line item you just created.  Click into the Line Item, then the **Creatives** tab.

There will be yellow box showing each ad spot that you haven't uploaded creatives for yet.  Since you've already made the creatives, click the **use existing creatives** next to each size.

![Use existing creatives list]({{ site.github.url }}/assets/images/demo-setup/use-existing-creatives-01.png)

In the pop-up dialog that appears, click **Show All** to remove the default size filters and see the 1x1 creatives. Include the prebid creative and click **Save**.

![Use existing creatives dialog]({{ site.github.url }}/assets/images/demo-setup/use-existing-creatives-02.png)

Back in the line item, go into the **Creatives** tab again, and click into the creative you just added.

Then, in the creative's **Settings** tab, enable the **Size overrides** field and set all your line item's potential sizes.

Save the creative and go back to the line item.

## Step 5. Duplicate Creatives

Google Ad Manager has a constraint that one creative can be served to at most one ad unit in a page under GPT's single request mode.

Let's say your page has 4 ad slots.  We need to have at least 4 creatives attached to the line item in case more than 2 bids are within the $0.50 range.

Therefore, we need to duplicate our Prebid creative 4 times.

Once that's done, we have a fully functioning line item with 4 creatives attached that can potentially fill 4 ad slots of varying sizes during a single pageview.

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
