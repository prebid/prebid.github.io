---
layout: page_v2
title: iOS GAM Bidding-Only Integration - HTML Banner
description: iOS GAM Bidding-Only Integration - HTML Banner
sidebarType: 2
---
<!-- markdownlint-disable-file MD037 -->
# iOS GAM Bidding-Only Integration - HTML Banner

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

To integrate HTML banner ads into the app you should use the `BannerAdUnit` class. It makes bid requests to Prebid Server and provides targeting keywords for the winning bid(s) to the GMA SDK.

**Integration example(Swift):**

{% capture gma12 %}func createAd() {
    // 1. Create a BannerAdUnit using Prebid Mobile SDK
    adUnit = BannerAdUnit(configId: CONFIG_ID, size: AD_SIZE)
    adUnit.setAutoRefreshMillis(time: 30000)
    adUnit.addAdditionalSize(AD_SIZE_2)
    
    // 2. Configure banner parameters using Prebid Mobile SDK
    let parameters = BannerParameters()
    parameters.api = [Signals.Api.MRAID_2, Signals.Api.OMID_1]
    adUnit.bannerParameters = parameters
    
    // 3. Create an AdManagerBannerView using Google Mobile Ads SDK
    gamBanner = AdManagerBannerView(adSize: adSizeFor(cgSize: AD_SIZE))
    gamBanner.adUnitID = AD_UNIT_ID
    gamBanner.rootViewController = self
    gamBanner.delegate = self
    
    // Add GMA SDK banner view to the app UI
    bannerView?.addSubview(gamBanner)
    
    // 4. Make a bid request to Prebid Server using Prebid Mobile SDK
    let gamRequest = AdManagerRequest()
    adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
        DemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
        
        // 5. Load GAM Ad using Google Mobile Ads SDK
        self?.gamBanner.load(gamRequest)
    }
}
{% endcapture %}
{% capture gma11 %}func createAd() {
    // 1. Create a BannerAdUnit using Prebid Mobile SDK
    adUnit = BannerAdUnit(configId: CONFIG_ID, size: AD_SIZE)
    adUnit.setAutoRefreshMillis(time: 30000)
    adUnit.addAdditionalSize(AD_SIZE_2)
    
    // 2. Configure banner parameters using Prebid Mobile SDK
    let parameters = BannerParameters()
    parameters.api = [Signals.Api.MRAID_2, Signals.Api.OMID_1]
    adUnit.bannerParameters = parameters
    
    // 3. Create a GAMBannerView using Google Mobile Ads SDK
    gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(AD_SIZE))
    gamBanner.adUnitID = AD_UNIT_ID
    gamBanner.rootViewController = self
    gamBanner.delegate = self
    
    // Add GMA SDK banner view to the app UI
    bannerView?.addSubview(gamBanner)
    
    // 4. Make a bid request to Prebid Server using Prebid Mobile SDK
    let gamRequest = GAMRequest()
    adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
        DemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
        
        // 5. Load GAM Ad using Google Mobile Ads SDK
        self?.gamBanner.load(gamRequest)
    }
}
{% endcapture %}

{% include code/gma-versions-tabs.html id="html-banner" gma11=gma11 gma12=gma12 %}

If you want to support several ad sizes, you also need to implement `GoogleMobileAds.BannerViewDelegate` to adjust banner view size according to the creative size.

In case you use a single-size banner (e.g., 300x250), you don't need to make a call to the `AdViewUtils.findPrebidCreativeSize` routine because you already know the size of the creative. However, you still need to call `bannerView.resize` because the creative in GMA has a default size of 1x1, and without this call, it will be rendered as a pixel.

{% capture gma12 %}func bannerViewDidReceiveAd(_ bannerView: GoogleMobileAds.BannerView) {
    AdViewUtils.findPrebidCreativeSize(bannerView, success: { size in
        guard let bannerView = bannerView as? AdManagerBannerView else { return }
        bannerView.resize(adSizeFor(cgSize: size))
    }, failure: { (error) in
        PrebidDemoLogger.shared.error("Error occurring during searching for Prebid creative size: \(error)")
    })
}
{% endcapture %}
{% capture gma11 %}func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {
    // 6. Resize ad view if needed (Prebid Mobile SDK)
    AdViewUtils.findPrebidCreativeSize(bannerView, success: { size in
        guard let bannerView = bannerView as? GAMBannerView else { return }
        bannerView.resize(GADAdSizeFromCGSize(size))
    }, failure: { (error) in
        // The received ad is not Prebid’s one 
    })
}
{% endcapture %}

{% include code/gma-versions-tabs.html id="html-banner-did-receive-ad-callback" gma11=gma11 gma12=gma12 %}

{: .alert.alert-info :}
Make sure you process all possible cases in the  `AdViewUtils.findPrebidCreativeSize` callbacks (both success and failure).  Sometimes you might not get the size of the creative (or a failure callback) - it simply means that this is not a Prebid creative.  It means that you still need to render the creative, but you most likely don’t need to resize it.

## Step 1: Create a `BannerAdUnit`

Initialize the `BannerAdUnit` with the properties:

- `configId` - an ID of the AdUnit Level Stored Request in the Prebid Server
- `adSize` - the size of the AdUnit which will be used in the bid request.

If you need to bid on other ad sizes as well use `addAdditionalSize()` method to provide more relevant sizes. All of them will be added to the bid request. 

## Step 2: Configure banner parameters

{% include mobile/banner-params.md %}

## Step 3: Create a AdManagerBannerView

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit. 

## Step 4: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `AdManagerRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

When Prebid Server responds, Prebid SDK will set the targeting keywords of the winning bid into provided object.

## Step 5: Call the ad server

Next, request the ad from GAM. If the `AdManagerRequest` object contains targeting keywords, the respective Prebid line item may be returned from GAM, and GMA SDK will render its creative. 

Ensure that you call the _load_ method with the same `AdManagerRequest` object that you passed to the _fetchDemand_ method on the previous step. Otherwise, the ad request won't contain targeting keywords, and Prebid bids won't be displayed.

## Step 6: Adjust the ad view size

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it's Prebid Server’s ad and resize the ad slot respectively to the creative's properties. 

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
