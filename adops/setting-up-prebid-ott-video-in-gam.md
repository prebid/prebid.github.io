---
layout: page_v2
title: Setting up OTT Video in Google Ad Manager for Prebid
head_title: Setting up OTT Video in Google Ad Manager for Prebid
description: Setting up OTT Video in Google Ad Manager for Prebid
sidebarType: 3
---

# Setting up OTT Video in Google Ad Manager for Prebid

POP delivers programmatic advertising to video publisher’s OTT inventory. Utilizing the open source Prebid header bidding technology, `POP` provides fill optimization and enables competitive separation within ad pods.

{% include alerts/alert_note.html content="Competitive separation is the process of preventing ads from the same industry group from appearing either in the same ad pod or adjacent to each other in the same ad pod." %}

## Configuring Google Ad Manager

Configuring Google Ad Manager (GAM) for `POP` delivery follows the same Prebid configuration process for video with the additional requirements of adding a custom keyword for targeting and including the VAST URL for the video redirect.  

The process for bidding on long-form video with `POP` requires a GAM account with a `Network` that contains at least one `Advertiser`. If you do not have a GAM account, visit [Google](https://ads.google.com/home/tools/manager-accounts/). If a GAM account exists or has been created, log in.  
1. Log into your GAM account.  
2. Ensure a `Network` is set up. (For information on setting up a `Network` review this [Google support document.](https://support.google.com/admanager/answer/6013048?hl=en))  
3. Within the `Network`, select or add an `Advertiser`. The Ad Manager 360 screen will load.

## Orders
From the left navigation, under `Delivery`,  select `Orders`.
The `Orders` summary page will load.

![Google Ad Manager Orders Summary]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_orders.png){: .pb-lg-img :}


This page will display any existing `Orders`. An `Order` is required to start an advertising campaign.

To create a new `Order`, click the `New Order` button. The `New Order` screen will load.

![Google Ad Manager New Orders]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_new_orders.png){: .pb-lg-img :}

Enter the following information:  

**Name**: An identifier for this ad campaign.
**Advertiser**: The `Advertiser` of the campaign.
**Trafficker**: The person responsible for uploading `Creatives` and for 			tracking the performance of the campaign.  
**Labels** (optional): Industry identifiers that enable `POP` to prevent ads in the same industry group from appearing either within or adjacent to each other in the ad pod. `Labels` entered in the `Order` section are available to all of its related `Line Items`.

{% include alerts/alert_warning.html content="At this time POP only recognizes `Labels` entered in the `Line Item` section of GAM but not the `Order` section. POP will only read one label per `Line Item`, even though GAM accepts multiple entries. To target multiple `Labels` create additional `Line Items`, each targeting a specific label." %}
**Teams** (optional): Groups of users that share access to the same advertisers, agencies, orders and line items.

You can view additional optional entries by clicking on the `Optional` order fields toggle. Additional `Advertiser` and agency contact information can be entered in these fields. Refer to the GAM documentation for details on these entries.

## Line items

Once the `Order` information has been added scroll down to the `Line Item` entry form.  The `Line Item` data controls when an ad will display and for how long, at the CPM or other pricing model,  the size of the `Creative`, etc. The `Line Item` is separated into five sections; `Initial information`, `Creative forecasting defaults`, `Settings`, `Adjust delivery`, and `Add targeting`.  

### Initial information  

This section provides initial settings for a `Line Item`. Enter the following information:  

**Name**: An identifier for the `Line Item`.  

**Inventory sizes**: For `POP`, select `Video VAST`. Selecting this option will display the `Master` input section. This section is where the size of the `Creative`, accompanying creatives and additional targeting can be added. To enter the size of the `Creative`, click in the first text field (with the movie clip icon), a drop down menu will display with options for standard video sizes along with the option to enter a custom video size.  

Information on the `Creative` targeting option can be found reviewed at [Google support:](https://support.google.com/admanager/answer/6222493?hl=en).

![Google Ad Manager Video Size]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_lineitem_video_size.png){: .pb-lg-img :}

**Labels** (optional): Industry identifiers that enable `POP` to prevent ads in the same industry group from appearing either within or adjacent to each other in the ad pod. `Labels` entered in a Line Item are only applied to that `Line Item`.   

**Comments & Custom fields** (optional): These entries are provided to assist in reporting on the campaign. They have no affect on ad serving or delivery.

### Creative forecasting defaults

This section is only available when the `Video Vast` option of the `Inventory sizes` setting is selected. It allows you to enter the `Max duration` of the video creative.  This value is used for forecasting purposes and will not affect delivery.  

![Google Ad Manager Creative Forecasting]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_lineorder_creatingforecast.png){: .pb-lg-img :}

### Settings

In the `Settings` section you can enter information regarding the campaign, including start and end times, the desired rate, currency and revenue type. Please refer to [Google Ad Manager documentation](https://support.google.com/admanager/answer/82236?hl=en&ref_topic=7506394) for specific information regarding the settings for these fields.

**Quantity**: The number of impressions, clicks or viewable impressions.  

**Rate**: The amount for either CPM or CPA (currency can be changed to dollars, euros, GBP, or Australian dollars).  

**Discount**: The amount the `Line Item` cost will be reduced. This value is only for reference and is not reflected in revenue reporting nor does it affect a `Line Item’s` priority.

![Google Ad Manager Line Item Settings]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_lineitem_settings.png){: .pb-lg-img :}

### Adjust delivery

