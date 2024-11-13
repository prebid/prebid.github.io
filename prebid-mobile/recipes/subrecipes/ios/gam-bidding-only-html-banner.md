---
layout: page_v2
title: iOS GAM Bidding-Only Integration - HTML Banner
description: iOS GAM Bidding-Only Integration - HTML Banner
sidebarType: 2
---

# iOS GAM Bidding-Only Integration - HTML Banner

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

To integrate HTML banner ads into the app you should use the `BannerAdUnit` class. It makes bid requests to Prebid Server and provides targeting keywords for the winning bid(s) to the GMA SDK.

Integration example:

```swift
func createAd() {
    // 1. Create a BannerAdUnit using Prebid Mobile SDK
    adUnit = BannerAdUnit(configId: CONFIG_ID, size: adSize)
    adUnit.setAutoRefreshMillis(time: 30000)
    adUnit.addAdditionalSize(adSize2)
    
    // 2. Configure banner parameters using Prebid Mobile SDK
    let parameters = BannerParameters()
    parameters.api = [Signals.Api.MRAID_2, Signals.Api.OMID_1]
    adUnit.parameters = parameters
    
    // 3. Create a GAMBannerView using Google Mobile Ads SDK
    gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(adSize))
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
```

If you want to support several ad sizes, you also need to implement `GADBannerViewDelegate` to adjust banner view size according to the creative size.

In case you use a single-size banner (e.g., 300x250), you don't need to make a call to the `AdViewUtils.findPrebidCreativeSize` routine because you already know the size of the creative. However, you still need to call `bannerView.resize` because the creative in GMA has a default size of 1x1, and without this call, it will be rendered as a pixel.

```swift
func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {
    // 6. Resize ad view if needed (Prebid Mobile SDK)
    AdViewUtils.findPrebidCreativeSize(bannerView, success: { size in
        guard let bannerView = bannerView as? GAMBannerView else { return }
        bannerView.resize(GADAdSizeFromCGSize(size))
    }, failure: { (error) in
        // The received ad is not Prebid’s one 
    })
}
```

{: .alert.alert-info :}
Make sure you process all possible cases in the  `AdViewUtils.findPrebidCreativeSize` callbacks (both success and failure).  Sometimes you might not get the size of the creative (or a failure callback) - it simply means that this is not a Prebid creative.  It means that you still need to render the creative, but you most likely don’t need to resize it.

## Step 1: Create a `BannerAdUnit`

Initialize the `BannerAdUnit` with the properties:

- `configId` - an ID of the AdUnit Level Stored Request in the Prebid Server
- `adSize` - the size of the AdUnit which will be used in the bid request.

If you need to bid on other ad sizes as well use `addAdditionalSize()` method to provide more relevant sizes. All of them will be added to the bid request. 

## Step 2: Configure banner parameters

{% include mobile/banner-params.md %}

## Step 3: Create a GAMBannerView

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit. 

## Step 4: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `GAMRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

When Prebid Server responds, Prebid SDK will set the targeting keywords of the winning bid into provided object.

## Step 5: Call the ad server

Next, request the ad from GAM. If the `GAMRequest` object contains targeting keywords, the respective Prebid line item may be returned from GAM, and GMA SDK will render its creative. 

Ensure that you call the _load_ method with the same `GAMRequest` object that you passed to the _fetchDemand_ method on the previous step. Otherwise, the ad request won't contain targeting keywords, and Prebid bids won't be displayed.

## Step 6: Adjust the ad view size

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it's Prebid Server’s ad and resize the ad slot respectively to the creative's properties. 

```swift
// GMA SDK functions
func validBannerSizes(for adLoader: GADAdLoader) -> [NSValue] {
    return [NSValueFromGADAdSize(GADAdSizeFromCGSize(adSize))]
}
```

The function above provides valid banner sizes for the ad loader. Adjust it according to the size of your ad.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
