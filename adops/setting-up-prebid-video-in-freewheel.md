---
layout: page_v2
title: Setting up Prebid Video in Freewheel
head_title: Setting up Prebid Video in Freewheel
description: Setting up Prebid Video in Freewheel
pid: 3
hide: false
top_nav_section: adops
nav_section: tutorials
sidebarType: 3
---

# Freewheel Guide for Premium Long-Form Video

This page describes how to set up `Campaigns` for long form video using Freewheel's ad server.

As with DFP for digital ads, ad ops will need to configure their Freewheel server account so that the server can provide the correct creatives for the video player. If you do not have an account visit [Freewheel](https://www.freewheel.tv) to create one.  

Once your account is set up log in to the Freewheel site. You will be presented with a dashboard area. Click on either the `Advertising button` in the top navigation bar or the `Campaign link` in the main body.

![Freewheel log in](/assets/images/freewheel/login.png)

This will display the `Campaign & IO screen`. If you have not established any campaigns yet click the `Add New Campaign` link.

![Freewheel campaigns](/assets/images/freewheel/campaigns_home.png)

This will present the `Add New Campaign` screen.

![Freewheel new campaign](/assets/images/freewheel/new_campaign.png)

 - Enter a name for the campaign  
 - Add an external identifier (optional)  
 - Select an Advertiser and Agency from the drop down menus.   
 - Click the `Create and Continue Editing button` when finished.  

You will be returned to the `Campaign & IO screen` and your new campaign should appear in the `Campaign & IOs table`. To begin your campaign you will need to create some insertion orders.

Click on the campaign name, which appears in the `Campaign column`. This will present the `Insertion Orders screen`.

![Freewheel new campaign](/assets/images/freewheel/insertion_orders_screen.png)

Click on the `Add New IO link`. This will present a pop over for adding a new `Insertion Order`.

Return to the `Campaign & IOs screen` and check the box in the first column of the row containing your I&O. Click the `Load Placements button`. This will reload the screen with the details of the `Insertion Order` you selected and the `Placements` for that `Insertion Order`.

![Freewheel new campaign](/assets/images/freewheel/selected_IO.png)

If there are no `Placements` or you want to add a new one click on the `Add New Placement` link. You will be presented with a pop over where you can enter a name and description for the `Placement`. For Prebid to interact with Freewheel’s ad server there is a strict `Placement naming convention`.

The Freewheel module within Prebid sends key-value targeting pairs to the Freewheel SDK, which then forwards them to the Freewheel server. The Freewheel server uses those targeting key-value pairs to select the correct creatives to return to Prebid. The key-value pairs are written as:

```
'hb_pb_cat_dur': ’12.00_399_30s'
```

The value is a concatenation of the CPM (12.00), the Freewheel industry code (399) and the ad length in seconds (30s). The name of the `Placement` must be written in the same format:  

```
  12.00_399_30s
```

  Once you have created a `Placement` it will appear in the first row of the `Placement table`.

![Freewheel new campaign](/assets/images/freewheel/placements_table.png)

In the last column of each row is a magnifying glass icon. Clicking on that will present detailed information about the `Placement`. In this detailed section information such as Delivery and Forecast, Schedule and Budget, Custom Targets, Exclusivity and Industry can be set for the `Placement`. The topics relevant to Prebid are covered in this section, for detailed information about all settings, visit Freewheel.tv.

## Schedule and Budget

The `Schedule and Budget` section enables an ad ops to schedule when the `Placement` will run, the price bucket and the budget type.   

Following the naming convention for `Placements`, 12.00_399_30s, the first item in the name represents the CPM (12.00). Ensure that the `Placement Price` matches the CPM. From our example, this should be $12.00. To edit, click on the `Price link`.

![Freewheel new campaign](/assets/images/freewheel/price_set.png)

The `Schedule and Budget` values should be set per your campaign requirements.  
## Custom Targeting  

The `Custom Targeting` section is where a custom target will be set to match the `key-value pair` being passed into the Freewheel server from Prebid. Ensure that the key name matches the Prebid Freewheel key, `hb_pb_cat_dur` and the value matches the naming convention discussed above, containing CPM, industry identifier and duration, 12.00_399_30s. If not, click on the `Custom Targeting` title. A pop over will display enabling you to edit the key and value.

![Freewheel new campaign](/assets/images/freewheel/custom_targeting.png)

## Industry  

The `Industry` section enables publishers to set the `Industry Group` associated with the `Placement`. Ensure that the `Industry Group` matches the Freewheel industry identifier. If not, click on the `Industry title`, a pop over will display that will enable you to change the `Industry Group`. For each `Placement` there can only be one `Industry Group`.   

The `Industry Group` must match the `Industry Group Identifier` that is contained in the passed in `key-value targeting pair`. In our example case, that `Industry Group Identifier` is `399 (12.00_399_30s)``.
