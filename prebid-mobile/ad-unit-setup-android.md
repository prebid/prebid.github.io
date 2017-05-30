---
layout: page
title: Ad Unit Setup
description: Ad Unit Setup
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-android
---

<div class="bs-docs-section" markdown="1">

# Ad Unit Setup for Android
{:.no_toc}

The steps for using prebid mobile is as following:
	1. Create a list of ad units that represents the ad spaces in your app.
	2. Add the server side configurations for each ad units.
	3. Init the sdk to start bid fetching process.
	4. Call APIs to apply the bids on your ad server's ad view, currently we provide solutions for MoPub and DFP, you can also develop for your own ad server.

### How to create ad units?

As early as possible in your app's lifecycle, create the ad units that represents the ad spaces in your app using following APIs:

```java

ArrayList<AdUnit> adUnits = new ArrayList<AdUnit>();
 
// Configure a Banner Ad Unit with size 320x50
BannerAdUnit adUnit1 = new BannerAdUnit(SampleConstants.DFP_BANNER_ADUNIT_320x50, "138c4d03-0efb-4498-9dc6-cb5a9acb2ea4");
adUnit1.addSize(320, 50);
 
// Configure a Banner Ad Unit with size 300x250
BannerAdUnit adUnit2 = new BannerAdUnit(SampleConstants.DFP_BANNER_ADUNIT_300x250, "0c286d00-b3ee-4550-b15d-f71f8e746865");
adUnit2.addSize(300, 250);
 
// Configure an Interstitial Ad Unit
InterstitialAdUnit adUnit3 = new InterstitialAdUnit("Interstitial", "35f1d17d-c99a-4d55-800e-062b80750d65");
 
// Add them to the list 
adUnits.add(adUnit1);
adUnits.add(adUnit2);
adUnits.add(adUnit3);

```

Recommended ways of creating the ad units: create a customized Application class to replace the default one, on create of the object, list the ad units and start registration

### Initialize the SDK

Once configuration is done, use the following API to start fetching prebid ads:

```java
// Register ad units for prebid.
try {
    Prebid.init(getApplicationContext(), adUnits, "account_id_from_prebid_server");
} catch (PrebidException e) {
    e.printStackTrace();
}
```

</div>
