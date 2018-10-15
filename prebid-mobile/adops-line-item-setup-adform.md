---
layout: page
title: Setup Line Items for Adform
description: Setup line items for Adform
pid: 2
top_nav_section: prebid-mobile
nav_section: prebid-mobile-adops
---


<div class="bs-docs-section" markdown="1">

# Step by Step Line Item Setup for Adform

* TOC
{:toc }

This page describes step by step how to set up Prebid Mobile line items for Adform to serve ads on app with the Prebid SDK.


## Step 1. Create a Campaign

- Create a client under which you would like to run in-app HB campaign (1)
- Select the longest possible period (2).
- Set goal to **Unlimited** (3).

{: .pb-med-img :}
  ![Adform Campaign Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-adform/adform1.png "Example Adform Campaign Setup")

## Step 2. Create a Line Item

In the General settings Details section:
- Select delivery type: **Non-guaranteed** (1)
- Select status: **Booked** (2)

{: .pb-med-img :}
  ![Adform Line Item Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-adform/adform2.png "Example Adform Line Item")


- Select full period available according to the campaign setup.

{: .pb-med-img :}
  ![Adform Line Item Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-adform/adform3.png "Example Adform Line Item")

In the General settings Pricing & Budget section:
- Select **dCPM** pricing model. It allows taking bid information dynamically each time a request is sent to the ad server together with the winning bid information (4).
- Default price should stay set at zero (5).
- Currency should be the same as the one used in the prebid initiated web auction. Selecting wrong currency could result in discrepancies in the report (6).
- **Net/Gross** value should be selected according to the individual SSP recommendations (7).

{: .pb-med-img :}
  ![Adform Line Item Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-adform/adform4.png "Example Adform Line Item")

In the Inventory section:
Select placements that are implemented on in-app and should run via Prebid Mobile SDK.

In the Targeting section:
In the key-value management section create a key-value pair that will represent each bidder.
For example, key: `hb_bidder`, value: `bidderName1` or `hb_bidder`, value: `bidderName2`

In oder to create a key-value pair, follow these steps:
1. Press **Create Category** (1) and insert name: `hb_bidder` (8)
2. Go into the key folder and create separate values for it: `bidderName2`, `bidderName1` (9).

{: .pb-med-img :}
  ![Adform Line Item Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-adform/adform5.png "Example Adform Line Item")

3. In the line-item targeting Tab, click **Other**, select Key-value pair is (1) from the drop-down menu and enter in the field next to it. Note that key `hb_bidder` will always be the same while values `bidderName1` or `bidderName2` will change according to your setup decisions (2).
4. When you have created a key-value pair that represents a bidder, you have to add it to the line item.

{: .pb-med-img :}
  ![Adform Line Item Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-adform/adform6.png "Example Adform Line Item")

## Step 3. Create a Banner

For in-app Header Bidding we will use a 3rd party banner. Please select the preferred size. For each unique dimension a separate 3rd party banner has to be created.

{: .pb-med-img :}
  ![Adform Create a Banner]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-adform/adform7.png "Example Create a Banner")

- Insert size as a **Name** (1).
- Insert script code that will take dynamically information about the Ad dynamically each time (2):

```
<script type="text/javascript" src = "https://acdn.adnxs.com/mobile/prebid/pbm.js">
</script> <script type="text/javascript">
pbm.showAdFromCacheId({ admCacheID : '%%ADX:hb_cache_id%%' });
</script>
<!-- %%c1 -->
```

- Select what size ads this 3rd party banner will let through (3).
- Enter URL of the website on which HB is being implemented (4). It will be used as a default setting.


</div>
