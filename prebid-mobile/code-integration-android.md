---
layout: page
title: Code Integration
description: Code Integration
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-android
---

<div class="bs-docs-section" markdown="1">

# Code Integration for Android

{:.no_toc}

Get started with Prebid Mobile by creating a [Prebid Server account]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html)

### Use Maven?

Easily include the Prebid Mobile SDK using Maven.

### Build framework from source

Build Prebid Mobile from source code. After cloning the repo, from the root directory run

```
./buildprebid.sh
```

## Ad Unit Setup for Android
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
BannerAdUnit adUnit1 = new BannerAdUnit("your-ad-unit-id-here", "your-config-id-here");
adUnit1.addSize(320, 50);
 
// Configure a Banner Ad Unit with size 300x250
BannerAdUnit adUnit2 = new BannerAdUnit("your-second-ad-unit-id-here", "your-config-id-here");
adUnit2.addSize(300, 250);
 
// Configure an Interstitial Ad Unit
InterstitialAdUnit adUnit3 = new InterstitialAdUnit("your-interstitial-ad-unit-id-here", "your-config-id-here");
 
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

## Set Ad Server Targeting Params on Ad Object
{:.no_toc}

Call API to set bid keywords on ad object. The code to attach bids immediately is below.

```java
Prebid.attachBids(ad-request-here, ad-unit-id-here, this.getActivity());
```

To wait for ads before attaching bids, implement the following listener.

```java
@Override
public void onAttachComplete(Object adObj) {
    if (adView2 != null && adObj != null && adObj instanceof PublisherAdRequest) {
        adView2.loadAd((PublisherAdRequest) adObj);
        Prebid.detachUsedBid(adObj);
    }
}
  ```



</div>