This section provides delivery and display options for the Creatives. Review the [Google Ad Manager documentation](https://support.google.com/admanager/answer/82236?hl=en&ref_topic=7506394) for specific details on these settings.

**Deliver impressions**: Determines how the impressions will be delivered. Options are *Evenly*, *Frontloaded*, and *As fast as possible*.  

**Display companions**: Determines whether the creative will be delivered based on the delivery of companion creatives. Available options are *Optional*, *At least one*, and *All*.

**Rotate creative sets**: How the creative sets will rotate the display of individual `Creatives`. Available options are: *Evenly*, *Optimized*, *Weighted* and *Sequential*.  

**Day and time**: The days of the week and times of the day the `Line Item` can be delivered.

**Frequency**: Limits how often the `Line Item` can be delivered to one viewer.  

![Google Ad Manager Line Item Adjust Delivery]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_lineitem_adjust.png){: .pb-lg-img :}

### Add targeting

The targeting sections enable you to set values to focus the targeting of your ad space to certain types of ads or audiences. This document outlines targeting of long-form video, for targeting of other `Creatives` review the [Google Ad Manager documentation](https://support.google.com/admanager/answer/82236?hl=en&ref_topic=7506394).  

**Video position**: This setting enables the placement of the `Creative` within the video. For example: pre-roll for the beginning of a video or post-roll for the end.

**Inventory**: Select which inventory to include.  

**Key-values and Audience**: Enables the selection of an audience segment and age to target for the ad unit. Also allows for the inclusion of custom keywords.

> For `POP` the custom `keyword hb_pb_cat_dur` is required. The value of this key can be visualized as `hb_pb_cat_dur = RATE_LABEL_DURATION` where: 
  **RATE**: The currency amount entered in the `Rate` field of the 	`Settings` section.
	**LABEL**: The value of the label field in the `Line Item`.  
  **DURATION**: The length of the video in seconds.

{% include alerts/alert_tip.html content="For a `Line Item` with a $10.00 CPM entered in the `Rate` field, News entered in the `Label` field and 30s entered in the `Duration` field, you would enter the following in the `Custom key-value` field: `hb_pb_cat_dur = 10.00_news_30s`" %}

**Geography**: The geographic location where the `Creative` will display.  

**Devices**:  Settings for targeting browser, browser language, device, and operating system.  

**Connection**: Settings for targeting bandwidth, mobile carriers and domains.

![Google Ad Manager Line Item Targeting]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_lineitem_addtargeting.png){: .pb-lg-img :}

## Creatives

`Line Items` that have an `Inventory sizes` selection of `Standard` or `Master/Roadblock` have `Creatives` attached directly to them, those with `Video VAST` selections do not have `Creatives`. Instead they have `Creative Sets` associated with them. Each `Creative Set` contains a URL that points to the cached `VAST XML`. (This is because most video players can only work with a URL that returns `VAST XML`.)

{% include alerts/alert_important.html content="Some bidders cache the `VAST XML` on the server side while others rely on Prebid.js  to perform the caching" %}

### Making a Creative Set

To make a `Creative Set` click on the `Creative link` in the left navigation.  This will display the `Creatives` section of Google Ad Manager with a default view of `All creatives`. Click the `Creative sets` link along the top navigation.  

This will display the `Creative Sets` listing. If there were previously created `Creative Sets` they can be viewed and opened from here.

![Google Ad Manager Creatives]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_creatives_top_nav.png){: .pb-lg-img :}

Click the `New Creative Set` button. A popover will display. In the `Advertiser` field enter the name of the `Advertiser` this set is being created for. Select `Video VAST` and enter or select a video size in the input field with the movie clip icon. Click the ` Continue` button.

A `Creative set` entry form will display. Enter a name for the set in the `Creative set` name field. Click the `Redirect` link in the `Select a creative set` type section. 

![Google Ad Manager Creative Sets]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_creatives_new_set.png){: .pb-lg-img :}

The page will now display the `Redirect` form. Enter a name for the `Redirect` in the `Name` field. In the `VAST tag URL` field enter the cache location. For example:  

`https://prebid.adnxs.com/pbc/v1/cache?uuid=50.00_news_30s_%%PATTERN:hb_cache_id%%`

![Google Ad Manager Creative Sets Redirect]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_creatives_set_redirect.png){: .pb-lg-img :}

Enter a time in seconds in the `Duration` field. This should match the duration entered in the value for the custom keyword `hb_pb_cat_dur` created earlier. There is no need to enter `Label` information, the label entered in the `Line Item` will be used. For the remainder of the entries refer to the [Google Ad Manager documentation](https://support.google.com/admanager/answer/1171783).

Save the settings by clicking the `Save` button.

## Attaching a Creative to a Line Item

Once the `Creative Set` is saved the `Creative Set Preview` will display.

![Google Ad Manager Creative Sets Redirect]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_creative_set_addlineitem_select.png){: .pb-lg-img :}

Click the `Attach Line Item` button. This will display the `Add line items` popover.
Click on the `Line Items` option. `Line Items` that match the `Creative Set` size and type will be listed. Select the `Line Items` to attach to this `Creative Set`. When finished, click the `Include` button. The selected `Line Items` will now appear in the `Selected Items` list. Click the `Save` button to complete the process.  

The `Line Item` is now prepared for bidding on publisher’s inventory.

![Google Ad Manager Creative Sets Redirect]({{site.baseurl}}/assets/images/ad-ops/gam_pop/gam_creative_set_lineitem.png){: .pb-lg-img :}


## Further Reading
[GAM Video Solutions advertising overview](https://support.google.com/admanager/answer/1711021?hl=en)  
[Traffic in-stream video redirects](
https://support.google.com/dcm/answer/6286181?hl=en)  
[Media Planner for in-stream video creatives. A best practice guide:](https://support.google.com/dcm/answer/4348108)  
Setting up Prebid video in GAM
