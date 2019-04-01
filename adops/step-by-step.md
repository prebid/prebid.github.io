---
layout: page_v2
title: Send Top Bid to Adserver
head_title: Getting Started with Prebid.js for Header Bidding
description: An overview of Prebid.js, how it works, basic templates and examples, and more.
sidebarType: 3
---



# Step by step guide to DFP setup

<div id="youtube">
<h2>(Sorry, YouTube videos aren't available with your cookie privacy settings.)</h2>
<p><a class="optanon-show-settings">Cookie Settings</a></p><br/>
</div>

<script type="text/javascript">
Optanon.InsertHtml('<iframe width="853" height="480" src="https://www.youtube.com/embed/-bfI24_hwZ0?rel=0" frameborder="0" allowfullscreen="true"></iframe>', 'youtube', null, {deleteSelectorContent: true}, 3);
</script>

<div class="alert alert-danger" role="alert">
  <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
  <span class="sr-only">Correction:</span>
  Correction: in your Line Item settings, 'Display Creative' should be set to 'One or More', not 'As Many as Possible' as described in the video.
</div>

* TOC
{:toc }

## Step 1. Add a line item

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


![Display and Rotation]({{ site.github.url }}/assets/images/demo-setup/display-and-rotation.png){: .pb-sm-img :}

Choose the inventory that you want to run header bidding on.

By default, `prebid.js` will send the highest bid price to DFP using the keyword `hb_pb`.

This line item will capture the bids in the range from $0.50 to $1 by targeting the keyword `hb_pb` set to `0.50` in the **Key-values** section.

**You must enter the value to two decimal places, e.g., `1.50`.  If you don't use two decimal places, header bidding will not work.**


![Key-values]({{ site.github.url }}/assets/images/demo-setup/key-values.png){: .pb-lg-img :}

<br>

## Step 2. Add a Creative

Next, add a creative to this $0.50 line item; we will duplicate the creative later.

Choose the same advertiser we've assigned the line item to.

Note that this has to be a **Third party** creative. The **"Serve into a Safeframe"** box can be **UNCHECKED** or **CHECKED** (Prebid universal creatve is SafeFrame compatible).

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

{: .alert.alert-warning :}
Note that safeframes don't work with older versions of Prebid.js (v1.23 and before) in combination with recent versions of [Prebid Universal Creative](https://github.com/prebid/prebid-universal-creative).

## Step 3. Attach the Creative to the Line Item

Next, let's attach the creative to the $0.50 line item you just created.  Click into the Line Item, then the **Creatives** tab.

There will be yellow box showing each ad spot that you haven't uploaded creatives for yet.  Since you've already made the creatives, click **use existing creatives** next to each size.

![Use existing creatives list]({{ site.github.url }}/assets/images/demo-setup/use-existing-creatives-01.png){: .pb-lg-img :}

In the pop-up dialog that appears, click **Show All** to remove the default size filters and see the 1x1 creatives. Include the prebid creative and click **Save**.

![Use existing creatives dialog]({{ site.github.url }}/assets/images/demo-setup/use-existing-creatives-02.png){: .pb-lg-img :}

Back in the line item, go into the **Creatives** tab again, and click into the creative you just added.

Then, in the creative's **Settings** tab, override all sizes in the **Size overrides** field.

Save the creative and go back to the line item.

<br>

## Step 4. Duplicate Creatives

DFP has a constraint that one creative can be served to at most one ad unit in a page under GPT's single request mode.

Let's say your page has 4 ad units.  We need to have at least 4 creatives attached to the line item in case more than 2 bids are within the $0.50 range.

Therefore, we need to duplicate our Prebid creative 4 times.

Once that's done, we have a fully functioning line item with 4 creatives attached.

<br>

## Step 5. Duplicate Line Items

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
