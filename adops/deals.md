---
layout: page_v2
title: Enable Deals
head_title: Enable Deals in Prebid for Header Bidding
description: Enable Deals in Prebid for Header Bidding Analysis.
pid: 4

sidebarType: 3
---

# Enable Deals in Prebid
{:.no_toc}

In order to enable deals for prebid, the ad ops setup is slightly different from the standard header bidding setup. Specifically:

+ From the ad ops side, you'll create separate orders and line items that target the deal ID key-values. These line items will be at different (probably higher) priorities than your standard header bidding line items.

+ From the dev side, if your page is using the standard prebid.js key-values, no change or work is required.

{: .bg-info :}
In this example we will use the Google Ad Manager setup to illustrate, but the steps are basically the same for any ad server.

* TOC
{:toc}

### Step 1: Understand Key-values

Whenever a bidder responds with a bid containing a deal ID, Prebid.js will generate and attach deal-related key-values to the ad server call in the format: `hb_deal_BIDDERCODE = DEAL_ID`.

For example, given the submitted bids, prices, and deals shown here:

```
bid 1: Bidder = Rubicon,  CPM = 1.50, Deal ID = RBC_123
bid 2: Bidder = AppNexus, CPM = 1.20, Deal ID = APN_456
```

The key-values attached to the ad server call (that the line items will target) will be:

```
hb_pb_rubicon    = 1.50
hb_deal_rubicon  = RBC_123
hb_pb_appnexus   = 1.20
hb_deal_appnexus = APN_456
// hb_adid, hb_size, and hb_adid omitted
```

{% capture noteAlert %}
We recommend confirming with your development team that the page is set up to send all deal targeting to the ad server. There are two ways to do this:  
- Set the `enableSendAllBids` to **true**.  
- Set `enableSendAllBids` to **false** and `alwaysIncludeDeals` to **true**. This option will minimize the number of targeting variables sent to the ad server.  
See the [enableSendAllBids](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-All-Bids) documentation for details.
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

<br>

### Step 2: Create Key-values

For each header bidding partner you work with, create a keyword in the format of `hb_deal_BIDDERCODE`, e.g., `hb_deal_pubmatic`. For more examples of the keyword format, see the [API Reference for `pbjs.getAdserverTargeting`](/dev-docs/publisher-api-reference/getAdserverTargeting.html).

<br>

![Inventory Sizes]({{ site.github.url }}/assets/images/demo-setup/deals/key-val.png){: .pb-lg-img :}

<br>

### Step 3: Create Line Items for Deals

In Google Ad Manager, create a new line item.

Enter all the **Inventory sizes** for your deal (or deals):

![Inventory Sizes]({{ site.github.url }}/assets/images/demo-setup/inventory-sizes.png){: .pb-md-img :}

<br />

Set the **priority** to the level you prefer.

![Inventory Sizes]({{ site.github.url }}/assets/images/demo-setup/deals/deal-priority.png){: .pb-lg-img :}

<br>

Set **Display Creatives** to *One or More* since we'll have one or more creatives attached to this line item.

Set **Rotate Creatives** to *Evenly*.

![Display and Rotation]({{ site.github.url }}/assets/images/demo-setup/display-and-rotation.png){: .pb-md-img :}

<br>

Then you'll need to target the **inventory** that you want to this deal to run on.

<br>

**Use Key-values targeting to target deal ID(s)**

There are two ways to target deal IDs using *Key-values* targeting:

1. If you would like the deals to have the same priority and target the same inventory, you can include multiple deal IDs (as shown below).
2. Otherwise, you must create a separate line item for each deal ID you want to target.

![Inventory Sizes]({{ site.github.url }}/assets/images/demo-setup/deals/targeting.png){: .pb-lg-img :}

<br>

### Step 4: Attach Creatives to Line Items

Like all line items, those that represent deals need to be associated with creatives that pass the correct adid back to Prebid.js for display.

e.g. if the line item is targeted to `hb_deal_pubmatic`, then the creative needs to send `hb_adid_pubmatic` in the creative. Like this:

    <script src = "https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
    <script>
      var ucTagData = {};
      ucTagData.adServerDomain = "";
      ucTagData.pubUrl = "%%PATTERN:url%%";
      ucTagData.env = "%%PATTERN:hb_env%%";
      ucTagData.adId = "%%PATTERN:hb_adid_pubmatic%%";
      ucTagData.cacheHost = "%%PATTERN:hb_cache_host_pubmatic%%";
      ucTagData.cachePath = "%%PATTERN:hb_cache_path_pubmatic%%";
      ucTagData.uuid = "%%PATTERN:hb_cache_id_pubmatic%%";
      ucTagData.mediaType = "%%PATTERN:hb_format_pubmatic%%";
      ucTagData.size = "%%PATTERN:hb_size_pubmatic%%";
      ucTagData.hbPb = "%%PATTERN:hb_pb_pubmatic%%";

      try {
        ucTag.renderAd(document, ucTagData);
      } catch (e) {
        console.log(e);
      }
    </script>

If however, the line item is targeted to `hb_deal` (without a bidder code),
then the simplified creative setup in the [step-by-step instructions](/adops/step-by-step.html#step-2-add-a-creative) will be fine.
