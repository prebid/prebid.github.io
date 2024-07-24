---
layout: page_v2
title: Setting up Prebid Video in FreeWheel
head_title: Setting up Prebid Video in FreeWheel
description: Setting up Prebid Video in FreeWheel
sidebarType: 3
---

# FreeWheel Guide for Premium Long-Form Video

{: .alert.alert-warning :}
This guide is not written, maintained, or endorsed by Freewheel. Freewheel recommends speaking to your account team before implementing any header-bidding setup to ensure full implications for direct-sold ad delivery, forecasting, and reporting is understood.

{: .alert.alert-warning :}
The approach described here could create too many line items in the ad server
if the price buckets are too granular. We recommend that you consider how many
line items can be supported and plan out the price granularity/category/duration combinations.

This page describes how to set up Campaigns for long form video using FreeWheel's ad server.

As with Google Ad Manager for digital ads, ad ops will need to configure their FreeWheel server account so that the server can provide the correct creatives for the video player. If you do not have an account visit [FreeWheel](https://www.freewheel.com/) to create one.  

Once your account is set up log in to the FreeWheel site. You will be presented with a dashboard area. Click on either the Advertising button in the top navigation bar or the Campaign link in the main body.

## Campaigns

This will display the Campaign & IO screen. If you have not established any campaigns yet click the Add New Campaign link.

This will present the Add New Campaign screen.

- Enter a name for the campaign  
- Add an external identifier (optional)  
- Select an Advertiser and Agency from the drop down menus.
- Click the Create and Continue Editing button when finished.  

You will be returned to the Campaign & IO screen and your new campaign should appear in the Campaign & IOs table. To begin your campaign you will need to create some insertion orders.

Click on the campaign name, which appears in the Campaign column. This will present the Insertion Orders screen.

## Insertion Orders

Click on the Add New IO link. This will present a pop over for adding a new Insertion Order.

Return to the Campaign & IOs screen and check the box in the first column of the row containing your I&O. Click the Load Placements button. This will reload the screen with the details of the Insertion Order you selected and the Placements for that Insertion Order.

## Placements

If there are no Placements or you want to add a new one click on the Add New Placement link. You will be presented with a pop over where you can enter a name and description for the Placement. For Prebid to interact with FreeWheel’s ad server there is a strict Placement naming convention.

The FreeWheel module within Prebid sends key-value targeting pairs to the FreeWheel SDK, which then forwards them to the FreeWheel server. The FreeWheel server uses those targeting key-value pairs to select the correct creatives to return to Prebid. The key-value pairs are written as:

```text
'hb_pb_cat_dur': ’12.00_399_30s'
```

The value is a concatenation of the CPM (12.00), the FreeWheel industry code (399) and the ad length in seconds (30s). The name of the Placement must be written in the same format:  

```text
12.00_399_30s
```

Once you have created a Placement it will appear in the first row of the Placement table.

In the last column of each row is a magnifying glass icon. Clicking on that will present detailed information about the Placement. In this detailed section information such as Delivery and Forecast, Schedule and Budget, Custom Targets, Exclusivity and Industry can be set for the Placement. The topics relevant to Prebid are covered in this section, for detailed information about all settings, visit FreeWheel.com.

### Schedule and Budget

The Schedule and Budget section enables an ad ops to schedule when the Placement will run, the price bucket and the budget type.

Following the naming convention for Placements, 12.00_399_30s, the first item in the name represents the CPM (12.00). Ensure that the Placement Price matches the CPM. From our example, this should be $12.00. To edit, click on the Price link.

The Schedule and Budget values should be set per your campaign requirements.  

### Delivery and Forecast

The Delivery and Forecast section determines how frequently a Placement will appear within a Campaign. The default setting is Use Network Default. To change this setting click on the Delivery link. A pop over will display. Select one of the options for Override Repeat Mode:

- Use Network Default Setting  
- Allow To Repeat in Each Commercial Break  
- Do Not Allow to Repeat

### Exclusivity

Exclusivity is the process of preventing ads from the same industry group from appearing either in the same ad pod or adjacent to each other in the same ad pod.

Scroll to the Exclusivity section. Ensure that the Level of Exclusivity and Scope of Exclusivity is at the desired setting for this Placement. Also ensure that the industry displayed matches the industry identifier for this Placement. (399 portion of the 12:00_399_30s value).  If not, click on the Exclusivity title. A pop over will display enabling you to change the Exclusivity parameters.

The Level of Exclusivity determines the range of ads that fall within the competitive separation rules. There are three options, available from the pop up at the top of the pop over. They are:

- None: As it implies, none means there is no exclusivity.  
- Full: No other industry ads will appear within the ad pod.  
- Custom: There is a custom exclusivity set up.

Checking the box next to the industry name and clicking the Exclude button will add that industry to the list of industries excluded from appearing with this Placement. It is recommended that you exclude an industry if the Placement intends on delivering ads from that industry.
The Scope of Exclusivity determines on what ad types the competitive separation will occur. There are three choices:

- All Ad Units: Exclusivity is applied to any ad.  
- Targeted Ads: Exclusivity is only applied to targeted ads.
- Adjacent Ads: Exclusivity is only applied to ads appearing adjacent to this creative. .

### Custom Targeting  

The Custom Targeting section is where a custom target will be set to match the key-value pair being passed into the FreeWheel server from Prebid. Ensure that the key name matches the Prebid FreeWheel key, hb_pb_cat_dur and the value matches the naming convention discussed above, containing CPM, industry identifier and duration, 12.00_399_30s. If not, click on the Custom Targeting title. A pop over will display enabling you to edit the key and value.

### Industry  

The Industry section enables publishers to set the Industry Group associated with the Placement. Ensure that the Industry Group matches the FreeWheel industry identifier. If not, click on the Industry title, a pop over will display that will enable you to change the Industry Group. For each Placement there can only be one Industry Group.

The Industry Group must match the Industry Group Identifier that is contained in the passed in key-value targeting pair. In our example case, that Industry Group Identifier is 399 (12.00_399_30s).

## Creatives

Return to the Campaign & IO screen by clicking the Campaign button. Click the Creative button to the right of the Campaign button. This will display the Creative Library.

Publishers must create one Creative for each ad duration they wish to support. For example, if a publisher will support 15s, 30s, and 60s durations, they will need three Creatives, regardless of how many Placements they have at that duration.  If there are one hundred Placements with 30s durations, only one Creative targeting 30s duration is needed.

If there are no creatives in the library click the Add New Creative button. A pop over will display enabling you to add a new creative.  

The new Creative will appear in the Creative Library. Click on the Creative name, a new screen will be displayed with information about that Creative.  

### Duration

Duration determines the length of the Creative. This value must match the duration portion of the key-value target passed into FreeWheel server. The 30s portion of our example (12:00_399_30s). If not, click on the Duration link. A pop over will display enabling you to enter the correct duration for this Creative.

For each Placement duration you should have one Creative that matches. For example, if you had Placements with targeting values of 12:00_399_15s, 12:00_399_30s, and 12:00_399_45s, you should have three Creatives, one with a 15 second duration, another with a 30 second duration and a third one with a 45 second duration.  

Only one Creative is needed for each Placement duration. For example, if you had Placements with targeting values of 12:00_398_30s, 12:00_399_30s and 12:00_400_30s you would only need one Creative with a duration of 30 seconds.

### Creative URL

In order for FreeWheel SDK to send the correct Creative to the video player it needs to request the VAST XML stored in Prebid cache. The Creative URL has to point to the correct cache location.  

To ensure the cache URL is correct there are two macros that dynamically  populate the URL query. To confirm the dynamic URL is formatted correctly click on the URL link in the Detail field. A pop over will display with the dynamic URL.  

The scheme, host, and path should point to your Prebid Server cache. For instance, if you
utilize Xandr's AppNexus cache:

```text
https://prebid.adnxs.com/pbc/v1/cache
```

The query should have one key-value items:

```text
uuid=#{ad.placement.name}_#{request.keyValue(“hb_cache_id")}  
```

The first macro, `#{ad.placement.name}`, will format the Placement name. It will be the CPM_IndustryIdentfier_Duration format passed in from Prebid for targeting and the name used for the Placement. (12.00_399_30s)  

The second macro, `#{request.keyValue(“hb_cache_id”)`, formats the unique Prebid cached id.

In real-time, when the dynamic URL is formatted it will appear like:

```text
https://prebid.adnxs.com/pbc/v1/cache?uuid=12.00_391_30s_6c422e51-46cf-4b0a-ae41-64c61c1ca125
```

In order for the above URL to format correctly ensure that the URL in the text box appears as:  

```text
https://prebid.adnxs.com/pbc/v1/cache?uuid=#{ad.placement.name}_#{request.keyValue("hb_cache_id")}
```

Your ad ops should now be completed and set up for premium long-form video.
