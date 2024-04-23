To integrate HTML banner ads into the app you should use the `BannerAdUnit` class. It makes bid requests to Prebid Server and provide targeting keywords of the winning bid to the GMA SDK.

**Integration Example (Swift):**

```swift
func createAd() {
    // 1. Create a BannerAdUnit using Prebid Mobile SDK
    adUnit = BannerAdUnit(configId: CONFIG_ID, size: adSize)
    adUnit.setAutoRefreshMillis(time: 30000)
    
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

If you want to support several ad sizes, you also need to implement `GADBannerViewDelegate` to adjust banner view size according to the creative size

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
in case you use a single-size banner (as opposed to multi-size), i.e. 300x250 - you don’t need to make a call to the `AdViewUtils.findPrebidCreativeSize` routine - because you already know the size of the creative, however you still need to make a call to `bannerView.resize` because the creative in GAM has the 1x1 size by default and without this call it will be rendered, but as a pixel. 

{: .alert.alert-info :}
Make sure you process all possible cases in the  `AdViewUtils.findPrebidCreativeSize` callbacks (both success and failure).  Sometimes you might not get the size of the creative (or a failure callback) - it simply means that this is not a Prebid creative.  It means that you still need to render the creative, but you most likely don’t need to resize it.

#### Step 1: Create a `BannerAdUnit`

Initialize the `BannerAdUnit` with the properties:

- `configId` - an ID of the AdUnit Level Stored Request in the Prebid Server
- `adSize` - the size of the AdUnit which will be used in the bid request.

If you need to bid on other ad sizes as well use `addAdditionalSize()` method to provide more relevant sizes. All of them will be added to the bid request. 

#### Step 2: Configure banner parameters

Use `BannerParameter` to customize bid request. 

The `api` property is dedicated to signal the supported creative frameworks to bidder. The selected values will be added to the bid request according to the [OpenRTB 2.6](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md) spec. GMA SDK supports creatives using the following api frameworks:

- **5** or **Signals.Api.MRAID_2** : MRAID-2 support signal
- **7** or **Signals.Api.OMID_1** : signals OMSDK support

> _Note_: MRAID 3 is in beta so far. 

#### Step 3: Create a GAMBannerView

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit. 

#### Step 4: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `GAMRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

When Prebid Server responds, Prebid SDK will set the targeting keywords of the winning bid into provided object.

#### Step 5: Call the ad server

Next, request the ad from GAM. If the `GAMRequest` object contains targeting keywords, the respective Prebid line item may be returned from GAM, and GMA SDK will render its creative. 

Ensure that you call the _load_ method with the same `GAMRequest` object that you passed to the _fetchDemand_ method on the previous step. Otherwise, the ad request won't contain targeting keywords, and Prebid bids won't be displayed.

#### Step 6: Adjust the ad view size

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it's Prebid Server’s ad and resize the ad slot respectively to the creative's properties. 