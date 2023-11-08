---
layout: page_v2
title: Setting up Prebid with the Microsoft Monetize Ad Server
head_title: Setting up Prebid with the Microsoft Monetize Ad Server
description: Setting up Prebid with the Microsoft Monetize Ad Server
pid: 3

top_nav_section: adops
nav_section: tutorials
sidebarType: 3
---

# Setting up Prebid with the Microsoft Monetize Ad Server

{: .no_toc}

This page describes how to set up the Microsoft Monetize Ad Server to work with Prebid.js from an Ad Ops perspective.

In some cases there are links to the [Microsoft Help Center](https://docs.xandr.com/).

Once the Ad Ops setup is complete, developers will need to add code to the page as shown in the example [Using Prebid.js with Microsoft Monetize as your Ad Server]({{site.github.url}}/dev-docs/examples/use-prebid-with-appnexus-ad-server.html).

{: .alert.alert-success :}
**Microsoft Monetize Ad Server Features**  
Note that the functionality described on this page uses some features that are only available in the Microsoft Monetize Ad Server product.  For more information, contact your Microsoft Monetize representative.

{: .alert.alert-info :}
**Object Limits**
Note that using Prebid with Microsoft Monetize as your Ad Server may cause you to
hit your [Object Limits](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/viewing-your-object-limits.html).

* TOC
{:toc}

## Step 1. Add Key-Values

In the [key-value targeting](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/key-value-targeting.html) in Monetize, set up the keys and values shown below.  Keep in mind that all of the keys described below should use string values (**not** numeric).

If you are only sending the winning bid to the ad server, set up your keys like so:

{: .table .table-bordered .table-striped }
| Key         | Value (string) |
|-------------+----------------|
| `hb_pb`     | `0.1`          |
| `hb_bidder` | `"rubicon"`   |

Otherwise, if you are [sending all bids to the ad server](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-All-Bids), you'll have to create a key for each bidder (e.g., `hb_pb_rubicon`, `hb_pb_partner1`, `hb_pb_partner2`, etc.), and all of the price bucket values for that key.

{: .table .table-bordered .table-striped }
| Key              | Value (string) |
|------------------+----------------|
| `hb_pb_rubicon` | `0.1`          |

Depending on the price granularity you want, you may find one of the following CSV files helpful.  Each file has the buckets for that granularity level predefined.  You can avoid manually setting up key-value targeting by uploading the appropriate CSV file on the [key-values screen](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/key-value-targeting.html):

* [10cent-prebid-buckets.csv]({{site.github.url}}/assets/csv/10cent-prebid-buckets.csv)
* [25cent-prebid-buckets.csv]({{site.github.url}}/assets/csv/25cent-prebid-buckets.csv)
* [dense-prebid-buckets.csv]({{site.github.url}}/assets/csv/dense-prebid-buckets.csv)

For more information about how to set up price bucket granularity in Prebid.js code, see the API documentation for [`pbjs.setPriceGranularity`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity).

{: .alert.alert-success :}
You can only report on price bucket values if you provide them in the <a href="https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/key-value-targeting.html">Key-Value Targeting UI</a>.

## Step 2. Add Advertiser

Depending on whether you are sending all bids or sending top bid you will need to create an Advertiser per bidder e.g. *Rubicon - Prebid Advertiser* vs *Prebid Advertiser*

Follow the advertiser setup instructions in [Create an Advertiser](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/create-an-advertiser.html)

## Step 3. Add Creatives

You'll need one creative per ad size you'd like to serve.  You can re-use a creative across any number of line items, as long as the creative belongs to the same advertiser as the line item.

Follow the banner creative setup instructions in [Add Creatives](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/add-a-creative.html), navigating the the Creative Manager and selecting the appropriate advertiser from the previous step, with the following setting:

* Paste the below universal creative code as the creative asset tag code.
* Name the creative e.g. *Rubicon - Prebid Creative 300x250*.
* Select the creative size e.g. *300x250*.
* Self-Audit the creative and confirm compliance.

```html
<script src = "https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/#{HB_FORMAT}.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = window.location.host;
  ucTagData.pubUrl = "${REFERER_URL_ENC}";
  ucTagData.adId = "#{HB_ADID}";
  ucTagData.cacheHost = "";
  ucTagData.cachePath = "";
  ucTagData.uuid = "";
  ucTagData.mediaType = "#{HB_FORMAT}";
  ucTagData.env = "";
  ucTagData.size = "#{HB_SIZE}";
  ucTagData.hbPb = "#{HB_PB}";
  try {
    ucTag.renderAd(document, ucTagData);
  } catch (e) {
    console.log(e);
  }
</script>
```

{: .alert.alert-warning :}
**Creative Expiration**
Note that creatives are automatically marked as inactive by the Microsoft Monetize systems after 45 days of inactivity.  This may happen to Prebid creatives since they are loaded relatively infrequently compared to other use cases.  For help with mitigating this issue, please contact your Microsoft Monetize representative.

{: .alert.alert-warning :}
**SafeFrame**
If you want your creative to serve into a SafeFrame, this will need to be enabled on the site-side of the Prebid.js implementation rather than as a setting in the ad server.  A developer can learn how to enable this setting for the publisher by referencing [Using Prebid.js with Microsoft Monetize Ad Server]({{site.github.url}}/dev-docs/examples/use-prebid-with-appnexus-ad-server.html).  Additionally if the Microsoft Monetize Ad Server tags are configured to use SafeFrames, you **will** need to use the above creative template to properly render the creative.  Earlier versions of the Prebid.js creative template may not be fully SafeFrame compliant (if they are still in-use from older setups), so it is recommended to switch to the above template in this scenario.

## Step 4. Set up Insertion Order

You'll need to create an insertion order, belonging to your advertiser, for your line items.

Follow the insertion order setup setup instructions in [Create a Seamless Insertion Order (IO)](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/create-an-insertion-order.html), with the following settings:

* Choose a flexible budget type.
* Set no end date.

## Step 5. Set up Line Items

You'll need to create one line item for every price bucket you intend to serve. These line items will need to be under the advertiser and insertion order in step 2 and 4.

For example, if you want to have $0.10 price granularity, you'll need 201 line items, one for each of your key-value targeting settings from Step 1.

For each line item, follow the line item setup setup instructions in [Create an Augmented Line Item (ALI)](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/create-an-augmented-line-item-ali.html), with the following settings:

* Set the **Name** e.g., *€00.01 - Rubicon - Prebid Banner*.

* Set **Ad Type** Banner.

* Set the **Revenue Type** to *CPM*.

* Set the **Revenue Value** to one of the price bucket key-values from Step 1, e.g., *0.01*.

* Set the **Budget Setup** to *Unlimited Budget*.

* Set the **End Date** sometime in the future e.g. *6/26/2033*.

* Within **Inventory & Brand Safety Targeting** and for **Supply Source** select *Managed Inventory*.

* Set the **Line Item Priority** for more information on line item priority see [Bidding Priority](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/bidding-priority.html)

* Optional: Still in the targeting settings, target the custom category `prebid_enabled`. This will allow you to turn targeting on and off for a placement (or an entire placement group) by adding it to the custom category, which you'll do in one of the later steps.  This is useful for troubleshooting.  For more information about targeting custom content categories, see [Content Category Targeting](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/content-category-targeting.html).

* In your line item's targeting settings, set the **Key/Value Targeting** to matche the line item's price bucket/revenue value.

* Under **Creatives**, associate as many creative sizes with the line item as you need.  Set the **Creative Rotation** to *Evenly weight creatives*.

* Scroll back up to **Budgeting & Scheduling** and select *No daily budget* within **Pacing** (this can only be selected when managed invenotry is targeted).

## Step 6. Add the `prebid_enabled` Custom Category to Placements (Optional)

If while setting up line items, you set custom category targety to `prebid_enabled`, make sure the placements you're using for Prebid are added to the custom category `prebid_enabled`.

This will make sure these placements are targeted by the line items you just set up.

It will also make it easy to turn the targeting on and off for a given placement (or placement group) by adding or removing it from the custom category.  This can be useful when troubleshooting.

## Related Topics

* [Ad Ops and Prebid](/adops/before-you-start.html)
* [Ad Ops Planning Guide](/adops/adops-planning-guide.html)
* [Getting Started with Prebid.js for Developers](/dev-docs/getting-started.html)
* [Using Prebid.js with Microsoft Monetize Ad Server](/dev-docs/examples/use-prebid-with-appnexus-ad-server.html)(Developer example)
[EOF]